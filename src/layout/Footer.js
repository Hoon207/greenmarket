import React, { useState } from 'react';
import { Link } from 'react-router-dom';   
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp,  faAngleLeft,
  faBagShopping ,
  faHouse,
  faUser,
  faCartShopping} from '@fortawesome/free-solid-svg-icons';



function Footer(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

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

        <div className='footer_line'></div>

        {/* 모바일 전용 아코디언 영역 */}
        <div className='footer_con_mobile'>
          <button
            className='footer_toggle_btn'
            onClick={toggleOpen}
            aria-expanded={isOpen}
            aria-controls='footer_info_content'
            style={{
              width: '100%',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              padding: '12px 15px',
              fontSize: '1rem',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '4px',
            }}
          >
            회사정보 및 고객센터 운영시간
            <FontAwesomeIcon 
              icon={isOpen ? faChevronUp : faChevronDown} 
              style={{ marginLeft: '8px' }} 
            />
          </button>

          {isOpen && (
            <div id='footer_info_content' className='footer_info_content'>
              <div className='footer_address'>
                <p>그린마켓(주)ㅣ C조 그린마켓</p>
                <p>사업자등록번호 : 113-86-45834 </p>
                <p>호스팅서비스 제공자 : Amazon Web Services (AWS)</p>
                <p>EMAIL : help@greenmarket.co.kr</p>
                <p>주소 : 서울특별시 서초구 서초대로 38길 12, 7, 10층(서초동, 마제스타시티, 힐스테이트 서리풀)</p>
              </div>

              <div className='footer_cs_tel'>
                <p>고객센터</p>
                <p>1670-2910</p>
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
          )}
        </div>

        {/* 기존 footer_con는 데스크탑/태블릿 전용이라면 CSS에서 display: none 처리 가능 */}
        <div className='footer_con'>
          {/* 기존 내용 유지 */}
          <div className='footer_address'>
            <p>그린마켓(주)ㅣ C조 그린마켓</p>
            <p>사업자등록번호 : 113-86-45834 </p>
            <p>호스팅서비스 제공자 : Amazon Web Services (AWS)</p>
            <p>EMAIL : help@greenmarket.co.kr</p>
            <p>주소 : 서울특별시 서초구 서초대로 38길 12, 7, 10층(서초동, 마제스타시티, 힐스테이트 서리풀)</p>
          </div>

          <div className='footer_cs_tel'>
            <p>고객센터</p>
            <p>1670-2910</p>
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

      <div className="fixed_mobile_footer">
  <button className="footer_btn" onClick={() => window.history.back()}>
    <FontAwesomeIcon icon={faAngleLeft} />
  </button>
  <Link to="/goodsinsert" className="footer_btn">
    <FontAwesomeIcon icon={faBagShopping} />
  </Link>
  <Link to="/" className="footer_btn">
    <FontAwesomeIcon icon={faHouse} />
  </Link>
  <Link to="/login" className="footer_btn">
    <FontAwesomeIcon icon={faUser} />
  </Link>
  <Link to="/cart" className="footer_btn">
    <FontAwesomeIcon icon={faCartShopping} />
  </Link>
</div>

    </footer>
  );
}

export default Footer;
