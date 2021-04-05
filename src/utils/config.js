const config = {};
const version = 'test';
if (version === 'prod') {
  config.host = 'http://127.0.0.1:8011';
} else if (version === 'test') {
  config.host = 'http://wcxweb.51vip.biz';
}
// 系统登录接口
config.loginUrl = config.host + '/login/';
// 微博用户接口
config.blogUserUrl = config.host + '/blog_user/';
export default config;
