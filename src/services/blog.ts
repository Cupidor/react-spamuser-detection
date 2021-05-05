import { request } from 'umi';
import api from '@/utils/config';

// 条件查询微博
export async function queryWeiBoByCondition(params: any) {
  return request(`${api.blogUrl}query_by_condition`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}

// 删除微博
export async function deleteBlog(params: any) {
  return request(`${api.blogUrl}delete_blog`, {
    method: 'DELETE',
    requestType: 'form',
    data: params,
  });
}