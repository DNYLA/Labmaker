import { LabmakerAPI } from '@labmaker/wrapper';

export const Labmaker = new LabmakerAPI(
  process.env.NX_API_URL || 'http://localhost:3000',
  {
    debug: true,
    logFullErr: true,
  }
);
