import React,{useState,useEffect} from 'react';
import './less/ListList.less';
import { List, Skeleton ,Pagination,Button,message} from 'antd';
import { articleApi , ArticleDelApi} from '../request/api';
import moment from 'moment';
import {useNavigate } from 'react-router-dom'

export default function ListList() {
  //文章列表
  const [list,setList] = useState([]);
  //数据总的条数
  const [total,setTotal] = useState(0);
  //当前在的页码
  const [current,setCurrent]  = useState(1);
  //一个页面中的条数
  const [pageSize,setPageSize] = useState(10);

  const navigate = useNavigate();

  //用来删除文章后重新刷新页面
  const [update, setUpdate] = useState(1);

  //请求封装
  const getList = (num) => {
    articleApi({
      num,
      count:pageSize

    }).then(res => {
      // console.log(res);
      if(res.errCode ===  0){
        let {arr, total, num , count} = res.data;
        setList(arr);
        setTotal(total);
        setCurrent(num);
        setPageSize(count);
      }
    })
  }

  //请求列表数据,模拟ComponentDidMount
  useEffect( () => {
    getList(current);
  } ,[])

  //模拟ComponentDidUpdate，用来删除后刷新页面
  useEffect( () => {
    getList(current);
  } ,[update])

  //点击换页
  //pages是当前所在的页面页数
  const onChange = (pages) => {
    // console.log(pages);
    // setCurrent(pages); //设置是无效的，他是异步的
    getList(pages);
  }

  //删除文章
  const delFn = (id) => {
    ArticleDelApi({
      id
    }).then(res => {
      // console.log(res);
      if(res.errCode === 0){
        //删除成功
        message.success(res.message);
        //重新请求列表的数据  或者 刷新页面  
        //1.window.reload  2.调用getList（1） 3.监听变量，在useEffect里面
        setUpdate(update + 1);
      } else {
        //删除失败
        message.error(res.message);

      }
    })
    
  }

  return (
    <div className='list_table' style={{padding:"20px"}}>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={item => {
          // console.log(item);
          return (
            <List.Item
              actions={[
                <Button type='primary' onClick={() => navigate('/edit/' + item.id)}>编辑</Button>, 
                <Button type='danger' onClick={() => delFn(item.id)}>删除</Button>]}
            >
              <Skeleton loading={false} >
                <List.Item.Meta
                  title={
                    <a 
                      href={'http://codesohigh.com:8765/article/'+ item.id} 
                      target="_blank"
                      rel="noreferrer"
                      >{item.title}</a>
                  }

                  description={item.subTitle}
                />

                <div>{moment(item.date).format('MMMM Do YYYY, h:mm:ss a')}</div>
              </Skeleton>
            </List.Item>
          )

        }}
      />

      <Pagination 
        current={current} 
        pageSize={pageSize} 
        total={total} 
        onChange={onChange}
        style={{float:"right",marginTop:"20px"}}
      />

    </div>
  )
}
