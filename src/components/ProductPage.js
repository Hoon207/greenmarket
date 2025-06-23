// components/ProductPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../style/productpage.css';
import Slide from './Slide';
import ItemCard2 from './ItemCard2';

const CATEGORY = [
  '여성의류', '남성의류', '가방', '신발',
  '패션잡화', '키즈', '라이프', '전자기기', '반려동물','기타',
];
const BRAND = [
  'NoBrand', '나이키', '아디다스', '자라', '유니클로',
  '폴로 랄프 로렌', '타미힐피거',
  '리바이스', '삼성', '애플', '다이소'
];
const CONDITION = ['새상품(미개봉)', '거의 새상품', '사용감 있는 깨끗한 상품', '사용 흔적이 많이 있는 상품'];
const SALESTATE = ['판매중', '판매완료'];

function ProductPage() {
  const [openKey, setOpenKey]       = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands]         = useState([]);
  const [conditions, setConditions] = useState([]);
  const [states, setStates]         = useState([]);
  const [priceMin, setPriceMin]     = useState('');
  const [priceMax, setPriceMax]     = useState('');
  const [keyword, setKeyword]       = useState('');  // 검색어 상태
  const [tempPriceMin, setTempPriceMin] = useState('');
  const [tempPriceMax, setTempPriceMax] = useState('');
  const [productItems, setProductItems] = useState([]);  // API로 받은 상품 리스트

  // 배열 토글 헬퍼
  const toggleArray = (v, setter) =>
    setter(prev => prev.includes(v) ? prev.filter(i => i !== v) : [...prev, v]);

  // 검색창 입력 핸들러
  const handleSearchChange = e => {
    setKeyword(e.target.value);
  };

  // 엔터 입력 시 검색 실행
  const handleSearchKey = e => {
    if (e.key === 'Enter') {
      fetchProducts(e.target.value.trim());
    }
  };

  // 상품 조회 함수 (keyword 포함, 필터도 가능하게 확장 가능)
  const fetchProducts = (searchKeyword = '') => {
    let url = 'http://localhost:9070/products';

    if (searchKeyword) {
      url += `?keyword=${encodeURIComponent(searchKeyword)}`;
    }

    axios.get(url)
      .then(res => {
        // 서버에서 받은 데이터 가공
        const items = res.data.map(p => ({
          id:        p.id,
          image:     p.images && p.images.length > 0 ? p.images[0] : '',
          brand:     p.brand,
          name:      p.title,
          price:     p.price,
          time:      new Date(p.datetime).toLocaleDateString(),
          category:  p.kind,
          condition: p.condition,
          state:     '판매중', // 기본값
        }));
        setProductItems(items);
      })
      .catch(console.error);
  };

  // 페이지 로드 시 전체 상품 조회
  useEffect(() => {
    fetchProducts();
  }, []);

  // 필터 및 가격, 상태, 검색어가 있을 경우 필터링 (클라이언트 사이드 필터)
  const filtered = productItems.filter(it => {
    if (categories.length && !categories.includes(it.category)) return false;
    if (brands.length && !brands.includes(it.brand)) return false;
    if (conditions.length && !conditions.includes(it.condition)) return false;
    if (states.length && !states.includes(it.state)) return false;
    if (priceMin && it.price < Number(priceMin)) return false;
    if (priceMax && it.price > Number(priceMax)) return false;
    if (keyword && !(
      it.name.toLowerCase().includes(keyword.toLowerCase()) ||
      it.brand.toLowerCase().includes(keyword.toLowerCase()) ||
      (it.region && it.region.toLowerCase().includes(keyword.toLowerCase()))
    )) return false;

    return true;
  });

  return (
    <>
      <Slide />

      <div className="productpage_wrap">

        {/* 상단 탭 */}
        <ul className="productpage_tab-list">
          {['category','brand','price','etc'].map((key, idx) => {
            const titles = ['카테고리','브랜드','가격','기타'];
            let badge = 0;
            if (key === 'category') badge = categories.length;
            else if (key === 'brand') badge = brands.length;
            else if (key === 'price' && (priceMin || priceMax)) badge = 1;
            else if (key === 'etc') badge = conditions.length + states.length;
            return (
              <li
                key={key}
                className={`productpage_tab-item ${openKey === key ? 'active' : ''}`}
                onClick={() => setOpenKey(openKey === key ? null : key)}
              >
                {titles[idx]}
                <FontAwesomeIcon icon={openKey === key ? faChevronUp : faChevronDown} />
                {badge > 0 && <em>{badge}</em>}
              </li>
            );
          })}
        </ul>

        {/* 카테고리 패널 */}
        {openKey==='category' && (
          <div className="productpage_panel">
            <ul className="productpage_grid">
              {CATEGORY.map(c => (
                <li
                  key={c}
                  className={categories.includes(c)?'on':''}
                  onClick={() => toggleArray(c, setCategories)}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 브랜드 패널 */}
        {openKey==='brand' && (
          <div className="productpage_panel">
            <ul className="productpage_grid">
              {BRAND.map(b => (
                <li
                  key={b}
                  className={brands.includes(b)?'on':''}
                  onClick={() => toggleArray(b, setBrands)}
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 가격 패널 */}
        {openKey==='price' && (
          <div className="productpage_panel productpage_price">
            <div className="price-inputs">
              <input
                type="number" placeholder="최소"
                value={tempPriceMin}
                onChange={e => setTempPriceMin(e.target.value)}
              />
              <span>~</span>
              <input
                type="number" placeholder="최대"
                value={tempPriceMax}
                onChange={e => setTempPriceMax(e.target.value)}
              />
              <button
                className={tempPriceMin && tempPriceMax ? 'active' : ''}
                onClick={() => {
                  setPriceMin(tempPriceMin);
                  setPriceMax(tempPriceMax);
                  setOpenKey(null);
                }}
              >
                적용하기
              </button>
            </div>
          </div>
        )}

        {/* 기타 패널 */}
        {openKey==='etc' && (
          <div className="productpage_panel productpage_panel--etc">
            <div className="etc_group">
              <span className="etc_title">제품 컨디션</span>
              <ul className="etc_list">
                {CONDITION.map(c => (
                  <li
                    key={c}
                    className={conditions.includes(c)?'on':''}
                    onClick={() => toggleArray(c, setConditions)}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <hr />

            <div className="etc_group">
              <span className="etc_title">판매상태</span>
              <ul className="etc_list">
                {SALESTATE.map(s => (
                  <li
                    key={s}
                    className={states.includes(s)?'on':''}
                    onClick={() => toggleArray(s, setStates)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 선택된 필터 토큰 및 초기화 */}
        {(categories.length || brands.length || conditions.length || states.length || priceMin || priceMax) && (
          <div className="productpage_filter-bar">
            <button onClick={() => {
              setCategories([]);
              setBrands([]);
              setConditions([]);
              setStates([]);
              setPriceMin('');
              setPriceMax('');
            }}>
              초기화 ↺
            </button>
            {[...categories, ...brands, ...conditions, ...states].map(t => (
              <span key={t}>
                {t} <b onClick={() => {
                  if (categories.includes(t)) toggleArray(t, setCategories);
                  else if (brands.includes(t)) toggleArray(t, setBrands);
                  else if (conditions.includes(t)) toggleArray(t, setConditions);
                  else toggleArray(t, setStates);
                }}>×</b>
              </span>
            ))}
            {(priceMin || priceMax) && (
              <span>
                {priceMin || 0}원 ~ {priceMax || '∞'}원
                <b onClick={() => { setPriceMin(''); setPriceMax(''); }}>×</b>
              </span>
            )}
          </div>
        )}

        {/* 검색창 */}
        <div className="productpage_search" style={{ marginTop: 30 }}>
          <FontAwesomeIcon icon={faSearch} />
          <input
            placeholder="상품명을 입력하고 Enter"
            value={keyword}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKey}
            aria-label="상품 검색"
          />
        </div>

        {/* 상품 리스트 */}
        <ul className="productpage_items_list">
          {filtered.map(it => (
            <ItemCard2
              key={it.id}
              id={it.id}
              imgSrc={`http://localhost:9070/uploads/${it.image}`}
              brand={it.brand}
              name={it.name}
              price={`${it.price.toLocaleString()}원`}
              time={it.time}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

export default ProductPage;
