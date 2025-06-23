// src/components/Slide.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import '../style/slide.css'

function Slide() {
  const slides = [
    {
      img: '/images/Slide_img_1.png',
      caption: '2025 여름시즌\n그린마켓 빈티지 티셔츠 모음',
      link: '/',
    },
    {
      img: '/images/Slide_img_2.png',
      caption: '봄 맞이 플리마켓\n그리니 페스티벌 오픈',
      link: '/',
    },
    {
      img: '/images/Slide_img_3.png',
      caption: '그린마켓의 약속\n더 깨끗한 지구',
      link: '/',
    },
  ];

  return (
    <div className="slide_wrap">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        spaceBetween={10}
        slidesPerView={1}
        
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            {/* Link 로 이미지+캡션 전체를 감싸줍니다 */}
            <Link to={slide.link} className="slide_link">
              <img
                src={`${process.env.PUBLIC_URL}${slide.img}`}
                alt={`슬라이드${idx + 1}`}
                className="slide_image"
              />
              <div className="slide_caption">
                {slide.caption}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Slide;
