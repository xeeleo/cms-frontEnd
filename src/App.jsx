import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './components/Header'
import Aside from './components/Aside'
import Bread from './components/Bread'

export default function App() {
  //根据关键词的变化进而能够在重新上传完头像之后就可以更新头像
  return (
    <Layout id="app">
      <Header />
      <div className="container">
        <Aside />

        <div className="contain_box">
          <Bread />
          <div className="container_content">
            <Outlet />
          </div>
        </div>
      </div>
      <footer>Copyright &copy; 2022 . Author xeeleo</footer>
    </Layout>
  )
}
