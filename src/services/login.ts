import { request } from 'umi';
import api from '@/utils/config';

// 注册
export async function LoginRegister(params: any) {
  return request(`${api.loginUrl}register_system`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

// 系统登录
export async function LoginSystem(params: any) {
  return request(`${api.loginUrl}login_system`, {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

// 系统登出
export async function logoutSystem() {
  return request(`${api.loginUrl}logout_system`,{
    method: 'POST',
  });
}

// 获取取用户信息
export async function queryAdminDetail() {
  return request(`${api.loginUrl}query_admin_detail`);
}