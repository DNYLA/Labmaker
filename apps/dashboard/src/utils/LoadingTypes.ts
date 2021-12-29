import { GuildConfig, LogType, Node, PaymentType } from './types';

export const loadingLogs: LogType = {
  id: -1,
  nodeId: 0,
  message: 'Loading Logs...',
  subId: 'Loading...',
  username: 'Loading...',
  subreddit: 'Homework',
  createdAt: new Date().toString(),
  pm: true,
  loading: true,
};

export const loadingPayment: PaymentType = {
  id: -1,
  serverId: '0',
  name: 'Loading Payments...',
  value: 'Loading...',
  type: 'Loading...',
  loading: true,
};

export const loadingRedditConfig: Node = {
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

export const loadingDiscordConfig: GuildConfig = {
  id: '-1',
  name: 'Loading Server',
  paymentConfigId: '0',
  prefix: '?',
  embedImageUrl: 'http://www.image.com/image.png',
  autoSwitcher: false,
  autoReact: false,
  autoTicket: false,
  loading: true,
};

export const nodeTemplate: Node = {
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
  newNode: true,
};
