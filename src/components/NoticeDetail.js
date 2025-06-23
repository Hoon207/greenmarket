import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import SupportMnu from './SupportMnu';
import '../style/notice.css';
import '../style/support.css';
import '../style/noticeDetail.css';

function NoticeDetail(props) {
  const { id } = useParams(); // 해당 id값
  const [form, setForm] = useState({
    category: '',
    title: '',
    datetime: '',
    file: ''
  });

  const navigate = useNavigate();
  
  // 서버 응답값
  useEffect(() => {
    axios
    .get(`http://localhost:9070/notice/${id}`)
    .then(res => {
      console.log('서버 응답값 : ', res.data);
      setForm(res.data);
    })
    .catch(err => console.log('조회 오류 : ', err));
  }, [id]);

  // 게시일 - 날짜만 표시
  function formatDate(datetime) {
    if(!datetime) return null;
    const date = new Date(datetime);
    if(isNaN(date.getTime())) return null; /* 초기 접속시 빈 날짜값 오류 방지 */
    return date.toISOString().split('T')[0];
  }

  // 관리자 여부 확인(GPT 도움)
    const [isAdmin, setIsAdmin] = useState(false); // (false: 숨기기, true: 표시)
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if(token) {
          const decoded = jwtDecode(token);
          // console.log('decoded: ', decoded);
          setIsAdmin(decoded.role === 'admin'); // role이 'admin'일 경우만 관리자
      }
    }, []);

    // 리스트 삭제
  const delData = (id) => {
    if(window.confirm('데이터를 삭제하시겠습니까?')) {
      axios
      .delete(`http://localhost:9070/notice/${id}`)
      .then(() => {
        alert('삭제가 완료되었습니다.');
        navigate('/notice');
      })
      .catch(err => console.log(err));
    }
  }

  return (
    <section className='support_section notice_section'>
      <h2 className='support_none'>고객센터 - 공지사항</h2>
      <SupportMnu />

      <article className='support_page notice_page notice_detail'>
        <h3 className='support_none'>공지사항 세부 내용</h3>

        {/* 관리자만 활성화 */}
        <div className='notice_hidden_top'>
          {isAdmin && (
            <>
              <button type='button' onClick={() => navigate(`/notice/update/${form.id}`)} className='notice_upd_btn'>수정</button>
              <button type='button' onClick={() => {delData(form.id)}} className='notice_del_btn'>삭제</button>
            </>
          )}
        </div>

        <div className='notice_top'>
          <p className='notice_title'>&#91;{form.category}&#93; {form.title}</p>
          <p className='notice_dateday'>{formatDate(form.datetime)}</p>
        </div>
        <div className='notice_mid'>
          <button type='button' onClick={() => navigate('/notice')} className='notice_back_btn'>목록</button>
        </div>
        <div className='notice_btm'>
          <p className='notice_cont'>{form.content}</p>
        </div>
      </article>
    </section>
  );
}

export default NoticeDetail;