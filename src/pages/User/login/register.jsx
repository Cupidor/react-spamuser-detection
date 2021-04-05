import { message, Space, Form, Input, Button, Select } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';
//import Footer from '@/components/Footer';
import { LoginRegister } from '@/services/login';

import styles from './index.less';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 14 },
};
const formUserRef = React.createRef();

const Register = () => {
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      values.type = ''
      const msg = await LoginRegister({ ...values });
      if (msg.code === '0000') {
        message.success('注册成功，快去登录吧！');
        history.goBack()
      } else {
        message.error(msg.message);
      }
    } catch (error) {
      message.error('注册失败，请重试！');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.login}>
          <div className={styles.top}>
            <div className={styles.desc}>垃圾用户检测系统</div>
          </div>
          <div className={styles.main}>
            <Form {...layout} name="basic" ref={formUserRef}
              onFinish={handleSubmit}>
              {/*<Form.Item name="type" label="您的角色" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="用户">用户</Select.Option>
                  <Select.Option value="商家">商家</Select.Option>
                  <Select.Option value="管理员">管理员</Select.Option>
                </Select>
              </Form.Item>*/}
              <Form.Item
                label="用户名"
                name="uName"
                rules={[{ required: true, message: '请输入用户名!' }]}
                getValueFromEvent={(event) => {
                  return event.target.value.replace(/\s+/g, '');
                }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="密码"
                name="pwd"
                rules={[{ required: true, message: '请输入密码!' }]}
                getValueFromEvent={(event) => {
                  return event.target.value.replace(/\s+/g, '');
                }}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="确认密码"
                name="pwdAgain"
                rules={[
                  { required: true, message: '请再次输入密码!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('pwd') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('您输入的两个密码不匹配!');
                    },
                  }),
                ]}
                getValueFromEvent={(event) => {
                  return event.target.value.replace(/\s+/g, '');
                }}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} >
                    注册
                      </Button>
                  <Button htmlType="button" onClick={() => history.goBack()}>
                    取消
                      </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      {/*<Footer />*/}
    </div >
  );
};

export default Register;
