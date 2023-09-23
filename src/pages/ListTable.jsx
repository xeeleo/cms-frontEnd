import React,{useState, useEffect} from 'react'
import './less/ListTable.less'
import { Table, Space,Button ,message} from 'antd';
// import { Link } from 'react-router-dom';
import { articleApi } from '../request/api';
import moment from 'moment';
import {useNavigate} from 'react-router-dom';

//标题组件：
function MyTitle(props){
  return(
    <div>
      <a className="table_tittle"  
      href={'http://codesohigh.com:8765/article/'+ props.id}
      target="_blank">{props.title}</a>
      <p style={{color:"#999"}}>{props.subTitle}</p>
    </div>
  );
}

export default function ListTable() {
    //编辑文章的时候实现文章跳转
    const navigate = useNavigate();

    //用来删除文章后刷新页面
    const [update, setUpdate] = useState(1);

    //列表数组
    const [arr, setArr] = useState(
      [{
        key:'',
        mytitle:'',
        date:'',
        action:''
      }]
    );

    //分页
    const [pagination,setPagination] = useState({
      current:1,
      pageSize:10,
      total:10,
    });

    //封装请求的函数
    const getArticleList = (current, pageSize) => {
      articleApi({
        num:current,
        count:pageSize
      }).then(res => {
        // console.log(res);
        if(res.errCode === 0){
          //更改pagination
          let {num, count,total} = res.data;
          setPagination({
            current:num,
            pageSize:count,
            total

          })

          // console.log(res.data.arr);
          //深拷贝获取到的数组
          let newArr = JSON.parse(JSON.stringify(res.data.arr));

          //声明一个空数组
          let myarr = [];

          //1.要给每一个数组项加key = id
          //2.需要有一套标签结构赋予一个属性
          newArr.map(item => {
            // item.key = item.id;
            // item.date = moment(item.date).format('MMMM Do YYYY, h:mm:ss a');
            // item.mytitle = `
              // <div>
              //   <Link className="table_tittle" to ='/'>${item.title}</Link>
              //   <p style={{color:"#999"}}>${item.subTitle}</p>
              // </div>`;
            let obj = {
              key:item.id,
              date:moment(item.date).format('MMMM Do YYYY, h:mm:ss a'),
              mytitle: <MyTitle title={item.title} subTitle={item.subTitle} id={item.id}/>
            }   
            myarr.push(obj);

          })
          // console.log(newArr);
          // setArr(newArr);
          setArr(myarr);
        }

      })
    } ;

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


    //请求文章列表
    useEffect(() =>{
      getArticleList(pagination.current,pagination.pageSize);
    }, [update])

    //点击分页
    const pageChange = (arg) => {
      // console.log(pagination);
      getArticleList(arg.current,arg.pageSize);

    };

    const columns = [
        {
          dataIndex: 'mytitle',
          key: 'mytitle',
          width:'50%',
          //注入script标签的行为是非常危险的，可以直接获取cookie的值，或者修改你的行为
          //同时 dangerouslySetInnerHTML 会使标题部分的a标签失效

          //这么写虽然渲染出来了，但是还是有缺陷,(直接使用newarr)
          // render: text => <div dangerouslySetInnerHTML={{__html:text}}></div>

          //使用myarr的情况
          render: text => <div>{text}</div>,
          
        },
        {
          dataIndex: 'date',
          key: 'date',
          render: text => (
            <p>{text}</p>
          ),

        },
        {
          key: 'action',
          render: (text) => {
            console.log(text);


            return(
              <Space size="middle">
                <Button type='primary'
                  onClick={
                    () => {
                      //text.key其实就是文章的id
                      // console.log(text.key);
                      () => navigate('/edit/' + text.key)
                    }
                  }
                >编辑</Button>
                <Button type='danger'
                  onClick={
                    // () => {
                    //   console.log(text.key);
                    // }
                    () => delFn(text.key)
                  }
                >删除</Button>
              </Space>
            );
          } 

        },
      ];
      
    return (
        <div className='list_table'>
            <Table columns={columns} 
            dataSource={arr} 
            showHeader={false}
            onChange={pageChange}
            pagination={pagination}
            />
        </div>
    )
}




