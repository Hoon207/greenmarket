// src/components/Upcon.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../style/upcon.css';

function Upcon() {
  return (
    <>
      {/* ───────── 배너 영역 (이미지 제거, 핑크색 배경) ───────── */}
      <div className="upcon_banner">
        {/* 배너 이미지와 Link 제거됨, 대신 CSS에서 핑크 배경 적용 */}
        
        {/* ───────── 텍스트 오버레이 ───────── */}
        <div className="banner-overlay">
          <div className="slider-track">
            {/* A */}
            <div className="slider-item">
              <p className="banner-title">
                그린마켓과 함께 하는 친환경 오프라인 플리마켓 !
              </p>
              <p className="banner-date">2025. 5.28 ~ 2025.06.05</p>
            </div>
            {/* B */}
            <div className="slider-item">
              <p className="banner-title">
                쉬운 방법으로 참여하는 친환경 프로젝트 여러분의 힘이 모이면 지구가 깨끗해 집니다.
              </p>
            </div>
            {/* A 반복 */}
            <div className="slider-item">
              <p className="banner-title">
                그린마켓과 함께 하는 친환경 오프라인 플리마켓 !
              </p>
              <p className="banner-date">2025. 5.28 ~ 2025.06.05</p>
            </div>
            {/* B 반복 */}
            <div className="slider-item">
              <p className="banner-title">
                쉬운 방법으로 참여하는 친환경 프로젝트 여러분의 힘이 모이면 지구가 깨끗해 집니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── 메뉴 박스 ───────── */}
      <div className="upcon_menubox">
        <ul>
          <li>
            <div className="upcon_menuimg">
              <Link to="/productpage">
                <img
                  src={`${process.env.PUBLIC_URL}/images/upcon_menuimg1.png`}
                  alt="메뉴이미지"
                />
                <p>중고마켓</p>
              </Link>
            </div>
          </li>
          <li>
            <div className="upcon_menuimg">
              <Link to="/goodsinsert">
                <img
                  src={`${process.env.PUBLIC_URL}/images/upcon_menuimg2.png`}
                  alt="메뉴이미지"
                />
                <p>판매등록</p>
              </Link>
            </div>
          </li>
          <li>
            <div className="upcon_menuimg">
              <Link to="/">
                <img
                  src={`${process.env.PUBLIC_URL}/images/upcon_menuimg3.png`}
                  alt="메뉴이미지"
                />
                <p>기부</p>
              </Link>
            </div>
          </li>
          <li>
            <div className="upcon_menuimg">
              <Link to="/">
                <img
                  src={`${process.env.PUBLIC_URL}/images/upcon_menuimg4.png`}
                  alt="메뉴이미지"
                />
                <p>그린<br/>커뮤니티</p>
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Upcon;
