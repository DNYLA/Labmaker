import { io } from 'socket.io-client';

//Could Split up into
export class APISocket {
  constructor(private APIUrl: string) {}

  public socket = io();

  public listen(accessToken: string) {
    this.socket = io(this.APIUrl, {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket Conected');
      this.socket.send('message', 'hi');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket Disconnected'); // false
    });

    this.socket.on('error', () => {
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

    // this.socket.on(Events.Config, (data) => {
    //   callback(Events.Config, data);
    // });

    // this.socket.on(Events.Delete, (data) => {
    //   callback(Events.Delete, data);
    // });
  }

  // public listenFor(event: Events, callback: ICallback) {
  // this.socket.on(event, (data) => {
  //   callback(event, data);
  // });
  // }
}
