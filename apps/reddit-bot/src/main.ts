import Snoowrap from 'snoowrap';
import * as dotenv from 'dotenv';
import { Client } from './app/Client';
import {
  APISocket,
  Events,
  getRedditConfigs,
  RedditConfigDto,
  setBaseURL,
} from '@labmaker/wrapper';
dotenv.config();

//I Think Configs is Pointless? Although i may have added it as createClients waits 10 seconds to initialize and sometimes
//Configs can get updated within that time before the client has been created. <- Fix this by replacing it with DeletedIds? which is temporary?
let configs: RedditConfigDto[] = [];
setBaseURL(process.env.API_URL, process.env.API_TOKEN);
const sHandler = new APISocket(`${process.env.API_URL}`);

let clients: Client[] = [];

function socketCallback() {
  //Update Callbacks to TypeCast Data <- This needs to be done on the API
  sHandler.socket.on(Events.Config, (data) => {
    initClient(JSON.parse(data));
  });

  sHandler.socket.on(Events.Delete, (data) => {
    deleteClient(data);
  });
}

function deleteClient(id: number) {
  const client = clients.find((c) => c.config.id === id);
  if (!client) {
    configs = configs.filter((c) => c.id !== id); //If it hasnt been initialized yet we can filter and remove it before it is initialised.
    console.log(`${id} : deleting()`);
    return;
  }
  console.log(`${client.config.id}: ${client.config.username}: deleting()`);

  client.resetListener();
  clients = clients.filter((c) => c.config.id !== id);
}

function initClient(config: RedditConfigDto) {
  const client = clients.find((c) => c.config.id === config.id);

  const snooClient = new Snoowrap({
    userAgent: config.userAgent,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    username: config.username,
    password: config.password,
  });
  snooClient.config({
    continueAfterRatelimitError: true,
    requestDelay: 1001,
    debug: false,
    maxRetryAttempts: 3,
  });

  //Fetching getMe ensures that the details provided by the user are working
  snooClient
    .getMe()
    .then(() => {
      try {
        if (client && config.subreddits.length > 0) {
          console.log(`${config.id}: ${config.username}: Updated()`);
          client.updateClient(snooClient, config);
        } else if (config.subreddits.length > 0) {
          console.log(`${config.id}: ${config.username}: Creating()`);
          const c = new Client(snooClient, config);
          c.createEvent();
          clients.push(c);
        }
      } catch (err) {
        console.log('Error Occured');
      }
    })
    .catch(() =>
      console.log(`${config.username} Invalid Credentials Provided`)
    );
}

async function createClients() {
  try {
    const { data: fetchedConfigs } = await getRedditConfigs();
    configs = fetchedConfigs;
  } catch (err) {
    console.log(err.message);
  }

  for (const key in configs) {
    const config = configs[key];

    if (config.subreddits.length > 0) {
      //Call Init client because during the time it takes to create clients (with the 60 second wait time inbetween each client)
      //a user may update their node on the front end which calls the WS to update a config of a cliebt
      //Which hasnt been initialised yet.
      try {
        const client = clients.find((c) => c.config.id === config.id);
        if (!client && configs.includes(config)) initClient(config);
        else {
          console.log(`${config.id}: ${config.username}: +()`);
        }
        await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
      } catch (err) {
        console.log(`Unable to Create Client for ${config.username}`);
        console.log(err);
      }
    }
  }
}

//Main Function
(() => {
  console.log('Starting Reddit Bot. Fetching Configs');
  sHandler.listen(process.env.API_TOKEN);
  socketCallback();
  createClients();
})();
