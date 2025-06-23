import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/noticeCrup.css';

function NoticeCreate() {
  const [form, setForm] = useState({
    cate: '',
    title: '',
    writer: '관리자',
    content: '',
  });
  const navigate = useNavigate();

  // 입력시 발동
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  // 등록 버튼 클릭시 발동
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
    .post('http://localhost:9070/notice', form)
    .then(() => {
      alert('공지글이 등록되었습니다.');
      navigate('/notice');
    })
    .catch(err => console.log(err));
  }

  return (
    <section className='notice_crup_section'>
      <h2>공지사항 등록</h2>
      <form className='notice_crup_form' onSubmit={handleSubmit}>
        <fieldset>
          <legend>공지사항 내용 입력</legend>
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
            <input type='submit' value='등록' />
          </p>
        </fieldset>
      </form>
    </section>
  );
}

export default NoticeCreate;