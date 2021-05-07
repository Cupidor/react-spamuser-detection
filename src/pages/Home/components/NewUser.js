import React, { useState, PureComponent } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import md5 from 'md5';
import { updateUserInfo } from '@/services/user_info';
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const formUserRef = React.createRef();

class NewUser extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      userId: null,
      title: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.setState({
          title: this.props.title,
        });
        formUserRef.current.resetFields()
        if (this.props.title === '编辑用户') {
          if (this.props.detail !== null) {
            this.setState(
              {
                userId: this.props.detail.key,
              },
              () => {
                formUserRef.current.setFieldsValue({
                  userType: this.props.detail.user_type,
                  uName: this.props.detail.user_name,
                  pwd: this.props.detail.password,
                });
              },
            );
          }
        }
      }
    }
  }

  // 确定
  handleOk = () => {
    formUserRef.current.validateFields().then((values) => {
      this.onFinish(values);
    });
  };

  // 取消
  handleCancel = () => {
    this.props.closeModal(false);
  };

  // 表单提交
  onFinish = async (values) => {
    const { title, userId } = this.state;
    this.setState({
      confirmLoading: true,
    });
    let res = null;
    if (title === '编辑用户') {
      values.userId = userId;
      res = await updateUserInfo({ ...values });
    }
    if (res.code === '0000') {
      message.success(`${title}成功`);
      this.props.callBack();
      this.props.closeModal(false);
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
    const { confirmLoading, title } = this.state;
    return (
      <Modal
        title={title}
        confirmLoading={confirmLoading}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form {...layout} name="basic" ref={formUserRef}>
          <Form.Item
            name="userType"
            label="您的角色"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="普通用户">普通用户</Select.Option>
              <Select.Option value="管理员">管理员</Select.Option>
            </Select>
          </Form.Item>
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
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default NewUser;
