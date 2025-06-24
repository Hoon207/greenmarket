import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../style/ItemDetail.css';
import {jwtDecode} from 'jwt-decode'; 
import ItemCard2 from './ItemCard2';


function ItemDetail() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [sellerItems, setSellerItems] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [openCautionIndex, setOpenCautionIndex] = useState(null);

  const toggleCaution = (index) => {
    setOpenCautionIndex(prevIndex => (prevIndex === index ? null : index));
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch (err) {
        console.error('토큰 decode 실패', err);
      }
    }
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:9070/api/products/${id}`)
      .then(res => {
        const product = res.data;
        setItem(product);

        // 판매자의 다른 상품 불러오기
        axios.get(`http://localhost:9070/products?seller=${product.owner_id}`)
          .then(res => {
            const filtered = res.data.filter(p => p.id !== product.id);
            setSellerItems(filtered);
          })
          .catch(err => console.error('판매자 상품 불러오기 실패', err));

        // 같은 카테고리 상품 불러오기
        axios.get(`http://localhost:9070/products?kind=${product.kind}`)
          .then(res => {
            const filtered = res.data.filter(p => p.id !== product.id);
            setRelatedItems(filtered);
          })
          .catch(err => console.error('카테고리 상품 불러오기 실패', err));
      })
      .catch(err => {
        console.error('상품 데이터를 불러오는 데 실패했습니다.', err);
        setItem(null);
      });
  }, [id]);

  if (!item) return <div>상품을 찾을 수 없습니다.</div>;

  const imageList = [
    item.image_main,
    item.image_1, item.image_2, item.image_3,
    item.image_4, item.image_5, item.image_6,
  ].filter(Boolean);

  return (
    <>
      <div className='item_detail_wrap'>
        <p className='item_category'>{item.kind}</p> 
        <div className='detail_top_wrap'>
          <div className='detailSlide_wrap'>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop={true}
              className='detailSlide'
            >
              {imageList.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={`http://localhost:9070/uploads/${img}`}
                    alt={`상품 이미지 ${i + 1}`}
                    className='item_detail_img'
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className='profile_wrap'>
            <div className='seller_profile'>
              <img src="/images/seller_img.png" alt="판매자" className='seller_profile_img' />
              <div className='seller_info'>
                <p className='seller_id'>판매자: {item.seller_name}</p>
                <p className='seller_items'>판매중 {item.seller_product_count}개</p>
              </div>
            </div>
          </div>
        </div>

        <div className='item_info'>
          <p className='item_name' style={{fontSize:'24px'}}>{item.title}</p>
          <p className='price'>{item.price.toLocaleString()}원</p>
          <hr className='hr' />
          <ul className='item_status'>
            <li>상품상태: {item.condition}</li>
            <li>배송비: {item.shipping_fee === 0 ? '무료' : `${item.shipping_fee.toLocaleString()}원`}</li>
            <li>거래방식: {item.trade_type}</li>
          </ul>
          
          <div className='item_btns_wrap'>
            <ul className='item_btns'>
              <li><button className='btn_question'>1:1문의</button></li>
              <li>
                <button
                  className='btn_cart'
                  onClick={() => {
                    axios.post('http://localhost:9070/api/cart', { product_id: item.id }, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    .then(() => alert('장바구니에 추가되었습니다.'))
                    .catch(error => {
                      const status = error.response?.status;
                      const msg = error.response?.data?.message || '오류가 발생했습니다.';
                      if (status === 400 && msg === '이미 장바구니에 있는 상품입니다.') {
                        alert('이미 장바구니에 있는 상품입니다.');
                      } else if (status === 401) {
                        alert('로그인이 필요합니다.');
                      } else {
                        alert(msg);
                      }
                    });
                  }}
                >
                  장바구니 추가
                </button>
              </li>
              <Link to='/cart'>
                <li><button className='btn_buy'>구매</button></li>
              </Link>
            </ul>
          </div>
        </div>
      </div>

      <div className='item_textbox'>
        <span className='description'>상세설명</span>
        {item.description || '상세 설명이 없습니다.'}
        <div className='caution_wrap'>
            <h3>📌중고거래시 유의사항 '<span>거래 전</span> 반드시 확인하세요'📌</h3>
            <ul className='caution_list'>
  {[
    {
      title: "선입금은 절대 금지 (특히 개인 간 거래에서)",
      details: [
        "직거래 원칙: 가능하면 직접 만나서 물건 상태 확인 후 현금 결제",
        "택배 거래 시: 안전결제(에스크로)를 사용하거나, 계좌 사기 이력 조회 → 더치트 등으로 상대 계좌번호/전화번호 검색"
      ]
    },
    {
      title: "계좌이체 기록은 꼭 남기기",
      details: [
        "계좌이체 시 이체 메모에 상품명, 날짜 등 구체 정보 남기기",
        "입금 완료 후 상대방에게 반드시 송금 내역을 캡처해서 전송"
      ]
    },
    {
      title: "상품 수령 전까지 거래 내역 캡처/보관",
      details: [
        "판매자 정보 (닉네임, 전화번호, 계좌번호)",
        "대화 내용 (가격, 조건, 약속일자 등)",
        "송금 내역 및 택배 송장"
      ]
    },
    {
      title: "거래 취소 및 환불 조건 명확히 합의",
      details: [
        '"하자 있을 시 환불 가능" 등의 조건을 미리 명시',
        "중고는 원칙상 환불이 어렵지만, 미리 약속한 조건과 다르면 환불 사유가 될 수 있음"
      ]
    },
    {
      title: "고가 제품은 절대 믿을 수 없는 방식으로 거래하지 말기",
      details: [
        "비정상적으로 저렴한 가격 제시 시 사기 가능성 높음",
        "리셀, 게임 아이템, 디지털 코드 등은 환불 어려움 → 사기 신고도 어려움"
      ]
    },
    {
      title: "거래 후에도 일정 기간 연락처 보관",
      details: [
        "문제가 생겼을 때 바로 연락하거나 신고할 수 있도록 최소 1~2주는 보관",
        "문제 발생 시, 지역 경찰서 또는 사이버범죄 수사대에 신고"
      ]
    }
  ].map((item, index) => (
    <li key={index} className='caution_list_title'>
      <div
        className='caution_title_click'
        onClick={() => toggleCaution(index)}
        style={{
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span className='caution_list_title2'>{item.title}</span>
      </div>
      {openCautionIndex === index && (
        <ul className='sub'>
          {item.details.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>
      )}
    </li>
  ))}
</ul>

          </div>
      </div>

      {currentUserId === item.owner_id && (
        <div className='edit_btn_wrap'>
          <Link to={`/goodsedit/${item.id}`}>
            <button className='btn_edit'>상품 수정</button>
          </Link>
          <button
            className='btn_delete'
            onClick={() => {
              if (window.confirm('정말로 삭제하시겠습니까?')) {
                axios.delete(`http://localhost:9070/products/${item.id}`, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                .then(() => {
                  alert('상품이 삭제되었습니다.');
                  window.location.href = '/';
                })
                .catch(err => {
                  alert('삭제 중 오류 발생');
                  console.error(err);
                });
              }
            }}
          >
            상품 삭제
          </button>
        </div>
      )}

      <div className='other_items_section'>
        <h3>🏡판매자의 다른 상품</h3>
        <ul className='itemcard2-list'>
          {sellerItems.length === 0 ? (
            <p>다른 상품이 없습니다.</p>
          ) : (
            sellerItems
            .filter(p => p && p.image_main)
            .map(product => (
              <ItemCard2
                key={product.id}
                id={product.id}
                imgSrc={`http://localhost:9070/uploads/${product.image_main}`}
                brand={product.brand}
                name={product.title}
                price={product.price.toLocaleString() + '원'}
                time={new Date(product.datetime).toLocaleDateString()}
              />
            ))
          )}
        </ul>
      </div>
     
      <div className='other_items_section'>
        <h3>🎪비슷한 카테고리 상품</h3>
        <ul className='itemcard2-list'>
          {relatedItems.length === 0 ? (
            <p>해당 카테고리의 다른 상품이 없습니다.</p>
          ) : (
            relatedItems.map(product => (
              <ItemCard2
                key={product.id}
                id={product.id}
                imgSrc={`http://localhost:9070/uploads/${product.image_main}`}
                brand={product.brand}
                name={product.title}
                price={product.price.toLocaleString() + '원'}
                time={new Date(product.datetime).toLocaleDateString()}
              />
            ))
          )}
        </ul>
        
      </div>
    
    </>
  );
}

export default ItemDetail;
