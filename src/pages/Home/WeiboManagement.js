import React, { PureComponent } from 'react';
import { Space, Typography, message, Modal, Table, Avatar, Popconfirm, Image, Button, Form, Input } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { queryBlogByCondition, createBlogUser, deleteBlogUser, queryFans, queryFollower } from '@/services/blog_user';
import { PlusCircleOutlined } from '@ant-design/icons'
import { history } from 'umi'
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const formRef = React.createRef();

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
      userType: '',
      tableLoading: false,
      isModalVisible: false
    };
    this.info = null;
    this.userInfo = null;
  }

  componentDidMount() {
    this.getAllBlogUser();
  }

  // 获取所有用户
  getAllBlogUser = async () => {
    const { pageSize, searchValue, currentPage } = this.state;
    this.setState({
      tableLoading: true,
    });
    let res = await queryBlogByCondition({
      limit: pageSize,
      offset: pageSize * (currentPage - 1),
      sortColumnName: 'register_time',
      sortOrderType: 'desc',
    });
    if (res.code === '0000') {
      for (let item of res.result) {
        item.key = item.id
      }
      this.setState({
        users: res.result,
        total: res.totalNum,
        tableLoading: false,
      });
    } else {
      message.error(res.message);
    }
  };

  // 查询用户
  onSearch = (value) =>
    this.setState({ searchValue: value, currentPage: 1 }, () => {
      this.getAllBlogUser();
    });

  // 分页页面跳转
  onPageChange = (page, pageSize) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getAllBlogUser();
      },
    );
  };

  // 删除用户
  deleteCurrentUser = async (id) => {
    let res = await deleteBlogUser({ blogUserId: id });
    if (res.code === '0000') {
      message.success('删除微博用户成功');
      this.getAllBlogUser();
    } else {
      message.error(res.message);
    }
  };

  getFans = async (id) => {
    let res = await queryFans({ blogUserId: id });
    if (res.code === '0000') {
      Modal.success({
        title: '我的粉丝',
        content: (
          <div>
            {res.result.length === 0 ? '无' : res.result.map((item, index) => {
              return <div key={index}><Avatar
                src={<Image src={item.headPortraitUrl} />}
              />&nbsp;&nbsp;{item.nickName}</div>
            })}
          </div>
        ),
        onOk() { },
      });
    } else {
      message.error(res.message);
    }
  }

  getFollower = async (id) => {
    let res = await queryFollower({ blogUserId: id });
    if (res.code === '0000') {
      Modal.success({
        title: '我的关注',
        content: (
          <div>
            {res.result.length === 0 ? '无' : res.result.map((item, index) => {
              return <div key={index}><Avatar
                src={<Image src={item.headPortraitUrl} />}
              />&nbsp;&nbsp;{item.nickName}</div>
            })}
          </div>
        ),
        onOk() { },
      });
    } else {
      message.error(res.message);
    }
  }

  getWeibo = id => {
    history.push(`/weiboDetail/${id}`)
  }

  setModalStatus = (status) => {
    this.setState({
      isModalVisible: status
    })
  }

  // 确定
  handleOk = () => {
    formRef.current.validateFields().then((values) => {
      this.onFinish(values);
    });
  };

  // 取消
  handleCancel = () => {
    formRef.current.setFieldsValue({ uuid: '' });
    this.setModalStatus(false)
  };

  // 表单提交
  onFinish = async (values) => {
    this.setState({
      confirmLoading: true,
    });
    let res = await createBlogUser({ ...values });
    if (res.code === '0000') {
      message.success(`添加成功`);
      this.getAllBlogUser();
      this.handleCancel()
    } else {
      if (res.message) {
        message.error(res.message);
      }
    }
    this.setState({
      confirmLoading: false,
    });
  };

  render() {
    const { users, isModalVisible, confirmLoading } = this.state;
    const columns = [
      /*{
        title: '创建时间',
        dataIndex: 'registerTime',
        key: 'registerTime',
        render: (text) => <span>{numberDateFormat(text, 'yyyy-MM-dd HH:mm')}</span>,
      },*/
      {
        title: '头像',
        dataIndex: 'headPortraitUrl',
        key: 'headPortraitUrl',
        render: (text) => <Avatar
          src={<Image src={text} />}
        />,
      },
      {
        title: '用户名',
        dataIndex: 'nickName',
        key: 'nickName',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        render: (text) => <span>{text === 'm' ? "男" : "女"}</span>,
      },
      {
        title: '微博ID',
        dataIndex: 'uuid',
        key: 'uuid',
      },
      {
        title: '我的粉丝',
        key: 'fans',
        render: (text, record) => (
          <a
            style={{ color: 'green' }}
            onClick={this.getFans.bind(this, record.key)}
          >
            查看粉丝
          </a>
        ),
      },
      {
        title: '我的关注',
        key: 'follower',
        render: (text, record) => (
          <a
            style={{ color: 'green' }}
            onClick={this.getFollower.bind(this, record.key)}
          >
            查看关注
          </a>
        ),
      },
      {
        title: '我的微博',
        key: 'follower',
        render: (text, record) => (
          <a
            style={{ color: 'green' }}
            onClick={this.getWeibo.bind(this, record.key)}
          >
            查看微博
          </a>
        ),
      },
      {
        title: '用户权威度',
        dataIndex: 'authority',
        key: 'authority',
        render: text => <a>{text !== "-Infinity" ? text.toFixed(6) : text}</a>,
      },
      {
        title: '用户关注度',
        dataIndex: 'friendsRate',
        key: 'friendsRate',
        render: text => <a>{text !== "-Infinity" ? text.toFixed(6) : text}</a>,
      },
      {
        title: '纯粉丝度',
        dataIndex: 'realFollow',
        key: 'realFollow',
        render: text => <a>{text !== "-Infinity" ? text.toFixed(6) : text}</a>,
      },
      {
        title: '用户头像特征',
        dataIndex: 'headPortrait',
        key: 'headPortrait',
        render: text => <a>{text !== "-Infinity" ? text.toFixed(6) : text}</a>,
      },
      {
        title: '近期活跃度',
        dataIndex: 'recentAtivity',
        key: 'recentAtivity',
        render: text => <a>{text !== "-Infinity" ? text.toFixed(6) : text}</a>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <Popconfirm
              title="确定删除该微博用户?"
              onConfirm={this.deleteCurrentUser.bind(this, record.key)}
            >
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Space>
        ),
      },
    ];
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader}>
            <div className={global.MyTitle}>
              <Text style={{ fontSize: 16 }}>微博用户管理</Text>
            </div>
            <Space>
              <Button type='primary' onClick={this.setModalStatus.bind(this, true)}><PlusCircleOutlined />添加微博用户</Button>
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
        <Modal
          title="添加微博用户"
          confirmLoading={confirmLoading}
          visible={isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <Form {...layout} name="basic" ref={formRef}>
            <Form.Item
              label="微博ID"
              name="uuid"
              rules={[{ required: true, message: '请输入微博ID!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Index;
