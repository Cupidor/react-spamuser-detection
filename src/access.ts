// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    isSeller: currentUser && currentUser.type === '商家',
    isBuyer: currentUser && currentUser.type === '用户',
    isAdministrator: currentUser && currentUser.type === '管理员',
  };
}
