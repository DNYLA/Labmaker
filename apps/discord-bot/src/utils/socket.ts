import { GuildConfig } from '@labmaker/shared';
import DiscordClient from './client';
import { io } from 'socket.io-client';

export const listen = (accessToken: string, client: DiscordClient) => {
  const socket = io(process.env.API_URL, {
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  //#region Base Events
  socket.on('connect', () => {
    console.log('Connected to WebSocket');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket'); // false
  });

  socket.on('error', (err) => {
    console.log('Error with WebSocket');
    console.log(err);
  });

  socket.on('exception', (ex) => {
    console.log(ex);
    switch (ex.code) {
      case 401: {
        console.log('Invalid API token privded. Disconnecting Client.');
        socket.disconnect();
      }
    }
  });
  //#endregion

  socket.on('guildConfig', (configJson: string) => {
    console.log('New Config');
    try {
      const config: GuildConfig = JSON.parse(configJson);
      client.setConfig(config);
    } catch (err) {
      console.log(err);
    }
  });
};
