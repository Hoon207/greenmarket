import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import dummy from '../data/MainList2.json';
import '../style/Mainlist.css';

function MainList(props) {
  // 좌우 스크롤 구현
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); // 드래그 중 여부 | 비활성화(false)
  const [startX, setStartX] = useState(0); // 시작시 마우스 X좌표 위치
  const [scrollLeft, setScrollLeft] = useState(0); // 시작 시점 스크롤 위치
  const [dragMoved, setDragMoved] = useState(false); // 드래그 여부 판단

  // 마우스 내렸을 때 (범위 내에 위치할 때)
  const handleMouseDown = (e) => {
    setIsDragging(true); // 활성화
    setDragMoved(false); // 클릭 시작시 드래그X 초기화
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }

  // 마우스 밖으로 나올 때 (범위를 벗어날 때)
  const handleMouseLeave = () => {
    setIsDragging(false); // 비활성화
  }

  // 마우스 올렸을 때 (범위를 벗어날 때)
  const handleMouseUp = () => {
    setIsDragging(false); // 비활성화
  }

  // 마우스를 움직였을 때 (범위 내에서 움직일 때)
  const handleMouseMove = (e) => {
    if(!isDragging) return; // 미작동시 취소
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft; // 현재 마우스 위치 - 시작 위치 = 스크롤 이동 거리 계산
    const walk = (x - startX) * 1.5; // 스크롤 속도 조절
    scrollRef.current.scrollLeft = scrollLeft - walk;

    // 일정 거리 이상 마우스를 움직인 경우만 드래그로 판단하여 활성화
    // if(Math.abs(walk) > 5) setDragMoved(true);
    if(Math.abs(x - startX) > 10) {
      setDragMoved(true);
    } // 세밀 조정
  }

  const handleClick = (e) => {
    if(dragMoved) {
      e.preventDefault(); // 드래그 중이면 클릭 방지
      e.stopPropagation(); // 현재 이벤트 부모요소로 전파 방지
    }
  }

  return (
    <section className='main_list_section'>
      <h2>🧥 트렌디한 중고 의류와 패션잡화 컬렉션 👓</h2>

      <div className='main_list_wrap' ref={scrollRef} 
      style={{
        // cursor: isDragging ? 'grabbing' : 'grab'
        cursor: dragMoved ? 'grabbing' : 'grab' //세밀 조정
      }} 
      onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
        {dummy.map((mlist, index) => (
          <div className='main_list' key={index}>
            <Link to='/' alt='상품 상세보기' onClick={handleClick}>
              <div className='main_list_img'>
                <img src={`${process.env.PUBLIC_URL}/images/${mlist.image}`} alt='상품 이미지'></img>
              </div>
              {/* json 데이터에 label값 유무에 따라 출력 변동 (조건부 렌더링 활용) */}
              {mlist.label &&
              <span className='main_list_label'>{mlist.label}</span>}
              <p className='main_list_name'>{mlist.name}</p>
              <p className='main_list_price'><span>{Number(mlist.price).toLocaleString()}</span>원</p>
              <p className='main_list_datetime'>1시간전</p>
            </Link>
          </div>
        ))}
        <p className='rightPage'>좌우로 움직여 보세요</p>
      </div>
    </section>
  );
}

export default MainList;

// 좌우 스크롤 구현 : chatGPT 도움받아서 진행.