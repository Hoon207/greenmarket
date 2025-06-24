// components/GoodsInsert.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/GoodsInsert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function GoodsInsert() {
  const navigate = useNavigate();

  // 로그인 체크: 토큰이 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  }, [navigate]);


  //폼 상태 관리
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brand: '',
    price: '',
    tradeType: '',
    condition: '',
    region: '',
    description: '',
    shipping_fee: ''  // 추가
  });

  // DataURL 미리보기
  const [images, setImages] = useState(Array(7).fill(''));
  // 실제 File 객체 저장
  const [imageFiles, setImageFiles] = useState({});
  const [thumbStartIndex, setThumbStartIndex] = useState(0);
  const fileInputRefs = useRef([]);

  function getThumbnailsPerPage(width) {
    if (width >= 1024) return 6;
    else if (width >= 768) return 6;
    else return 3;
  }
  const [thumbnailsPerPage, setThumbnailsPerPage] = useState(getThumbnailsPerPage(window.innerWidth));
  useEffect(() => {
    const handleResize = () => setThumbnailsPerPage(getThumbnailsPerPage(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const thumbnailCount = images.length - 1;
  const maxStartIndex = Math.max(thumbnailCount - thumbnailsPerPage, 0);
  useEffect(() => {
    setThumbStartIndex(prev => Math.min(prev, maxStartIndex));
  }, [thumbnailsPerPage, maxStartIndex]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onThumbnailClick = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const onFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    // 1) DataURL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages(prev => {
        const copy = [...prev];
        copy[index] = reader.result;
        return copy;
      });
    };
    reader.readAsDataURL(file);
    // 2) File 객체
    setImageFiles(prev => ({ ...prev, [index]: file }));
  };

  const handlePrev = () => {
    setThumbStartIndex(prev => Math.max(prev - 1, 0));
  };
  const handleNext = () => {
    setThumbStartIndex(prev => Math.min(prev + 1, maxStartIndex));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, category, brand, price, tradeType, condition, region, description, shipping_fee } = formData;
  
    if (!title || !category || !brand || !price || !tradeType || !condition || !region || !description || !shipping_fee) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (isNaN(price)) {
      alert('가격은 숫자로 입력해주세요.');
      return;
    }
    if (isNaN(shipping_fee)) {
      alert('배송비는 숫자로 입력해주세요.');
      return;
    }
  
    const token = localStorage.getItem('token');  // 로그인 때 저장한 토큰을 꺼냄
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');  // 로그인 페이지로 이동시키기
      return;
    }
  
    const fd = new FormData();
    fd.append('title', title);
    fd.append('brand', brand);
    fd.append('kind', category);         
    fd.append('price', price);
    fd.append('tradeType', tradeType);
    fd.append('condition', condition);
    fd.append('region', region);
    fd.append('description', description);
    fd.append('shipping_fee', shipping_fee);
  
    Object.entries(imageFiles).forEach(([idx, file]) => {
      const field = idx === '0' ? 'image_main' : `image_${idx}`;
      fd.append(field, file);
    });
  
    try {
      const res = await axios.post('http://localhost:9070/products', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,  // 여기 토큰을 꼭 넣어주세요
        },
      });
      if (res.data.success) {
        alert('등록이 완료되었습니다.');
        navigate('/productpage');
      }
    } catch (err) {
      console.error('Axios Error:', err.response?.data || err.message);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) navigate('/');
  };

  return (
    <div className="goods-insert-container">
      <h2>판매등록</h2>
      <form className="goods-insert-form" onSubmit={handleSubmit}>
        {/* 제목 */}
        <p>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="안 쓰는 물건 팔아요"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </p>

        {/* 카테고리 */}
        <p>
          <label htmlFor="category">카테고리</label>
          <select
            name="category"
            id="category"
            required
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">제품선택</option>
            <option value="여성의류">여성의류</option>
            <option value="남성의류">남성의류</option>
            <option value="가방">가방</option>
            <option value="신발">신발</option>
            <option value="패션잡화">패션잡화</option>
            <option value="키즈">키즈</option>
            <option value="라이프">라이프</option>
            <option value="전자기기">전자기기</option>
            <option value="기타">기타</option>
          </select>
        </p>

        {/* 브랜드 */}
        <p>
          <label htmlFor="brand">브랜드선택</label>
          <select
            name="brand"
            id="brand"
            required
            value={formData.brand}
            onChange={handleChange}
          >
            <option value="">선택</option>
            <option value="NoBrand">NoBrand</option>
            <option value="나이키">나이키</option>
            <option value="아디다스">아디다스</option>
            <option value="자라">자라</option>
            <option value="유니클로">유니클로</option>
            <option value="폴로 랄프 로렌">폴로 랄프 로렌</option>
            <option value="타미힐피거">타미힐피거</option>
            <option value="리바이스">리바이스</option>
            <option value="삼성">삼성</option>
            <option value="애플">애플</option>
            <option value="다이소">다이소</option>
          </select>
        </p>

        {/* 사진 */}
        <label htmlFor="image">사진</label>
        <div className="photo-section">
          {/* 메인 사진 */}
          <div className="main-photo" onClick={() => onThumbnailClick(0)} style={{ cursor: 'pointer' }}>
            {images[0]
              ? <img src={images[0]} alt="상품 이미지" />
              : <FontAwesomeIcon icon={faCamera} style={{ fontSize: '48px', color: '#555' }} />
            }
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={el => (fileInputRefs.current[0] = el)}
              onChange={e => onFileChange(e, 0)}
            />
          </div>

          {/* 썸네일 슬라이드 */}
          <div className="thumbnails-wrapper">
            <button type="button" className="thumb-nav prev"
              onClick={handlePrev} disabled={thumbStartIndex === 0}>
              <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: '50px' }} />
            </button>
            <div className="thumbnails">
              {images.slice(1)
                .slice(thumbStartIndex, thumbStartIndex + thumbnailsPerPage)
                .map((src, idx) => {
                  const actual = thumbStartIndex + idx + 1;
                  return (
                    <div key={actual} className="thumbnail-wrapper"
                      onClick={() => onThumbnailClick(actual)} style={{
                        cursor: 'pointer',
                        position: 'relative',
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        textAlign: 'center',
                      }}>
                      {src
                        ? <img src={src} alt={`사진 ${actual}`} className="thumbnail-preview" style={{
                            width: '100%', height: '100%', objectFit: 'cover'
                          }} />
                        : <FontAwesomeIcon icon={faCamera} style={{
                            fontSize: '32px', color: '#555',
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)'
                          }} />
                      }
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={el => (fileInputRefs.current[actual] = el)}
                        onChange={e => onFileChange(e, actual)}
                      />
                    </div>
                  );
                })}
            </div>
            <button type="button" className="thumb-nav next"
              onClick={handleNext} disabled={thumbStartIndex >= maxStartIndex}>
              <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '50px' }} />
            </button>
          </div>
        </div>

        {/* 가격 */}
        <p>
          <label htmlFor="price">가격</label>
          <input
            type="text"
            id="price"
            name="price"
            required
            value={formData.price}
            onChange={handleChange}
          />
        </p>

        {/* 거래방식 */}
        <p>
          <label htmlFor="tradeType">거래 방식</label>
          <select
            name="tradeType"
            id="tradeType"
            required
            value={formData.tradeType}
            onChange={handleChange}
          >
            <option value="">-- 선택 --</option>
            <option value="직거래">직거래</option>
            <option value="택배거래">택배거래</option>
          </select>
        </p>

        {/* 제품 상태 */}
        <p>
          <label htmlFor="condition">제품 상태</label>
          <select
            name="condition"
            id="condition"
            required
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="">상태 선택</option>
            <option value="새상품(미개봉)">새상품(미개봉)</option>
            <option value="거의 새상품(상)">거의 새상품(상)</option>
            <option value="사용감 있는 깨끗한 상품(중)">사용감 있는 깨끗한 상품(중)</option>
            <option value="사용 흔적이 많이 있는 상품(하)">사용 흔적이 많이 있는 상품(하)</option>
          </select>
        </p>

        {/* 희망 지역 */}
        <p>
          <label htmlFor="region">희망 지역</label>
          <input
            type="text"
            id="region"
            name="region"
            placeholder="서울시 종로구 구기동"
            required
            value={formData.region}
            onChange={handleChange}
          />
        </p>

        <p>
          <label htmlFor="shipping_fee">배송비</label>
          <input
            type="text"
            id="shipping_fee"
            name="shipping_fee"
            placeholder="2000(원)"
            required
            value={formData.shipping_fee}
            onChange={handleChange}
          />
        </p>

        {/* 상세 설명 */}
        <p>
          <label htmlFor="description">상세 설명</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            required
            value={formData.description}
            onChange={handleChange}
          />
        </p>

        {/* 첨부파일(기존 그대로) */}
        <p>
          <label htmlFor="file">첨부파일</label>
          <input type="file" id="file" name="file" />
        </p>

        {/* 버튼 */}
        <div className="button-group">
          <button type="submit" className="submit-btn">등록하기</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default GoodsInsert;
