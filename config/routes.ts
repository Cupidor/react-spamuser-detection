export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
          {
            name: 'register',
            path: '/user/register',
            component: './User/login/register',
          }
        ],

      },
    ],
  },
  {
    path: '/home',
    name: 'home',
    icon: 'Home',
    component: './Home/Home',
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
