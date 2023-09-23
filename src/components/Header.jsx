import React ,{useEffect, useState} from 'react'
import logoImg from'../assets/logo.gif'
import { Menu, Dropdown,message } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import defaultAvatar from '../assets/defaultAvatar.jpg';
import { useNavigate } from 'react-router-dom';


 export default function Header() {
    const navigate = useNavigate();
    const [avatar,setAvatar] = useState(defaultAvatar);
    const [username, setUsername] = useState("李狗蛋");

    //模拟componentDidMounted生命周期
    useEffect( () => {
        let username1 = localStorage.getItem('username');
        let avatar1 = localStorage.getItem('avatar');
        setUsername(username1 || "李狗蛋");
        if(avatar1){
            //http://47.93.114.103:6688/
            setAvatar('http://47.93.114.103:6688/' + avatar1);
        }
    }, [localStorage.getItem('avatar')])

    //退出
    const logout = () => {
        //清除localStorage的数据
        localStorage.clear();
        message.success("正在退出...")
        setTimeout( () => navigate('/login') , 1500);
    }
    const menu = (
        <Menu >
          <Menu.Item key={1}>修改资料</Menu.Item>
          <Menu.Divider />
          <Menu.Item  key={2} onClick={logout}>退出登录</Menu.Item>
         
        </Menu>
      );

  return (
    <header>
        <img src={logoImg} alt="" className="logo" />
        <div className='right'>
            <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <img src={avatar} className="avatar" alt="" />
                    <span>{username}</span>
                     <CaretDownOutlined />
                </a>
            </Dropdown>
        </div>

      </header>
  );
}
