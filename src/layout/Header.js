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
  faSignOut
} from '@fortawesome/free-solid-svg-icons';


function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [keyword, setKeyword] = useState(''); 
  const [id, setId] = useState(null); // (회원정보 수정을 위함)

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    setUsername(storedName);
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    const storedId = localStorage.getItem('id'); // 사용자 ID (회원정보 수정을 위함)
    setUsername(storedName);
    setId(storedId); // (회원정보 수정을 위함)
    // 로그인 체크 및 강제 이동은 여기서 하지 마세요!
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('id'); // (회원정보 수정을 위함)
    setUsername(null);
    setId(null); // (회원정보 수정을 위함)
    setUsername(null);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim() === '') return;
    navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
    setKeyword('');
  };

  return (
    <header>
      <div className='header_wrap'>
        <div className='header_logo'>
          <Link to="/">
            <img
              src={`${process.env.PUBLIC_URL}/images/header_logo.png`}
              alt="메뉴보기"
            />
          </Link>
        </div>

        <div className='header_search_wrap'>
          <form onSubmit={handleSearchSubmit}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="header_search-icon" />
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
              aria-label="검색어 입력"
            />
          </form>
        </div>

        <nav className='header_lnb_wrap'>
          <ul>
            {username ? (
              <>
                <li>{username}님!</li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#333',
                      padding: 0,
                      fontSize: '1em',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                     <FontAwesomeIcon icon={faSignOut} className="header_logout-icon" />
                    <span className="header_logout-text">로그아웃</span>
                  </button>
                </li>
                <li>
                  <Link to={`/member/update/${id}`}>
                    <FontAwesomeIcon icon={faUser} className="header_userup-icon" />
                    <span className="header_userup-text">회원수정</span>
                  </Link>
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
            <Link to="/notice">
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
