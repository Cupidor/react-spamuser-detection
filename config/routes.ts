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
    path: '/personalSetting',
    name: 'personalSetting',
    component: './Home/PersonalSetting',
    hideInMenu: true
  },
  {
    path: '/home',
    name: 'home',
    icon: 'Home',
    component: './Home/Home',
    access: 'isAdministrator'
  },
  {
    path: '/weiboManagement',
    name: 'weiboManagement',
    icon: 'Weibo',
    component: './Home/WeiboManagement',
    access: 'isAdministrator'
  },
  {
    path: '/weiboDetail/:blogUserId',
    name: 'weiboDetail',
    icon: 'Weibo',
    component: './Home/WeiboDetail',
    hideInMenu: true,
    access: 'isAdministrator'
  },
  {
    path: '/userManagement',
    name: 'userManagement',
    icon: 'Team',
    component: './Home/UserManagement',
    access: 'isAdministrator'
  },
  {
    path: '/weiboDetection',
    name: 'weiboDetection',
    icon: 'Weibo',
    component: './Normal/Search',
    access: 'isNomal'
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
