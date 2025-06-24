import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../style/ItemDetail.css';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get(
      `https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/products/${id}`
    )
    .then(res => setItem(res.data))
    .catch(err => {
      console.error('상품 데이터를 불러오는 데 실패했습니다.', err);
      setItem(null);
    });
  }, [id]);

  if (!item) return <div>상품을 찾을 수 없습니다.</div>;

  // 이미지 파일명 배열
  const imageList = [
    item.image_main,
    item.image_1,
    item.image_2,
    item.image_3,
    item.image_4,
    item.image_5,
    item.image_6
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
                    src={`https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/uploads/${img}`}
                    alt={`상품 이미지 ${i + 1}`}
                    className='item_detail_img'
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className='profile_wrap'>
            <div className='seller_profile'>
              <img
                src="/images/seller_img.png"
                alt="판매자"
                className='seller_profile_img'
              />
              <div className='seller_info'>
                <p className='seller_id'>판매자: {item.seller_name}</p>
                <p className='seller_items'>판매중 {item.seller_product_count}개</p>
              </div>
            </div>
          </div>
        </div>

        <div className='item_info'>
          <p className='item_name'>{item.title}</p>
          <p className='price'>{item.price.toLocaleString()}원</p>
          <hr className='hr' />
          <ul className='item_status'>
            <li>상품상태: {item.condition}</li>
            <li>
              배송비: {item.shipping_fee === 0 ? '무료' : `${item.shipping_fee.toLocaleString()}원`}
            </li>
            <li>거래방식: {item.trade_type}</li>
          </ul>
          <div className='item_btns_wrap'>
            <ul className='item_btns'>
              <li>
                <button className='btn_question'>1:1문의</button>
              </li>
              <li>
                <button
                  className='btn_cart'
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    axios.post(
                      'https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/cart',
                      { product_id: item.id },
                      { headers: { Authorization: `Bearer ${token}` } }
                    )
                    .then(() => alert('장바구니에 추가되었습니다.'))
                    .catch(error => {
                      const status = error.response?.status;
                      const msg = error.response?.data?.error || '오류가 발생했습니다.';
                      if (status === 400) alert(msg);
                      else if (status === 401) alert('로그인이 필요합니다.');
                      else alert(msg);
                    });
                  }}
                >
                  장바구니 추가
                </button>
              </li>
              <li>
                <Link to='/cart'>
                  <button className='btn_buy'>구매</button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='item_textbox'>
        <span className='description'>상세설명</span>
        {item.description || '상세 설명이 없습니다.'}
      </div>

      <div>판매자의 다른 상품 슬라이드</div>
      <div>카테고리가 같은 다른 상품 슬라이드</div>
    </>
  );
}

export default ItemDetail;
