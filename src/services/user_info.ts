import { request } from 'umi';
import api from '@/utils/config';

// 条件查询系统用户
export async function queryUserByCondition(params: any) {
  return request(`${api.userInfoUrl}query_by_condition`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}

// 查询系统用户
export async function queryUserInfo(params: any) {
  return request(`${api.userInfoUrl}query_user_info`, {
    method: 'GET',
    requestType: 'form',
    params,
  });
}

// 删除系统用户
export async function deleteUserInfo(params: any) {
  return request(`${api.userInfoUrl}delete_user_info`, {
    method: 'DELETE',
    requestType: 'form',
    data: params,
  });
}
