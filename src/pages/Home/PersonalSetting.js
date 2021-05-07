import React, { PureComponent } from 'react';
import {
  Menu,
  Typography,
  Modal,
  List,
} from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import NewUser from '@/pages/Home/components/NewUser'
import { queryUserInfo } from '@/services/user_info';

const { Text, Title } = Typography;
const { confirm } = Modal;

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentKeys: '安全设置',
      isPwdOpened: false,
      operateType: '编辑用户'
    };
    this.userInfo = null;
  }

  componentDidMount() {
    this.getMyInfo()
  }

  // 获取我的信息
  getMyInfo = async () => {
    const res = await queryUserInfo({ userInfoId: localStorage.getItem('userId') });
    if (res.result) {
      let obj = Object.create(null);
      obj.key = res.result.id;
      obj.createTime = res.result.createTime;
      obj.user_name = res.result.uname;
      obj.latest_update_time = res.result.latestUpdateTime;
      obj.password = res.result.pwd;
      obj.user_type = res.result.userType;
      this.userInfo = obj
    }
  }

  handleClick = (e) => {
    this.setState({
      currentKeys: e.key
    })
  }

  // 设置弹框状态
  isPwdOpened = (status) => {
    this.setState({
      isPwdOpened: status
    })
  }

  render() {
    const {
      currentKeys,
      isPwdOpened,
      operateType
    } = this.state;
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader}>
            <div className={global.MyTitle}>
              <div className={global.MyTitlePoint}>
                <img
                  src={require('@/assets/image/icon_title.png')}
                  className={global.MyTitleImg}
                ></img>
              </div>
              <Text style={{ fontSize: 16 }}>个人设置</Text>
            </div>
          </div>
          <div className={global.MyBody}>
            <div className={global.MyBodyLeft}>
              <div className={global.MyList}>
                <Menu mode='inline' selectedKeys={[currentKeys]} onClick={this.handleClick}>
                  {/*<Menu.Item key="基本设置">
                    基本设置
                  </Menu.Item>*/}
                  <Menu.Item key="安全设置">
                    安全设置
                  </Menu.Item>
                </Menu>
              </div>
            </div>
            <div className={global.MyBodyRight} style={{ padding: '20px 30px 20px 30px' }}>
              <Text style={{ fontSize: 22 }}>{currentKeys}</Text>
              {currentKeys === '安全设置' && <div>
                <List style={{ marginTop: 10 }}>
                  <List.Item
                    actions={[<a key="list-pwd-edit" onClick={() => this.isPwdOpened(true)}>修改</a>]}
                  >
                    <List.Item.Meta
                      title='账户密码'
                      description="点击修改重新设置账户密码"
                    />
                  </List.Item>
                </List>
              </div>}
            </div>
          </div>
        </div>
        <div className={global.MyFooter}>
          <Footer />
        </div>
        <NewUser
          visible={isPwdOpened}
          detail={this.userInfo}
          title={operateType}
          callBack={this.getMyInfo}
          closeModal={this.isPwdOpened}
        ></NewUser>
      </div>
    );
  }
}

export default Index;
