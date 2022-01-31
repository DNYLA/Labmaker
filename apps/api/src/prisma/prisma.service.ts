import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
    this.$use(async (params, next) => {
      // console.log(params);
      //Need this As Prisma doesnt map the values to an enum only to database
      if (params.model === 'Ticket' && params.action === 'create') {
        params.args.data.type = this.capitalize(params.args.data.type);
        params.args.data.subject = this.capitalize(params.args.data.subject);
        params.args.data.education = this.capitalize(
          params.args.data.education
        );
      }

      if (params.model === 'Applications' && params.action === 'create') {
        const subjects = params.args.data.subjects;
        // console.log(subjects);
        console.log(params.args.data);
        for (let i = 0; i < subjects.length; i++) {
          const subject = subjects[i];
          subjects[i] = this.capitalize(subject);
        }

        params.args.data.subjects = subjects;
      }

      const result = await next(params);

      return result;
    });
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
