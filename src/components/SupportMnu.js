import React from 'react';
import { NavLink } from 'react-router-dom';

function NoticeMnu(props) {
  return (
    <aside>
      <h2>고객센터</h2>
        <ul>
          <li><NavLink to='/notice' title='공지사항' className={({isActive}) => isActive ? 'active' : ''}>공지사항</NavLink></li>
          <li><NavLink to='/inquiry' title='1:1문의' className={({isActive}) => isActive ? 'active' : ''}>1:1문의</NavLink></li>
          <li><NavLink to='/qna' title='자주하는 질문' className={({isActive}) => isActive ? 'active' : ''}>자주하는 질문</NavLink></li>
        </ul>
        {/* 해당 위치에 따라 active 서식 적용/해제 => 조건식으로 처리해야...? */}
    </aside>
  );
}

export default NoticeMnu;