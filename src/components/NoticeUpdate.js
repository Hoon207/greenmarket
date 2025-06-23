import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import '../style/noticeCrup.css';

function NoticeUpdate() {
  const { id } = useParams(); // 받은 파라미터값
  const [form, setForm] = useState({
    category: '',
    title: '',
    writer: '관리자',
    content: '',
    file: ''
  });

  const navigate = useNavigate();

  // 데이터 송수신 성공/실패
  useEffect(() => {
    axios
    .get(`http://localhost:9070/notice/${id}`)
    .then(res => {
      console.log('서버 응답값 : ', res.data);
      setForm(res.data);
    })
    .catch(err => console.log('조회 오류 : ', err));
  }, [id]);

  // 입력한 경우 저장
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  // 수정하기 클릭시 실행
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
    .put(`http://localhost:9070/notice/update/${id}`, {
      category: form.category,
      title: form.title,
      writer: form.writer,
      content: form.content,
      file: form.file
    })
    .then(() => {
      alert('수정이 완료되었습니다.');
      navigate('/notice');
    })
    .catch(err => console.log('수정 오류 : ', err));
  }

  return (
    <section className='notice_crup_section'>
      <h2>공지사항 수정</h2>
      <form className='notice_crup_form' onSubmit={handleSubmit}>
        <fieldset>
          <legend>공지사항 내용 수정</legend>
          <p>
            <label htmlFor='notice_cate'>분류</label>
            <select id='notice_cate' name='category' required value={form.category} onChange={handleChange}>
              <option>선택하세요</option>
              <option value='중요'>중요</option>
              <option value='공지'>공지</option>
              <option value='안내'>안내</option>
              <option value='시스템'>시스템</option>
              <option value='긴급'>긴급</option>
              <option value='이벤트'>이벤트</option>
            </select>
          </p>
          <p>
            <label htmlFor='notice_title'>제목</label>
            <input type='text' name='title' id='notice_title' placeholder='공지사항에 보여질 제목을 입력해주세요' required value={form.title} onChange={handleChange} />
          </p>
          <p>
            <label htmlFor='notice_writ'>작성자</label>
            <input type='text' id='notice_writ' name='writer' value={form.writer} onChange={handleChange} />
          </p>
          <p>
            <label htmlFor='notice_cont'>내용</label>
            <textarea id='notice_cont' name='content' cols='73' rows='10' placeholder='내용을 입력해주세요' required value={form.content} onChange={handleChange}></textarea>
          </p>

          <p className='notice_crup_submit_btn'>
            <input type='submit' value='수정' />
          </p>
        </fieldset>
      </form>
    </section>
  );
}

export default NoticeUpdate;