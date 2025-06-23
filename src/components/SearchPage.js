import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ItemCard2 from './ItemCard2';  // 기존에 만든 카드 컴포넌트 임포트

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchPage() {
  const query = useQuery();
  const keyword = query.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!keyword) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    axios.get(`http://localhost:9070/products/search?keyword=${encodeURIComponent(keyword)}`)
      .then(res => {
        // 서버에서 받은 결과 배열 가공 (ProductPage와 비슷한 형태로 맞추기)
        const items = res.data.map(p => ({
          id: p.id,
          image: p.image_main || '',  // 이미지 파일명
          brand: p.brand,
          name: p.title,
          price: p.price,
          time: p.datetime ? new Date(p.datetime).toLocaleDateString() : '',
        }));

        setResults(items);
      })
      .catch(err => {
        setError('검색 중 오류가 발생했습니다.');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [keyword]);

  return (
    <div className="productpage_wrap">
      <h1 style={{display:'none'}}>검색 결과</h1>
      <p style={{fontSize:'20px'}}><img
              src={`${process.env.PUBLIC_URL}/images/searchpagelogo.png`}
              alt="검색페이지이미지"
              style={{width:'30px', height:'30px', verticalAlign:'middle', marginRight:'10px'}}
            /><strong>'{keyword}'</strong>(으)로 검색된 상품</p>

      {loading && <p>검색 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p>검색 결과가 없습니다.</p>
      )}

      {/* 상품 리스트 */}
      <ul className="productpage_items_list">
        {results.map(it => (
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
  );
}

export default SearchPage;
