export const routes = [
  {
    name: 'Home',
    to: '/',
  },
  { name: 'discord' },
  { name: 'logs' },
];

export const superRoutes = [...routes, { name: 'Clients', to: 'clients' }];
