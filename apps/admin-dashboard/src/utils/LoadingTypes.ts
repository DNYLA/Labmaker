import {
  Guild,
  GuildConfigDto,
  LogDto,
  RedditConfigDto,
} from '@labmaker/wrapper';
import { RedditConfig, Payment, User } from './types';

export const defaultUser: User = {
  id: '-1',
  username: 'Username',
  discriminator: '4444',
  avatar: 'http://google.com',
  nodes: [],
  editableNodes: [],
  loading: true,
};

export const loadingLogs: LogDto = {
  id: -1,
  nodeId: -1,
  message: 'Loading Logs...',
  subId: 'Loading...',
  username: 'Loading...',
  subreddit: 'Homework',
  createdAt: new Date().toString(),
  pm: true,
};

export const loadingPayment: Payment = {
  id: -1,
  serverId: '0',
  name: 'Loading Payments...',
  value: 'Loading...',
  type: 'Loading...',
  loading: true,
};

export const loadingRedditConfig: RedditConfig = {
  id: -1,
  userId: '0',
  clientId: '0',
  clientSecret: 'Client Secret',
  username: 'Username',
  password: 'Password',
  userAgent: 'Firefox',
  title: 'Hey',
  pmBody: 'I Saw Your Post...',
  delay: 0,
  subreddits: ['Subreddit1', 'Subreddit2'],
  forbiddenWords: ['ForbiddenWord1', 'Forbidden String 1'],
  blockedUsers: ['Blocked_User1', 'Blocked_User2'],
  nodeEditors: [],
  loading: true,
};

export const loadingDiscordConfig: GuildConfigDto = {
  id: '-1',
  name: 'Loading Server',
  paymentConfigId: '0',
  prefix: '?',
  embedImageUrl: 'http://www.image.com/image.png',
  autoSwitcher: false,
  autoReact: false,
  autoTicket: false,
};

export const loadingServer: Guild = {
  id: '0',
  name: 'Name',
  icon: 'Icon',
  owner: false,
  permissions: '1234',
  features: [],
  joined: false,
};

export const redditTemplate: RedditConfigDto = {
  id: -1,
  userId: '0',
  clientId: '',
  clientSecret: '',
  username: 'Create',
  password: '',
  userAgent: '',
  title: '',
  pmBody: '',
  delay: 5000,
  subreddits: ['Subreddit'],
  forbiddenWords: [],
  blockedUsers: [],
  nodeEditors: [],
};
