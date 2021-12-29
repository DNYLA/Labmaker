import { LogDto, RedditConfigDto } from 'labmaker-api-wrapper';
import { SubmissionStream } from 'snoostorm';
import Snoowrap from 'snoowrap';
import { Labmaker } from './APIHandler';

type LocalLog = {
  username: string;
  createdAt: Date;
};
export class Client {
  constructor(private client: Snoowrap, public config: RedditConfigDto) {}
  private streams: SubmissionStream[] = [];
  private localLogs: LocalLog[] = [];
  private submissionIds = [];
  private counter = 0;
  private postCounter = 0;

  public resetListener() {
    //Remove all stream.on for each stream
    for (const s in this.streams) {
      const stream = this.streams[s];
      stream.removeAllListeners();
    }

    this.streams = [];
  }

  private async handleSubmission(item: Snoowrap.Submission) {
    const date = new Date(item.created * 1000);
    const dateNow = new Date();
    const msBetween = dateNow.getTime() - date.getTime();
    const hourDiff = msBetween / (1000 * 3600);
    const { name } = item.author;
    const { display_name } = item.subreddit;
    const config = this.config;
    let didPm = false;
    let valid = true;
    config.delay = 0;

    if (hourDiff > 24) {
      return;
    }

    const validId = this.submissionIds.find((subId) => subId === item.id);
    console.log(this.counter, ':', display_name);

    if (!validId) {
      this.submissionIds.push(item.id);
      this.counter++;
    } else {
      return;
    }

    //Filter is Synchronous
    config.blockedUsers.filter((u) => {
      if (u.toLowerCase() === name.toLowerCase()) valid = false;
    });
    config.forbiddenWords.filter((word) => {
      if (word.includes(item.title.toLowerCase())) valid = false;
      else if (word.includes(item.selftext.toLowerCase())) valid = false;
    });

    if (valid) {
      this.localLogs.forEach((log) => {
        if (log.username === name) {
          const msDifference = date.getTime() - log.createdAt.getTime();
          const minuteDiff = msDifference / (1000 * 60);
          if (minuteDiff < 60) {
            //Dont RePM within 60Mins
            valid = false;
          }
        }
      });
    }

    if (this.localLogs.length > 300) {
      this.localLogs.splice(0, 150); //Removes first 150 Logs as they should be useless
    }
    this.localLogs.push({ username: name, createdAt: new Date() });
    setTimeout(() => {
      try {
        if (valid) {
          // await this.client.composeMessage({
          //   to: item.author,
          //   subject: newConfig.title,
          //   text: newConfig.pmBody,
          // });

          console.log(
            `${this.postCounter} : ${name} : ${display_name}  : ${config.pmBody}`
          );

          didPm = true;
          this.postCounter++;
        }
      } catch (err) {
        console.error(`Error Occured ${err.message}`);
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

      Labmaker.Log.create(log);
    }, config.delay * 1000);
  }

  public updateClient(client: Snoowrap, config: RedditConfigDto) {
    this.client = client;
    this.config = config;
    this.createEvent();
  }

  async createEvent() {
    this.submissionIds = await Labmaker.Log.getSubmissionIds(this.config.id);
    this.resetListener();
    const delay = CalculateMinimumDelay(this.config.subreddits.length, 5) * 3; //Minimum Delay is too little to poll anyways

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
