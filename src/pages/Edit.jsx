import React,{ useState, useEffect } from 'react'
import { PageHeader, Button, Modal, Form, Input, message } from 'antd';
import moment from 'moment';
import E from 'wangeditor';
import {ArticleAddApi,ArticleSearchApi,ArticleUpdateApi} from '../request/api'
import {useParams,useNavigate, useLocation} from 'react-router-dom'

let editor = null;

export default function Edit() {
  //文本编辑器中文本框中的内容
  const [content, setContent] = useState('');

  //对话框的状态，true和false，是否关闭
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  //判断路径中是否含有id使用，有id有-> ，无id无→
  const params = useParams();
  // console.log(params);

  //将获取到的文章的title,subTitle渲染到提交框中
  const [title,setTitle] = useState('');
  const [subTitle,setSubTitle] = useState('');

  //文章更新成功后，跳回list
  const navigate = useNavigate();

  //监听路由的变化
  const location = useLocation();

  //封装 根据API添加文章和更新文章 的共同部分, 提升性能
  const dealData = (errCode, msg) => {
    if(errCode === 0){
      message.success(msg);
      //跳回list页面
      setTimeout( () => navigate('/list') , 1500);
    } else {
      message.error(msg);
      
    }
    //关闭对话框
    setIsModalVisible(false);
  }

  //对话框点击OK提交表单信息
  const handOk = () => {
    form
        .validateFields()   //校验字段，校验规则
        .then((values) => {
          // form.resetFields();  //重置，将输入的标题和副标题都置为空

          //拿到表单的值values
          console.log('Received values of form: ', values);
          let {title, subTitle} = values;
          console.log(content);
          

          //根据地址栏是否有id来决定到底是添加文章还是更新一篇文章，如果有id的话就是更新文章；如果没有的话，就是添加一篇文章
          
          if(params.id){
            //根据API接口来更新文章
            ArticleUpdateApi({
              title,
              subTitle,
              content,
              id:params.id
            }).then(res => {
              dealData(res.errCode, res.message);
            })

          } else {
            //请求：根据API接口添加文章
            ArticleAddApi({
              title,
              subTitle,
              content
            }).then(res => {
              // //关闭对话框
              // setIsModalVisible(false);
              // if(res.errCode === 0){
              //   console.log(res);
              //   message.success(res.message);
              //   //跳回list页面
              //   setTimeout( () => navigate('/list'), 1500);
              // } else {
              //   message.error(res.message);
                
              // }
              dealData(res.errCode, res.message);
            })
          }
          
        })
        .catch((info) => {
          //直接返回，不打印报错信息
          return;
          // console.log('Validate Failed:', info);
        });
  };

  useEffect( () => {
    editor = new E('#div1')
    editor.config.onchange = (newHtml) => {
      setContent(newHtml)
    }
    editor.create()

    //根据地址栏id做请求，请求文章内容，标题，副标题等信息
    if(params.id){
      ArticleSearchApi({
        id:params.id
      }).then(res => {
        // console.log(res);
        if(res.errCode === 0){
          // console.log(content);
          editor.txt.html(res.data.content);
          setTitle(res.data.title);
          setSubTitle(res.data.subTitle);

        }
      })
    }

    return () => {
      // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
      editor.destroy()
    };
    
  } , [location.pathname])

  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={
          params.id ?
          () => window.history.back()
          : null
        }      //控制箭头存不存在
        title="文章编辑"
        subTitle={"当前日期："+moment(new Date()).format("YYYY-MM-DD h:mm:ss a")}
        extra={
          <Button 
            key="1" 
            type="primary" 
            onClick={() => setIsModalVisible(true)}>提交文章</Button>
        }
      ></PageHeader>

      <div id="div1"
        style={{padding:'0 20px 20px', background: '#fff'}}
      >
      </div>

      <Modal 
        title="填写文章标题" 
        visible={isModalVisible} 
        onOk={handOk} 
        onCancel={() => setIsModalVisible(false)}
        zIndex={99999}
        okText={"提交"}
        cancelText="取消"
      >

      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 20,
        }}
        autoComplete="off"
        initialValues={{
          title:title,
          subTitle:subTitle
        }}
      >
          <Form.Item
            label="标题"
            name="title"
            rules={[
              {
                required: true,
                message: '请填写标题👆',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="副标题"
            name="subTitle"
          >
            <Input />
          </Form.Item>
        </Form> 

      </Modal>

    </div>
  )
}
