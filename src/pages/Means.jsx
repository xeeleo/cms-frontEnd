import React,{useEffect , useState} from 'react'
import './less/Means.less'
import {Upload, Form, Input, Button, message } from 'antd';
import { GetUserDataApi ,ChangeUserDataApi} from '../request/api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


//限制图片的大小200KB
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt200KB = file.size / 1024 / 1024 / 1024 < 200;
  if (!isLt200KB) {
    message.error('Image must smaller than 200KB!');
  }
  return isJpgOrPng && isLt200KB;
}

//将图片路径转为base64
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default function Means() {
  //保存查询到的用户名和用户的密码
  // const [usernameSear, setUsernameSear] = useState('');
  // const [passwordSear, setPasswordSear] = useState('');

  //获取用户信息
  useEffect( () => {
    GetUserDataApi().then( res => {
      // console.log(res);
      if(res.errCode === 0) {
        message.success(res.message);

        //注意：使用它根本不生效，为什么？？？查询成功后用户的名字根本不显示
        //原因在于setXXX是异步的
        // setPasswordSear(res.data.password);
        // setUsernameSear(res.data.username);

        //解决方法：将得到的用户信息赋值给placeholder
        //将拿到的用户名和密码存储到sessionStroage里面
        // console.log(res.data.username);
        sessionStorage.setItem('username', res.data.username);
      } else {
        message.error(res.message);
      }
    })
  } , [])

  //图片加载效果
  const [loading, setLoading] = useState(false);
  //头像的路径
  const [imageUrl , setImageUrl] = useState('');

  //表单提交事件
  const onFinish = (values) => {
    // console.log(values);
    // console.log(values.username , sessionStorage.getItem('username'));

    //如果表单的username有值，并不等于初始化时拿到的username
    if(values.username && 
      values.username !== sessionStorage.getItem('username') && 
      values.password.trim() !== "") {
        //提交表单，修改用户资料
        ChangeUserDataApi({
          username:values.username,
          password:values.password
        }).then(res => {
          console.log(res);
          if(res.errCode === 0){
            message.success(res.message);
            //修改成功后要重新登录
          } else {
            message.error(res.message);
          }
        })


    }
  }

  //点击上传图片
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
       {
         setLoading(false);
         setImageUrl(imageUrl);
         //存储图片的名称：
         localStorage.setItem('avatar' , info.file.response.data.filePath);
        //  console.log(info.file.response.data.filePath)

        //触发header组件更新
        //可以强制页面刷新，但是不建议
        // window.location.reload();


       }
      );
    }
  };

  //当没有图片时显示一个加号
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className='means'>
      <Form
        style={{width:"400px"}}
        name="basic"
        initialValues={{
          //表单的默认值，只有初始化或者重置的时候才生效
        //  username:usernameSear,
        //  password:passwordSear
          
        }}
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item label="修改用户昵称:" name="username">
          <Input placeholder='请输入新的用户名'/>
        </Form.Item>

        <Form.Item label="修改用户密码:" name="password">
          <Input.Password placeholder='请输入新的密码'/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{float:'right'}}>
            提交
          </Button>
        </Form.Item>
      </Form>
      <p>点击下方修改头像</p>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        headers={{"cms-token" : localStorage.getItem('cms-token')}}  //在upload组件上携带token
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </div>
  )
}
