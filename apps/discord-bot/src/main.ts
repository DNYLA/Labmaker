import DiscordClient from './utils/client';
import { registerCommands, registerEvents } from './Handlers';
import * as dotenv from 'dotenv';
import { Intents } from 'discord.js';
import PayNotifications from './utils/PayNotifications';
import { setBaseURL } from '@labmaker/wrapper';
import { listen } from './utils/socket';
dotenv.config();

const intents = new Intents(32767);
const client = new DiscordClient({ intents });

(async () => {
  listen(process.env.API_TOKEN);
  setBaseURL(process.env.API_URL, process.env.API_TOKEN);
  await registerCommands(client);
  await registerEvents(client);
  PayNotifications.listen(client);
  await client.login(process.env.BOT_TOKEN);
})();
