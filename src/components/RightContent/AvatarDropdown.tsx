import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { logoutSystem } from '@/services/login';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  let res = await logoutSystem();
  if (res.code === '0000') {
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login') {
      history.replace({
        pathname: '/user/login',
      });
    }
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
        return;
      }
      history.push(`/user/login`);
    },
    [initialState, setInitialState],
  );

  /*const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;
  let avatarName = '';

  if (!currentUser || !currentUser.uname) {
    return loading;
  } else {
    avatarName = currentUser.uname.substr(0, 1).toUpperCase();
  }*/
  let uname = localStorage.getItem('userName');
  let avatarName = '默';
  if (uname !== null) {
    avatarName = uname!.substr(0, 1).toUpperCase();
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size={35} className={styles.avatar} alt="avatar">
          {avatarName}
        </Avatar>
        <span className={`${styles.name} anticon`}>{uname}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
