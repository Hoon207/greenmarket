import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

function App() {
  // 로그인 상태 관리: username, id 저장
  const [user, setUser] = useState({
    username: localStorage.getItem('username') || null,
    id: localStorage.getItem('id') || null,
  });

  // 만약 토큰 만료 등으로 로그아웃 처리가 필요하면 이곳에 구현 가능
  // (예: useEffect로 토큰 유효성 검사)

  return (
    <BrowserRouter>
      {/* Header에 user 상태와 setUser 전달 */}
      <Header user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Main />} />
        {/* Login에 setUser 전달 */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/productpage" element={<ProductPage />} />
        <Route path="/itemdetail" element={<ItemDetail />} />
        <Route path="/goodsinsert" element={<GoodsInsert />} />
        <Route path="/products/:id" element={<ItemDetail />} />

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
