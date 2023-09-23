import React,{useState, useEffect} from 'react'
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';


export default function Bread() {
    const [breadName, setBreadName] = useState('');
    // const { pathName } = useLocation();
    const location = useLocation();
    let pathName = location.pathname;
    console.log(pathName);

    //不是在组件mounted时去获取路径，而是路径一旦变化，就要获取对应路径的名称，并且修改breadName
    //监听路由的路径(/list /edit /means)
    useEffect( () => {
        switch(pathName){
            case '/list':
                setBreadName("查看文章列表");
                break;
            case '/edit':
                setBreadName("文章编辑");
                break;
            case '/means':
                setBreadName("修改资料");
                break;
            default:
                setBreadName(pathName.includes('/edit') ? "文章编辑" : '');
                break;
        }

    } ,[pathName])

    return (
        <Breadcrumb style={{height:"30px",lineHeight:"30px"}}>
            <Breadcrumb.Item href='/'>
            <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href={pathName}>{breadName}</Breadcrumb.Item>
        </Breadcrumb>
    )
}
