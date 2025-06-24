import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import Region from './Region'; // 지역 선택 별도 연결
import '../style/LogForm.css';

function MemberUpdate() {
  const { id } = useParams(); // 파라미터값 받음
  const [form, setForm] = useState({
    username: '',
    userid: '',
    password: '',
    phone: '',
    email: '',
    region: '', // 지역(테이블) & 지역-도/특별시/광역시
    city: '', // 지역-시/군/구(이후 region 테이블에 합)
    town: '', // 지역-읍/면/동(이후 region 테이블에 합)
    locate: '' // 지역의 기타(이후 region 테이블에 합)
  });
  const navigate = useNavigate();

  // 발송 데이터 통신 성공여부 확인 출력
  useEffect(() => {
    axios
    .get(`http://localhost:9070/member/${id}`) // 전체 조회된 내용 중 숫자를 get방식으로 하여 해당 내용 조회.
    .then(res => {
      const fetched = res.data;

      console.log('서버 응답값 : ', res.data);
      setForm(prevForm => {
        const isSame = 
        prevForm.username === fetched.username &&
        prevForm.userid === fetched.userid &&
        prevForm.phone === fetched.phone &&
        prevForm.email === fetched.email &&
        prevForm.region === fetched.region &&
        prevForm.city === fetched.city &&
        prevForm.town === fetched.town &&
        prevForm.locate === fetched.locate;
        
        if(isSame) return prevForm; // 같으면 유지
        return {...prevForm, ...fetched}; //다르면 업데이트
      }); /* setForm 호출시 누락값을 기본값으로 유지하기 위함으로 변경 (GPT참고) */
    })
    .catch(err => console.log('조회 오류 : ', err));
  }, [id]);

  // 양식에 입력한 내용 저장
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  // Region.js에서 받아온 값 실행
  const handleRegionChange = ({region, city, town, locate}) => {
    setForm((prev) => ({...prev, region, city, town, locate}));
  }

  // 수정 메뉴 클릭시 실행
  const handleSubmit = (e) => {
    e.preventDefault();

    // 지역 관련
      let finalRegion = ''; // 선택, 입력한 지역

      if(form.region === '기타') {
        finalRegion = form.locate.trim(); // 기타 입력값 사용
      } else {
        finalRegion = `${form.region} ${form.city} ${form.town}`.trim(); // 예) 경기도 광주시 oo동, 서울특별시 종로구 oo동, ...
      }

    const updateData = {
      username: form.username,
      phone: form.phone,
      email: form.email,
      region: finalRegion
    }

    // 비밀번호 변경하는 경우 입력하면 추가
    if (form.password) {
      updateData.password = form.password;
    }

    axios
    .put(`http://localhost:9070/member/update/${id}`, updateData)
    .then(() => {
      alert('수정이 완료되었습니다.');
      navigate('/');
    })
    .catch(err => console.log('수정 오류 : ', err));
  }

  const handleClick = (e) => {
    if(window.confirm('수정을 취소하시겠습니까?')) {
      alert('취소되었습니다. 메인 페이지로 이동합니다.')
      navigate('/');
    }
  }

  return (
    <section>
      <form className='logform' onSubmit={handleSubmit}>
        <fieldset>
          <legend>회원정보 수정</legend>
          <p>
            <label htmlFor='logform_username'>성함</label>
            <input type='text' id='logform_username' name='username' required maxLength='10' value={form.username} onChange={handleChange} placeholder='성함 또는 별칭' />
          </p>
          <p>
            <label htmlFor='logform_userid'>아이디<span>(수정불가)</span></label>
            <input type='text' id='logform_userid' name='userid' required maxLength='30' value={form.userid} onChange={handleChange} readOnly placeholder='아이디' />
          </p>
          <p>
            <label htmlFor='logform_password'>비밀번호</label>
            <input type='password' id='logform_password' name='password' required maxLength='40' value={form.password} onChange={handleChange} placeholder='회원가입시 입력한 비밀번호 또는 변경할 비밀번호' />
          </p>
          <p>
            <label htmlFor='logform_phone'>휴대전화</label>
            <input type='tel' id='logform_phone' name='phone' required maxLength='11' value={form.phone} onChange={handleChange} placeholder='휴대전화(숫자만 입력' />
          </p>
          <p>
            <label htmlFor='logform_email'>이메일</label>
            <input type='email' id='logform_email' name='email' required maxLength='40' value={form.email} onChange={handleChange} placeholder='이메일(예. id@domain.com)' />
          </p>

          <p className='logform_initial_region'>
            <label htmlFor='logform_init_region'>입력하신 지역 <span>(지역 수정시 화면에 변경되어 나옵니다.)</span></label>
            <input type="text" value={form.region === '기타' ? form.locate : `${form.region} ${form.city} ${form.town}`} readOnly id='logform_init_region' />
          </p>

          <p>
            <label htmlFor='logform_region'>수정할 지역</label>
            <Region onChange={handleRegionChange} defer={false} />
          </p>

          <p className='logform_update'>
            <input type='submit' value='수정하기' />
          </p>
          <p className='logform_cancel'>
            <button type='button' value='취소' onClick={handleClick}>취소</button>
          </p>
        </fieldset>
      </form>
    </section>
  );
}

export default MemberUpdate;