import React, { PureComponent } from 'react';
import { Space, Typography, message, Modal, Table, Tag, Popconfirm } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { queryUserByCondition, deleteUserInfo } from '@/services/user_info';
import { numberDateFormat } from '@/utils/utils';

const { Text, Title } = Typography;
const { confirm } = Modal;

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      searchValue: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isNewUserVisible: false,
      userType: '',
      tableLoading: false,
    };
    this.info = null;
    this.userInfo = null;
  }

  componentDidMount() {
    this.getAllUsers();
  }

  // 获取所有用户
  getAllUsers = async () => {
    const { pageSize, searchValue, currentPage } = this.state;
    this.setState({
      tableLoading: true,
    });
    let res = await queryUserByCondition({
      limit: pageSize,
      offset: pageSize * (currentPage - 1),
      sortColumnName: 'create_time',
      sortOrderType: 'desc',
    });
    if (res.code === '0000') {
      let users = [];
      for (let item of res.result) {
        let obj = Object.create(null);
        obj.key = item.id;
        obj.createTime = item.createTime;
        obj.user_name = item.uname;
        obj.latest_update_time = item.latestUpdateTime;
        obj.password = item.pwd;
        obj.user_type = item.userType;
        users.push(obj);
      }
      this.setState({
        users,
        total: res.total_num,
        tableLoading: false,
      });
    } else {
      message.error(res.message);
    }
  };

  // 查询用户
  onSearch = (value) =>
    this.setState({ searchValue: value, currentPage: 1 }, () => {
      this.getAllUsers();
    });

  // 分页页面跳转
  onPageChange = (page, pageSize) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getAllUsers();
      },
    );
  };

  // 删除用户
  deleteCurrentUser = async (id) => {
    let res = await deleteUserInfo({ userInfoId: id });
    if (res.code === '0000') {
      message.success('删除用户成功');
      this.getAllUsers();
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { users } = this.state;
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => <span>{numberDateFormat(text, 'yyyy-MM-dd HH:mm')}</span>,
      },
      {
        title: '最近更新时间',
        dataIndex: 'latest_update_time',
        key: 'latest_update_time',
        render: (text) => <span>{numberDateFormat(text, 'yyyy-MM-dd HH:mm')}</span>,
      },
      {
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '用户类型',
        dataIndex: 'user_type',
        key: 'user_type',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            {/*<a style={{ color: 'green' }} onClick={this.editCurrentUser.bind(this, record)}>
              编辑
        </a>*/}
            {record.is_manager !== true && (
              <Popconfirm
                title="确定删除该系统用户?"
                onConfirm={this.deleteCurrentUser.bind(this, record.key)}
              >
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ];
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader}>
            <div className={global.MyTitle}>
              <Text style={{ fontSize: 16 }}>系统用户管理</Text>
            </div>
            <Space>
              {/*<Search placeholder="请输入用户名或姓名" onSearch={this.onSearch} enterButton />*/}
            </Space>
          </div>
          <div className={global.MyBody}>
            <div className={global.MyBodyRight}>
              <Table
                loading={this.state.tableLoading}
                columns={columns}
                dataSource={users}
                pagination={{
                  hideOnSinglePage: true,
                  showQuickJumper: true,
                  showSizeChanger: false,
                  current: this.state.currentPage,
                  pageSize: this.state.pageSize,
                  total: this.state.total,
                  onChange: (page, pageSize) => this.onPageChange(page, pageSize),
                }}
              />
            </div>
          </div>
        </div>
        <div className={global.MyFooter}>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Index;
