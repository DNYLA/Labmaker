import { RedditConfig, Role } from '.prisma/client';

export type UserDto = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  role: Role;
  subjects: string[];

  //Currently Not Fetched but this might just be an easier way of displaying user
  //Tickets means less fetching?
  // studentTickets: string[];
  // tutorTickets: string[];
};

export type AdminUser = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  nodes: RedditConfig[];
  role: Role;
};
