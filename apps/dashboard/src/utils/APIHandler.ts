// import { LabmakerAPI } from '@labmaker/wrapper';

import { LabmakerAPI } from '@labmaker/wrapper';
// import { LabmakerAPI } from '@labmaker/wrapper';

export const Labmaker = new LabmakerAPI(
  process.env?.['APURL'] || 'http://localhost:3000',
  {
    debug: true,
    logFullErr: true,
  }
);
