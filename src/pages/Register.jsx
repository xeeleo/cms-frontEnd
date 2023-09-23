import React from 'react'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, message} from 'antd';
import "./less/Login.less";
import logoImg from "../assets/logo.gif";
import {Link,useNavigate} from 'react-router-dom';
import { RegisterApi } from '../request/api';

export default function Register() {
  const navigate = useNavigate()

  const onFinish = (values) => {
    console.log('Success:', values);
    RegisterApi({
      username:values.username,
      password:values.password
    }).then(res => {
      if(res.errCode === 0){
          message.success(res.message);
          setTimeout( () => navigate('/login') , 1500);
          
      } else {
          message.error(res.message);
      }
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className='login'>
      <div className='login_box'>
        <img src={logoImg} alt="" />
      <Form
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名"/>
      </Form.Item>

      <Form.Item
        // label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password size='large' prefix={<LockOutlined className="site-form-item-icon" />} placeholder="请输入密码"/>
      </Form.Item>

      <Form.Item
        name="confirm"
        // label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder='请再次输入密码确认' size='large' prefix={<LockOutlined className="site-form-item-icon" />}/>
      </Form.Item>

      <Form.Item>
        <Link to="/login">已有账号，返回登录页登录</Link>
      </Form.Item>

      
      
      <Form.Item>
        <Button type="primary" htmlType="submit" block size='large'>
          立即注册&gt;
        </Button>
      </Form.Item>
    </Form>
    </div>
    </div>
  )
}
