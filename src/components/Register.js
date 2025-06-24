import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import Region from './Region'; // 지역 선택 별도 연결

function Register(props) {
  const [form, setForm] = useState({
    username: '',
    userid: '',
    password: '',
    password_conf: '',
    phone: '',
    email: '',
    region: '', // 지역(테이블) & 지역-도/특별시/광역시
    city: '',   // 지역-시/군/구(이후 region 테이블에 합)
    town: '',   // 지역-읍/면/동(이후 region 테이블에 합)
    locate: ''  // 지역의 기타(이후 region 테이블에 합)
  });
  const [error, setError] = useState(''); // 에러 발생시 변수
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false); // 이용약관 펼치고접기
  const [text, setText] = useState();         // 이용약관 불러오기 변수

  // 입력시 실행함수
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Region.js에서 받아온 값 실행
  const handleRegionChange = useCallback(({ region, city, town, locate }) => {
    setForm(prev => ({ ...prev, region, city, town, locate }));
  }, []);

  // 회원가입 버튼 클릭시 실행함수
  const handleSubmit = async e => {
    e.preventDefault();

    if (form.password !== form.password_conf) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 지역 관련
    let finalRegion = '';
    if (form.region === '기타') {
      finalRegion = form.locate.trim();
    } else {
      finalRegion = `${form.region} ${form.city} ${form.town}`.trim();
    }

    try {
      // 전송 (경로를 /greenmarket/register 로 변경)
      await axios.post(
        'https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/register',
        {
          username: form.username,
          userid:   form.userid,
          password: form.password,
          phone:    form.phone,
          email:    form.email,
          region:   finalRegion
        }
      );

      // 초기화 및 알림
      setForm({
        username: '',
        userid: '',
        password: '',
        password_conf: '',
        phone: '',
        email: '',
        region: '',
        city: '',
        town: '',
        locate: ''
      });
      alert('회원가입 성공');
      navigate('/login');
    } catch (err) {
      setError('회원가입 실패 : 아이디가 이미 존재하거나 서버 오류입니다.');
    }
  };

  // 이용약관 펼치고 접기
  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  // 이용약관 불러오기
  useEffect(() => {
    fetch('/agreetxt.txt')
      .then(res => res.text())
      .then(data => setText(data));
  }, []);

  return (
    <section>
      <form className='logform' onSubmit={handleSubmit}>
        <fieldset>
          <legend>회원가입</legend>
          <p className='logform_info'>* 필수 입력사항</p>
          <p>
            <label htmlFor='logform_username'>성함 <span>&#42;</span></label>
            <input
              type='text'
              id='logform_username'
              name='username'
              required
              maxLength='10'
              placeholder='성함 또는 별칭'
              value={form.username}
              onChange={handleChange}
            />
          </p>
          <p>
            <label htmlFor='logform_userid'>아이디 <span>&#42;</span></label>
            <input
              type='text'
              id='logform_userid'
              name='userid'
              required
              maxLength='30'
              placeholder='아이디'
              value={form.userid}
              onChange={handleChange}
            />
          </p>
          <p>
            <label htmlFor='logform_password'>비밀번호 <span>&#42;</span></label>
            <input
              type='password'
              id='logform_password'
              name='password'
              required
              maxLength='40'
              placeholder='비밀번호'
              value={form.password}
              onChange={handleChange}
            />
          </p>
          <p>
            <label htmlFor='logform_password_conf'>비밀번호 확인 <span>&#42;</span></label>
            <input
              type='password'
              id='logform_password_conf'
              name='password_conf'
              required
              maxLength='40'
              placeholder='비밀번호 확인'
              value={form.password_conf}
              onChange={handleChange}
            />
          </p>
          <p>
            <label htmlFor='logform_phone'>휴대전화 <span>&#42;</span></label>
            <input
              type='tel'
              id='logform_phone'
              name='phone'
              required
              maxLength='11'
              placeholder='휴대전화(숫자만 입력)'
              value={form.phone}
              onChange={handleChange}
            />
          </p>
          <p>
            <label htmlFor='logform_email'>이메일 <span>&#42;</span></label>
            <input
              type='email'
              id='logform_email'
              name='email'
              required
              maxLength='40'
              placeholder='이메일(예. id@domain.com)'
              value={form.email}
              onChange={handleChange}
            />
          </p>
          <p>
            <label htmlFor='logform_region'>지역</label>
            <Region onChange={handleRegionChange} defer={true} />
          </p>

          <div className='logform_chbox_wrap' onClick={handleToggle}>
            <p className='logform_chbox'>
              <input type='checkbox' id='logform_chbox' required />
              <label htmlFor='logform_chbox'>이용 약관에 동의합니다.</label>
            </p>
            <span>
              {isOpen
                ? <FontAwesomeIcon icon={faChevronUp} />
                : <FontAwesomeIcon icon={faChevronDown} />
              }
            </span>
          </div>
          <div style={{ height: isOpen ? '220px' : '0', overflow: 'hidden', transition: 'height 0.3s ease' }}>
            {isOpen && (
              <textarea
                cols='73'
                rows='10'
                readOnly
                id='logform_agreetxt'
                name='agreetxt'
                value={text}
              />
            )}
          </div>

          <p>
            <input type='submit' value='회원가입' />
          </p>
          {error && <p className='logform_error'>{error}</p>}
        </fieldset>
      </form>
    </section>
  );
}

export default Register;
