import { LabmakerAPI } from '@labmaker/wrapper';
import { io, Socket } from 'socket.io-client';

export const Labmaker = new LabmakerAPI(
  process.env.NX_API_URL || 'http://localhost:3000',
  {
    debug: true,
    logFullErr: true,
  }
);

// export const LabmakerSocket = new APISocket(
//   `${process.env.NX_API_URL}/reddit` || 'http://localhost:3000/reddit'
// );

export let LabmakerSocket: Socket | null = null;

export function InitSocket(accessToken: string) {
  const socket = io(`${process.env.NX_API_URL}`, {
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!socket) return;

  socket.on('connect', () => {
    console.log('Socket Conected');
    socket.send('message', 'hi');
  });

  socket.on('disconnect', () => {
    console.log('Socket Disconnected'); // false
  });

  socket.on('error', (data) => {
    console.log('Error Occured');
  });

  socket.on('exception', (ex) => {
    switch (ex.code) {
      case 401: {
        console.log(ex);
        console.log('Invalid API token provided. Disconnecting Client.');
        socket.disconnect();
      }
    }
  });

  LabmakerSocket = socket;
}
