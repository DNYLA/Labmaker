import { io } from 'socket.io-client';
import { ICallback, Events } from './types';

//Could Split up into
export class APISocket {
  constructor(private APIUrl: string, private accessToken: string) {}

  public socket = io();

  public listen(callback: ICallback) {
    this.socket = io(this.APIUrl, {
      extraHeaders: {
        Authorization: this.accessToken,
      },
    });

    this.socket.on('connect', () => {
      console.log('Socket Conected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket Disconnected'); // false
    });

    this.socket.on('error', (data) => {
      console.log('Error Occured');
    });

    this.socket.on('exception', (ex) => {
      switch (ex.code) {
        case 401: {
          console.log('Invalid API token provided. Disconnecting Client.');
          this.socket.disconnect();
        }
      }
    });

    this.socket.on(Events.Config, (data) => {
      callback(Events.Config, data);
    });

    this.socket.on(Events.Delete, (data) => {
      callback(Events.Delete, data);
    });
  }
}
