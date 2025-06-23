import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/GoodsInsert.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function GoodsEdit() {
  const getThumbnailsPerPage = (width) => {
    if (width >= 1024) return 6;
    else if (width >= 768) return 6;
    else return 3;
  };
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [thumbnailsPerPage, setThumbnailsPerPage] = useState(getThumbnailsPerPage(window.innerWidth));
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brand: '',
    price: '',
    tradeType: '',
    condition: '',
    region: '',
    description: '',
    shipping_fee: ''
  });

  const [images, setImages] = useState(Array(7).fill(''));
  const [imageFiles, setImageFiles] = useState({});
  const fileInputRefs = useRef([]);
  const [thumbStartIndex, setThumbStartIndex] = useState(0);
  const handlePrev = () => {
    setThumbStartIndex((prev) => Math.max(prev - 1, 0));
  };
  
  const handleNext = () => {
    setThumbStartIndex((prev) => Math.min(prev + 1, maxStartIndex));
  };
  const maxStartIndex = Math.max(images.length - 1 - thumbnailsPerPage, 0);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:9070/api/products/${id}`);
        console.log("응답 데이터:", res.data);
        const data = res.data; 

        setFormData({
          title: data.title || '',
          category: data.kind || '',
          brand: data.brand || '',
          price: data.price || '',
          tradeType: data.tradeType || '',
          condition: data.condition || '',
          region: data.region || '',
          description: data.description || '',
          shipping_fee: data.shipping_fee || ''
        });

        setImages((prev) => {
          const copy = [...prev];
          if (data.image_main) copy[0] = `http://localhost:9070/uploads/${data.image_main}`;
          for (let i = 1; i <= 6; i++) {
            if (data[`image_${i}`]) {
              copy[i] = `http://localhost:9070/uploads/${data[`image_${i}`]}`;
            }
          }
          return copy;
        });
      } catch (err) {
        console.error(err);
        alert('상품 정보를 불러오는 데 실패했습니다.');
        navigate(-1);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onThumbnailClick = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const onFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImages((prev) => {
        const copy = [...prev];
        copy[index] = reader.result;
        return copy;
      });
    };
    reader.readAsDataURL(file);
    setImageFiles((prev) => ({ ...prev, [index]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, category, brand, price, tradeType, condition, region, description, shipping_fee } = formData;

    if (!title || !category || !brand || !price || !tradeType || !condition || !region || !description || !shipping_fee) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (isNaN(price) || isNaN(shipping_fee)) {
      alert('가격과 배송비는 숫자로 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
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
      const res = await axios.put(`http://localhost:9070/products/${id}`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        alert('수정이 완료되었습니다.');
        navigate(-1);
      }
    } catch (err) {
      console.error('수정 중 오류:', err.response?.data || err.message);
      alert('상품 수정에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) navigate(-1);
  };

  return (
    <div className="goods-insert-container">
      <h2>상품 수정</h2>
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
                  <option value="거의 새상품">거의 새상품</option>
                  <option value="사용감 있는 깨끗한 상품">사용감 있는 깨끗한 상품</option>
                  <option value="사용 흔적이 많이 있는 상품">사용 흔적이 많이 있는 상품</option>
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
                <button type="submit" className="submit-btn">수정하기</button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
              </div>
            </form>
    </div>
  );
}

export default GoodsEdit;
