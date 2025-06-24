import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import Region from './Region'; // 지역 선택 컴포넌트
import '../style/LogForm.css';

function MemberUpdate() {
  const { id } = useParams();
  const [form, setForm] = useState({
    username: '',
    userid: '',
    password: '',
    phone: '',
    email: '',
    region: '', // 기본 지역 문자열
    city: '',   // 수정할 때 선택용
    town: '',
    locate: ''
  });
  const navigate = useNavigate();

  // 1) 컴포넌트 마운트 시 DB에서 회원정보 조회
  useEffect(() => {
    axios
      .get(
        `https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/member/${id}`
      )
      .then(res => {
        const { username, userid, phone, email, region } = res.data;
        setForm(prev => ({
          ...prev,
          username,
          userid,
          phone,
          email,
          region,
          city: '',
          town: '',
          locate: ''
        }));
      })
      .catch(err => console.error('회원정보 조회 오류:', err));
  }, [id]);

  // 2) 폼 입력 변경
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // 3) Region.js에서 받은 값
  const handleRegionChange = ({ region, city, town, locate }) => {
    setForm(prev => ({ ...prev, region, city, town, locate }));
  };

  // 4) 수정 제출
  const handleSubmit = async e => {
    e.preventDefault();

    // finalRegion 구성
    let finalRegion = '';
    if (form.region === '기타') {
      finalRegion = form.locate.trim();
    } else {
      finalRegion = `${form.region} ${form.city} ${form.town}`.trim();
    }

    // 업데이트용 객체
    const updateData = {
      username: form.username,
      phone: form.phone,
      email: form.email,
      region: finalRegion
    };
    if (form.password) {
      updateData.password = form.password;
    }

    try {
      await axios.put(
        `https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/member/update/${id}`,
        updateData
      );
      alert('수정이 완료되었습니다.');
      navigate('/');
    } catch (err) {
      console.error('수정 오류:', err);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  // 5) 취소
  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      navigate('/');
    }
  };

  return (
    <section>
      <form className='logform' onSubmit={handleSubmit}>
        <fieldset>
          <legend>회원정보 수정</legend>

          {/* 성함 */}
          <p>
            <label htmlFor='logform_username'>성함</label>
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

          {/* 아이디 (수정 불가) */}
          <p>
            <label htmlFor='logform_userid'>아이디 <span>(수정불가)</span></label>
            <input
              type='text'
              id='logform_userid'
              name='userid'
              readOnly
              value={form.userid}
            />
          </p>

          {/* 비밀번호 */}
          <p>
            <label htmlFor='logform_password'>비밀번호</label>
            <input
              type='password'
              id='logform_password'
              name='password'
              maxLength='40'
              placeholder='변경할 비밀번호'
              value={form.password}
              onChange={handleChange}
            />
          </p>

          {/* 휴대전화 */}
          <p>
            <label htmlFor='logform_phone'>휴대전화</label>
            <input
              type='tel'
              id='logform_phone'
              name='phone'
              maxLength='11'
              placeholder='휴대전화(숫자만)'
              value={form.phone}
              onChange={handleChange}
            />
          </p>

          {/* 이메일 */}
          <p>
            <label htmlFor='logform_email'>이메일</label>
            <input
              type='email'
              id='logform_email'
              name='email'
              maxLength='40'
              placeholder='이메일'
              value={form.email}
              onChange={handleChange}
            />
          </p>

          {/* 기존 지역 표시 */}
          <p className='logform_initial_region'>
            <label htmlFor='logform_init_region'>입력하신 지역</label>
            <input
              type='text'
              id='logform_init_region'
              readOnly
              value={form.region}
            />
          </p>

          {/* 지역 수정 */}
          <p>
            <label htmlFor='logform_region'>수정할 지역</label>
            <Region onChange={handleRegionChange} defer={false} />
          </p>

          {/* 수정/취소 버튼 */}
          <p className='logform_update'>
            <input type='submit' value='수정하기' />
          </p>
          <p className='logform_cancel'>
            <button type='button' onClick={handleCancel}>취소</button>
          </p>
        </fieldset>
      </form>
    </section>
  );
}

export default MemberUpdate;
