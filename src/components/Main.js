import React from 'react';
import Slide from './Slide';
import Upcon from './Upcon';
import MainTab from './MainTab';
import MainList1 from './MainList1';
import MainList2 from './MainList2';
import MainList3 from './MainList3';
import MainList4 from './MainList4';

function Main(props) {
  return (
<main>
  <div className='main_contents'>
    <div><Slide /></div>
    <div><Upcon /></div>
    <div className="main_section"><MainList1 /></div>
    <div className="main_section"><MainList2 /></div>
    <div className="main_tab"><MainTab /></div>
    <div className="main_section"><MainList3 /></div>
    <div className="main_section"><MainList4 /></div>
  </div>
</main>
  );
}

export default Main;