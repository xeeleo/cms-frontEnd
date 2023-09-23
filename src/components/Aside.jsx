import React, { useEffect ,useState} from 'react'
import { Menu } from 'antd';
import { OrderedListOutlined, EditOutlined, FileOutlined } from '@ant-design/icons';
import { useNavigate ,useLocation} from 'react-router-dom';

export default function Aside() {
    const navigate = useNavigate();
    const location = useLocation();
    const [defaultKey, setDefaultKey] = useState('');

    //一般加一个空数组,为了模仿componentDidMounted
    useEffect( ()=> {
        console.log(location.pathname);
        let path = location.pathname;
        console.log(path.split('/')[1]);
        let key = path.split('/')[1];
        setDefaultKey(key);

    } , [location.pathname])

    const handleClick = e => {
        console.log('click ', e);
        navigate('/' + e.key);
        setDefaultKey(e.key);
      };
    
  return (
    <Menu
    onClick={handleClick}
    style={{ width: 150 }}
    // defaultSelectedKeys={[defaultKey]}
    selectedKeys={[defaultKey]}
    mode="inline"
    className='aside'
    theme='dark'
  >
        <Menu.Item key="list"><OrderedListOutlined /> 查看文章列表</Menu.Item>
        <Menu.Item key="edit"><EditOutlined /> 文章编辑</Menu.Item>
        <Menu.Item key="means"><FileOutlined /> 修改资料</Menu.Item>
  </Menu>
  )
}
