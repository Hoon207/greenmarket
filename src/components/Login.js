import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';

import '../style/LogForm.css'

function Login(props) {
  const [form, setForm] = useState({
    userid: '',
    password: ''
  }); // 데이터 저장하기 위한 변수
  const [error, setError] = useState(''); // 오류 출력 변수


  // 입력 발생 함수
  const handleChange = (e) => {
    setForm({...form,
    [e.target.name]: e.target.value}
  )}

  // 로그인 버튼 클릭시 실행 함수
  const handleSubmit = async e => {
    e.preventDefault();

    // 성공시
    try {
      //로컬 테스트시 필요. 
      const res = await axios.post('http://localhost:9070/login', form);
      //cloudetype에 올릴 떄는 const res = await axios.post~  위 코드를 주석처리 

      //로컬 테스트용 
      //axios.post('http://localhost:9070/login', {

      //cloudtype 서버 업로드용
      //  axios.post('http://localhost:9070/api/login', {

      axios.post('http://localhost:9070/login', {
        userid: form.userid,
        password: form.password
      });
    
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username);
      localStorage.setItem('id', res.data.user.id);
    
      alert('로그인 성공');
      window.location.href = '/'; 
    }
    // 실패시
    catch(err) {
      setError('로그인 실패 : 아이디와 비밀번호를 확인해주세요.');
    }
  }

  return (
    <section>
      <form className='logform' onSubmit={handleSubmit}>
        <fieldset>
          <legend>로그인</legend>
          <p>
            <label className='display_none' htmlFor='logform_userid'>아이디</label>
            <input type='text' id='logform_userid' name='userid' placeholder='아이디' required maxLength='30' value={form.userid} onChange={handleChange} />
          </p>
          <p>
            <label className='display_none' htmlFor='logform_password'>비밀번호</label>
            <input type='password' id='logform_password' name='password' placeholder='비밀번호' required maxLength='40' value={form.password} onChange={handleChange} />
          </p>

          {error && <p className='logform_error'>{error}</p>}

          <p><input type='submit' value='로그인' /></p>

          <p className='logform_findjoin'>
            <span><Link to='/find_id' title='아이디 찾기'>아이디 찾기</Link></span>
            <span><Link to='/find_pw' title='비밀번호 찾기'>비밀번호 찾기</Link></span>
            <span><Link to='/register' title='회원가입'>회원가입</Link></span>
          </p>

          <div className='logform_social'>
            <Link to='https://accounts.kakao.com/' title='카카오 로그인' className='kakao_login'>
              <img src={`${process.env.PUBLIC_URL}/images/login_kakao.png`} alt='카카오 로그인'></img>
            </Link>
            <Link to='https://nid.naver.com/nidlogin.login' title='네이버 로그인' className='naver_login'>
              <img src={`${process.env.PUBLIC_URL}/images/login_naver.png`} alt='네이버 로그인'></img>
            </Link>
          </div>
        </fieldset>
      </form>
    </section>
  );
}

export default Login;