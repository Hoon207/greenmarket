// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // ← Routes, Route 추가

import './style/reset.css';
import './style/common.css';
import './style/App.css';

import Header from './layout/Header';
import Footer from './layout/Footer';
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import ItemDetail from './components/ItemDetail';
import ProductPage from './components/ProductPage';
import GoodsInsert from './components/GoodsInsert';
import Notice from './components/Notice';
import NoticeCreate from './components/NoticeCreate';
import NoticeUpdate from './components/NoticeUpdate';
import NoticeDetail from './components/NoticeDetail';
import MemberUpdate from './components/MemberUpdate';
import InquiryForm from './components/InquiryForm';
import Qna from './components/Qna';
// import OtherPage from './components/OtherPage';  // 필요하다면 추가

function App() {
  
  return (
    <BrowserRouter>
      <Header />

      {/* 페이지 컨텐츠 영역 */}

        <Routes>
          <Route path="/" element={<Main />} />
          {/* 로그인/회원가입/카트 */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          {/* 제품 관련 */}
          <Route path="/productpage" element={<ProductPage />} />
          <Route path="/itemdetail" element={<ItemDetail />} />
          <Route path="/goodsinsert" element={<GoodsInsert />} />
          <Route path="/products/:id" element={<ItemDetail />} />

          {/* 고객센터 */}
          <Route path="/notice" element={<Notice />} />
          <Route path="/notice/create" element={<NoticeCreate />} />
          <Route path="/notice/update/:id" element={<NoticeUpdate />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />
          <Route path="/inquiry" element={<InquiryForm />} />
          <Route path="/qna" element={<Qna />} />

          {/* 회원정보 수정 */}
          <Route path="/member/update/:id" element={<MemberUpdate />} />

          {/* <Route path="/other" element={<OtherPage />} /> */}
        </Routes>


      <Footer />
    </BrowserRouter>
  );
}

export default App;
