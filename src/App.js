// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // ← Routes, Route 추가
import './style/reset.css';
import './style/common.css';
import './style/App.css';

import Header from './layout/Header';
import Footer from './layout/Footer';
import Main from './components/Main';
import Cart from './components/Cart';
import Login from './components/Login';
// import ItemDetail from './components/ItemDetail'; 
import ProductPage from './components/ProductPage';
import Register from './components/Register';
import GoodsInsert from './components/GoodsInsert';
import GoodsEdit from './components/GoodsEdit';
import ItemDetail from './components/ItemDetail';
import SearchPage from './components/SearchPage';
import Notice from './components/Notice';
import NoticeCreate from './components/NoticeCreate';
import NoticeUpdate from './components/NoticeUpdate';
import NoticeDetail from './components/NoticeDetail';
import MemberUpdate from './components/MemberUpdate';
import InquiryForm from './components/InquiryForm';
import Qna from './components/Qna';

function App() {
  return (
    <BrowserRouter>
      <Header />

      {/* 페이지 컨텐츠 영역 */}

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productpage" element={<ProductPage />} />
          {/* <Route path="/itemdetail" element={<ItemDetail />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/goodsinsert" element={<GoodsInsert />} />
          <Route path="/goodsedit/:id" element={<GoodsEdit />} />
          <Route path="/products/:id" element={<ItemDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/notice/create" element={<NoticeCreate />} />
          <Route path="/notice/update/:id" element={<NoticeUpdate />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />
          <Route path="/inquiry" element={<InquiryForm />} />
          <Route path="/qna" element={<Qna />} />
          <Route path="/member/update/:id" element={<MemberUpdate />} />
        </Routes>


      <Footer />
    </BrowserRouter>
  );
}

export default App;
