import React, { PureComponent } from 'react';
import { Space, Typography, message, Modal, Table, Avatar, Popconfirm, Image, Button } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { queryWeiBoByCondition, deleteBlog } from '@/services/blog';
import { numberDateFormat } from '@/utils/utils';

const { Text, Title } = Typography;

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
      blogUserId: ''
    };
  }

  componentDidMount() {
    if (this.props.match.params !== null)
      this.setState({
        blogUserId: this.props.match.params.blogUserId
      }, () => {
        this.getAllBlog()
      })
  }

  // 获取所有微博
  getAllBlog = async () => {
    const { pageSize, currentPage, blogUserId } = this.state;
    this.setState({
      tableLoading: true,
    });
    let res = await queryWeiBoByCondition({
      blogUserId,
      limit: pageSize,
      offset: pageSize * (currentPage - 1),
      sortColumnName: 'release_time',
      sortOrderType: 'desc',
    });
    if (res.code === '0000') {
      console.log(res)
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

  // 分页页面跳转
  onPageChange = (page, pageSize) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getAllBlog();
      },
    );
  };

  // 删除我的微博
  deleteBlog = async (id) => {
    let res = await deleteBlog({ blogId: id });
    if (res.code === '0000') {
      message.success('删除微博成功');
      this.getAllBlog();
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { users } = this.state;
    const columns = [
      {
        title: '发布时间',
        dataIndex: 'releaseTime',
        key: 'releaseTime',
        render: (text) => <span>{numberDateFormat(text, 'yyyy-MM-dd HH:mm')}</span>,
      },
      {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        width: 1200
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
                title="确定删除该微博?"
                onConfirm={this.deleteBlog.bind(this, record.key)}
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
              <Text style={{ fontSize: 16 }}>我的微博</Text>
            </div>
            <Space>
              <Button onClick={() => history.back()}>返回</Button>
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
