// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    isNomal: currentUser && currentUser.userType === '普通用户',
    isAdministrator: currentUser && currentUser.userType === '管理员',
  };
}
