import Snoowrap from 'snoowrap';
import { Labmaker } from './app/APIHandler';
import * as dotenv from 'dotenv';
import { Client } from './app/Client';
import { APISocket, Events, RedditConfigDto } from '@labmaker/wrapper';
dotenv.config();

let configs: RedditConfigDto[] = [];
Labmaker.setAccessToken(process.env.API_TOKEN);
const sHandler = new APISocket(`${process.env.API_URL}/reddit`);

let clients: Client[] = [];

function socketCallback() {
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
}

sHandler.listen(process.env.API_TOKEN);
socketCallback();

async function createClients() {
  try {
    configs = await Labmaker.Reddit.getAll();

    for (const key in configs) {
      const config = configs[key];

      if (config.subreddits.length > 0) {
        //Call Init client because during the time it takes to create clients (with the 60 second wait time inbetween each client)
        //a user may update their node on the front end which calls the WS to update a config of a cliebt
        //Which hasnt been initialised yet.
        const client = clients.find((c) => c.config.id === config.id);
        if (!client && configs.includes(config)) initClient(config);
        else {
          console.log(`${config.id}: ${config.username}: +()`);
        }

        await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

createClients();
