import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/cart.css';

function Cart({ token }) {
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const actualToken = token || localStorage.getItem('token');
        if (!actualToken) {
          alert('로그인 후 이용가능합니다.');
          navigate('/login');
          return;
        }

        const res = await axios.get(
          'https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/cart',
          { headers: { Authorization: `Bearer ${actualToken}` } }
        );

        const cartWithChecked = res.data.map(item => ({ ...item, checked: false }));
        setProductData(cartWithChecked);
      } catch (err) {
        console.error('장바구니 데이터를 불러오는데 실패했습니다.', err);
      }
    };

    fetchCart();
  }, [token, navigate]);

  const handleCheck = id => {
    setProductData(prev =>
      prev.map(product =>
        product.cart_id === id ? { ...product, checked: !product.checked } : product
      )
    );
  };

  const actualToken = token || localStorage.getItem('token');

  const handleDeleteSelected = async () => {
    const selectedIds = productData.filter(p => p.checked).map(p => p.cart_id);
    if (!selectedIds.length) return;

    try {
      await axios.delete(
        'https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/cart',
        {
          data: { ids: selectedIds },
          headers: { Authorization: `Bearer ${actualToken}` }
        }
      );
      setProductData(prev => prev.filter(p => !p.checked));
    } catch (err) {
      console.error('선택 삭제 실패', err);
    }
  };

  const handleDeleteAll = async () => {
    const allIds = productData.map(p => p.cart_id);
    if (!allIds.length) return;

    try {
      await axios.delete(
        'https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/cart',
        {
          data: { ids: allIds },
          headers: { Authorization: `Bearer ${actualToken}` }
        }
      );
      setProductData([]);
    } catch (err) {
      console.error('전체 삭제 실패', err);
    }
  };

  const handleDeleteSingle = async cartId => {
    try {
      await axios.delete(
        'https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/cart',
        {
          data: { ids: [cartId] },
          headers: { Authorization: `Bearer ${actualToken}` }
        }
      );
      setProductData(prev => prev.filter(p => p.cart_id !== cartId));
    } catch (err) {
      console.error('단일 삭제 실패', err);
    }
  };

  const selectedProducts = productData.filter(p => p.checked);
  const itemsTotal = selectedProducts.reduce(
    (sum, p) => sum + p.price * (p.quantity || 1),
    0
  );
  const shippingTotal = selectedProducts.reduce(
    (sum, p) => sum + p.shipping_fee,
    0
  );
  const totalPrice = itemsTotal + shippingTotal;

  return (
    <div className='cart_wrap'>
      <h2 className='cart_wrap_title'>장바구니</h2>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleDeleteSelected}>선택 삭제</button>{' '}
        <button onClick={handleDeleteAll}>모두 삭제</button>
      </div>

      <table className='cart_table'>
        <thead>
          <tr>
            <th>선택</th>
            <th>상품 이미지</th>
            <th>상품명</th>
            <th>브랜드</th>
            <th>카테고리</th>
            <th>상태</th>
            <th>가격</th>
            <th>배송비</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productData.length === 0 ? (
            <tr style={{ borderBottom: 'none' }}>
              <td colSpan='9'>장바구니에 담긴 상품이 없습니다.</td>
            </tr>
          ) : (
            productData.map(product => (
              <tr key={product.cart_id}>
                <td>
                  <input
                    type='checkbox'
                    checked={product.checked}
                    onChange={() => handleCheck(product.cart_id)}
                  />
                </td>
                <td>
                  <img
                    src={
                      product.image_main
                        ? `https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/uploads/${product.image_main}`
                        : '/default_image.png'
                    }
                    alt={product.title}
                    width='80'
                  />
                </td>
                <td>{product.title}</td>
                <td>{product.brand}</td>
                <td>{product.kind}</td>
                <td>{product.condition}</td>
                <td>{product.price.toLocaleString()}원</td>
                <td>
                  {product.shipping_fee === 0
                    ? '무료'
                    : `${product.shipping_fee.toLocaleString()}원`}
                </td>
                <td>
                  <button
                    className='cart_btn_buy'
                    onClick={() => alert(`${product.title} 구매하기`)}
                  >
                    구매
                  </button>
                  <br />
                  <button
                    className='cart_btn_delete'
                    onClick={() => handleDeleteSingle(product.cart_id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedProducts.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          선택된 상품: <strong>{selectedProducts.length}개</strong> / 합계: <strong>{totalPrice.toLocaleString()}원</strong>
        </div>
      )}
    </div>
  );
}

export default Cart;
