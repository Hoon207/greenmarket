import React from 'react';
import { Link } from 'react-router-dom';   

function Footer(props) {
  return (
      <footer>
        <div className='footer_wrap'>
          <div className='footer_gnb'>
            <ul>
              <li><Link to="/">회사소개</Link></li>
              <li><Link to="/">이용약관</Link></li>
              <li><Link to="/">운영정책</Link></li>
              <li><Link to="/">개인정보처리방침</Link></li>
              <li><Link to="/">청소년보호정책</Link></li>
              <li><Link to="/">광고제휴</Link></li>
            </ul>
          </div>
          <div className='footer_line'>

          </div>
          <div className='footer_con'>
          <div className='footer_address'>
            <p>그린마켓(주)ㅣ C조 그린마켓</p>
            <p>사업자등록번호 : 113-86-45834 </p>
            <p>호스팅서비스 제공자 : Amazon Web Services (AWS)</p>
            <p>EMAIL : help@greenmarket.co.kr</p>
            <p>주소 : 서울특별시 서초구 서초대로 38길 12, 7, 10층(서초동, 마제스타시티, 힐스테이트 서리풀)</p>
          </div>

          <div className='footer_cs_tel'>
            <p>고객센터</p>
            <p className='tel'>1670-2910</p>
          </div>

          <div className='footer_cs'>
            <p>CS운영시간</p>
            <p className='footer_cs_time'>9:00 - 18:00시 </p>
            <p className='footer_cs_time'>(주말/공휴일 휴무, 점심시간 12:00 - 13:00)</p>
            <ul className='footer_cs_menu'>
              <li><Link to="/">공지사항</Link></li>
              <li><Link to="/">1:1문의하기</Link></li>
              <li><Link to="/">자주 묻는 질문</Link></li>
            </ul>
          </div>
          </div>
        </div>
      </footer>
  );
}

export default Footer;