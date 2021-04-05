import { request } from 'umi';
import api from '@/utils/config';

// 查询所有的微博用户
export async function queryAllBlogUser(params: any) {
  return request(`${api.blogUserUrl}query_all_blog_user`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}
