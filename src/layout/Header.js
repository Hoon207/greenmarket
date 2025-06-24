import React, { useState, useEffect } from 'react';
import '../style/common.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faUser,
  faUserPlus,
  faHeadset,
  faShoppingCart,
  faBars,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const linkStyle = {
    display: 'block',
    padding: '6px 16px',
    fontSize: '1rem',
    color: '#333',
    textDecoration: 'none',
  };

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    setUsername(storedName);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/');
  };

  return (
    <header>
      <div className='header_wrap'>
        <div className='header_logo'>
          <Link to="/">
            <img src={`${process.env.PUBLIC_URL}/images/header_logo.png`} alt="메뉴보기" />
          </Link>
        </div>

        <button
          className="mobile_menu_btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="mobile_menu_icon" />
        </button>

        <div className='header_search_wrap'>
          <form>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="header_search-icon" />
            <input />
          </form>
        </div>

        {/* 모바일 메뉴 & 오버레이 */}
        {menuOpen && windowWidth < 768 && (
          <>
            {/* 검은 배경 오버레이 */}
            <div
              className="mobile_overlay"
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 1000,
              }}
            />

            {/* 오른쪽에서 슬라이드로 나오는 메뉴 */}
            <div
              className="mobile_menu"
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '250px',
                height: '100vh',
                backgroundColor: '#fff',
                zIndex: 1001,
                paddingTop: '60px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: menuOpen ? 'translateX(235px)': 'translateX(100%)',
              }}
            >
              <ul style={{ listStyle: 'none', padding: 0, margin: '25px 0', width: '100%', textAlign: 'center' }}>
                <li><Link to="/productpage" onClick={() => setMenuOpen(false)} style={linkStyle}>중고마켓</Link></li>
                <li><Link to="/goodsinsert" onClick={() => setMenuOpen(false)} style={linkStyle}>판매등록</Link></li>
                <li><Link to="/" onClick={() => setMenuOpen(false)} style={linkStyle}>그린커뮤니티</Link></li>
              </ul>

              <ul style={{ listStyle: 'none', padding: 0, marginTop: '50px', borderTop: '1px solid #eee', width: '100%', textAlign: 'center' }}>
                {username ? (
                  <>
                    <li><span style={{ ...linkStyle, fontWeight: 'bold' }}>{username}님!</span></li>
                    <li>
                      <button onClick={handleLogout} style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>로그아웃</button>
                    </li>
                    <li><Link to="/cart" onClick={() => setMenuOpen(false)} style={linkStyle}>장바구니</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" onClick={() => setMenuOpen(false)} style={linkStyle}>로그인</Link></li>
                    <li><Link to="/register" onClick={() => setMenuOpen(false)} style={linkStyle}>회원가입</Link></li>
                  </>
                )}
                <li><Link to="/" onClick={() => setMenuOpen(false)} style={linkStyle}>고객센터</Link></li>
              </ul>

              <ul style={{ listStyle: 'none', padding: 0, marginTop: '80px', borderTop: '1px solid #eee', width: '100%', textAlign: 'center' }}>
                <li><Link to="/qna" onClick={() => setMenuOpen(false)} style={linkStyle}>공지사항</Link></li>
                <li><Link to="/qna" onClick={() => setMenuOpen(false)} style={linkStyle}>1:1 문의하기</Link></li>
                <li><Link to="/faq" onClick={() => setMenuOpen(false)} style={linkStyle}>자주 묻는 질문</Link></li>
              </ul>
            </div>
          </>
        )}

        {/* PC 메뉴 */}
        <nav className='header_lnb_wrap'>
          <ul>
            {username ? (
              <>
                <li>{username}님!</li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}
                  >
                    <FontAwesomeIcon icon={faUser} className="header_logout-icon" />
                    <span className="header_logout-text">로그아웃</span>
                  </button>
                </li>
                <li>
                  <Link to="/cart">
                    <FontAwesomeIcon icon={faShoppingCart} className="header_cart-icon" />
                    <span className="header_cart-text">장바구니</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">
                    <FontAwesomeIcon icon={faUser} className="header_login-icon" />
                    <span className="header_login-text">로그인</span>
                  </Link>
                </li>
                <li>
                  <Link to="/register">
                    <FontAwesomeIcon icon={faUserPlus} className="header_register-icon" />
                    <span className="header_register-text">회원가입</span>
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/">
                <FontAwesomeIcon icon={faHeadset} className="header_cs-icon" />
                <span className="header_cs-text">고객센터</span>
              </Link>
            </li>
          </ul>
        </nav>

        <nav className='header_gnb_wrap'>
          <ul>
            <li><Link to="/productpage">중고마켓</Link></li>
            <li><Link to="/goodsinsert">판매등록</Link></li>
            <li><Link to="/">그린커뮤니티</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
