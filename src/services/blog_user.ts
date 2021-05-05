import { request } from 'umi';
import api from '@/utils/config';

// 查询所有的微博用户
export async function queryBlogByCondition(params: any) {
  return request(`${api.blogUserUrl}query_by_condition`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}

// 删除微博用户
export async function deleteBlogUser(params: any) {
  return request(`${api.blogUserUrl}delete_blog_user`, {
    method: 'DELETE',
    requestType: 'form',
    data: params,
  });
}

// 查询用户的粉丝
export async function queryFans(params: any) {
  return request(`${api.blogUserUrl}query_fans`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}

// 查询用户关注的用户
export async function queryFollower(params: any) {
  return request(`${api.blogUserUrl}query_follower`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}

// 检验微博用户是否是垃圾用户：true是垃圾用户，false是正常用户
export async function checkBlogUser(params: any) {
  return request(`${api.blogUserUrl}check_blog_user`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}