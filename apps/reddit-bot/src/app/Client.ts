import {
  createLog,
  getSubmissionIds,
  LogDto,
  RedditConfigDto,
} from '@labmaker/wrapper';
import { SubmissionStream } from 'snoostorm';
import Snoowrap from 'snoowrap';

type LocalLog = {
  username: string;
  createdAt: Date;
};
export class Client {
  constructor(private client: Snoowrap, public config: RedditConfigDto) {}
  private streams: SubmissionStream[] = []; //Active Subreddit Streams
  //Merge LocalLogs + Submission Ids Into One
  private localLogs: LocalLog[] = [];
  private submissionIds = [];
  //Counters for Logging.
  private counter = 0;
  private postCounter = 0;

  //Remove all stream.on for each stream
  public resetListener() {
    for (const s in this.streams) {
      const stream = this.streams[s];
      stream.removeAllListeners();
    }

    this.streams = [];
  }

  private async handleSubmission(item: Snoowrap.Submission) {
    //Init Variables
    const date = new Date(item.created * 1000);
    const dateNow = new Date();
    const msBetween = dateNow.getTime() - date.getTime();
    const hourDiff = msBetween / (1000 * 3600);
    const { name } = item.author;
    const { display_name } = item.subreddit;
    const config = this.config;
    let valid = true;
    config.delay = 30;

    //Dont PM if Submission was created over 24 hours ago
    //Can Move this to Dashboard and use the value from that?
    if (hourDiff > 24) {
      return;
    }

    //Check if we have already looked through the submission & return if true
    const validId = this.submissionIds.find((subId) => subId === item.id);
    console.log(this.counter, ':', display_name);
    if (validId) return;

    //Update Local Variables
    this.submissionIds.push(item.id);
    this.counter++;

    //Check if Submission Author is blocked in the config
    await Promise.all(
      config.blockedUsers.map((u) => {
        if (u.toLowerCase() === name.toLowerCase()) valid = false;
      })
    );

    //Check if the post & title includes any forbidden words
    //Map is Async? so we Await it
    await Promise.all(
      config.forbiddenWords.map((word) => {
        if (item.title.toLowerCase().includes(word.toLowerCase())) {
          valid = false;
        } else if (item.selftext.toLowerCase().includes(word.toLowerCase())) {
          valid = false;
        }
      })
    );

    //Check if we have already PM'd this user before
    //A Better way to do this would be by pushing the username & date into a Set (Unique Array) and then looping through that unique array
    //This change would only increase performance by a small margin however.
    //A Better Alternative could be to set a CronJob that runs every x minutes/hours
    //which checks through each log and deletes any that are over an hour long (This way when we loop through the LocalLogs array we only get back)
    // People we PMDM within an hour.
    if (valid) {
      this.localLogs.forEach((log) => {
        if (log.username === name) {
          const msDifference = date.getTime() - log.createdAt.getTime();
          const minuteDiff = msDifference / (1000 * 60);
          if (minuteDiff < 60) {
            //Dont RePM within 60Mins
            console.log(
              `${item.author.name} : ${item.subreddit.name} : DontRePM() ${item.id}`
            );
            valid = false;
          }
        }
      });
    }

    //Removes first 150 Logs if local logs > 300 as they should be useless
    if (this.localLogs.length > 300) {
      this.localLogs.splice(0, 150);
    }

    this.localLogs.push({ username: name, createdAt: new Date() });
    setTimeout(() => this.sendPM(valid, item, config), config.delay * 1000);
  }

  private async sendPM(
    valid: boolean,
    item: Snoowrap.Submission,
    config: RedditConfigDto
  ) {
    const { display_name } = item.subreddit;
    const { name } = item.author;
    let didPm = false;

    try {
      if (valid) {
        //Dont want to PM when Debugging (Could check if we are in .env.development <- that would be better)
        if (!process.env.API_DEBUG) {
          //This can Cause an Error Sometimes -> User Blocked, User Doesnt Exist, Etc.
          await this.client.composeMessage({
            to: item.author,
            subject: config.title,
            text: config.pmBody,
          });
        }

        console.log(
          `${this.postCounter} : ${name} : ${display_name}  : ${config.pmBody} : SentPM()`
        );

        didPm = true;
        this.postCounter++;
      }

      const log: LogDto = {
        id: 0,
        nodeId: config.id,
        username: name,
        message: config.pmBody,
        subreddit: display_name,
        subId: item.id,
        pm: didPm,
      };
      //Error Will get Caught Below
      createLog(log);
    } catch (err) {
      console.error(`Error Occured ${err.message}`);
    }
  }

  public updateClient(client: Snoowrap, config: RedditConfigDto) {
    this.client = client;
    this.config = config;
    this.createEvent();
  }

  async createEvent() {
    try {
      const { data } = await getSubmissionIds(this.config.id);
      this.submissionIds = data;
    } catch (err) {
      console.log('Unable to fetch SubmissionIDs');
    }

    //Fetch Logs from API on start instead of just Submission Ids?
    // const fetchedLogs = await Labmaker.Log.getLogs(this.config.id);
    // this.localLogs.push(fetchedLogs);

    //Just a precaution the client shouldnt have any listeners when calling CreateEvent
    this.resetListener();
    const delay = CalculateMinimumDelay(this.config.subreddits.length, 5) * 3; //Minimum Delay is too little to poll anyways

    //Create Event Streams
    this.config.subreddits.forEach((subreddit, index) => {
      this.streams.push(
        new SubmissionStream(this.client, {
          subreddit,
          limit: 5,
          pollTime: delay,
        })
      );

      console.log(
        `Created Event for ${subreddit} with a delay of ${delay} for user ${this.config.username}`
      );

      this.streams[index].on('item', async (item) => {
        try {
          this.handleSubmission(item);
        } catch (err) {
          console.log(err);
          console.log('Error Whilst handling submission');
        }
      });
    });
  }
}

//Snoowrap delays Posts every second anyways but this option allows us to not constantly call subreddits
//Calculates the minimum amount of delay to send a GET request every second at Worst Case scenario
function CalculateMinimumDelay(subredditLen: number, maxSubLimit: number) {
  const maxRateLimit = 600 - subredditLen * maxSubLimit; //Incase we PM every subreddit with the amount of submissions we retreive
  const maxRateMin = maxRateLimit / 10; //600 Requests every 10 minutes
  const delay = 60 / (maxRateMin / subredditLen);
  return delay * 1000; //returns in MS
}
