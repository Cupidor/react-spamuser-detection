import React, { PureComponent } from 'react';
import { Space, Typography, message, Empty, Card, Input, Result } from 'antd';
import global from '@/global.less';
import Footer from '@/components/Footer';
import { checkBlogUser } from '@/services/blog_user';

const { Search } = Input;

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      status: ''
    };
  }

  componentDidMount() {
  }


  // 搜索
  onSearch = (searchValue) => {
    this.setState({
      searchValue
    }, () => {
      this.checkUser()
    })
  }

  checkUser = async () => {
    const { searchValue } = this.state;
    if (searchValue === '') {
      message.warning('微博用户ID不可为空');
      return
    }
    if (isNaN(searchValue)) {
      message.warning('请输入正确的微博用户ID');
      return
    }
    let res = await checkBlogUser({
      wbUUID: searchValue,
    });
    if (res.code === '0000') {
      this.setState({
        status: res.result ? 'success' : 'warning'
      })
    } else {
      message.error(res.message);
    }
  }


  render() {
    const { status } = this.state;
    return (
      <div className={global.MyMain}>
        <div className={global.MyContent}>
          <div className={global.MyHeader} style={{ display: 'flex', justifyContent: 'center' }}>
            <Space>
              <Search
                placeholder="输入微博用户的ID"
                enterButton="搜索"
                size="large"
                onSearch={this.onSearch}
                style={{ width: 500 }} />
            </Space>
          </div>
          <div className={global.MyBody}>
            <div className={global.MyBodyRight} style={{ padding: 12 }}>
              {status === '' ? <Empty /> : <Result
                status={status}
                title={`该用户为${status === 'success' ? "有效" : "垃圾"}用户!`}
              />
              }
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
