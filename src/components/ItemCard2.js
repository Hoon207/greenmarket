import React from 'react';
import { Link } from 'react-router-dom';
import '../style/itemcard2.css';
import { getTimeAgo } from '../utils/getTimeAgo';
console.log('getTimeAgo', getTimeAgo);  // 함수로 나와야 함
function ItemCard2({ id, imgSrc, brand, name, price, time, link }) {
const registerTime  = getTimeAgo(time);


  
  return (
    <li className="itemcard2">
      <Link to={`/products/${id}`}>
        <div className="itemcard2-image-wrapper">
          <img src={imgSrc} alt={name} className="item" />
        </div>
        <span className="brand2">{brand}</span>
        <p className="item_name">{name}</p>
        <p className="price">{price}</p>
        <p className="register_time">{registerTime}</p>
      </Link>
    </li>
  );
}

export default ItemCard2;
