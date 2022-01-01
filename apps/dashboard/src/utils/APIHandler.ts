import { APISocket, LabmakerAPI } from '@labmaker/wrapper';
import { io } from 'socket.io-client';

export const Labmaker = new LabmakerAPI(
  process.env.NX_API_URL || 'http://localhost:3000',
  {
    debug: true,
    logFullErr: true,
  }
);
