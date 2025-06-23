import React from 'react';
import SupportMnu from './SupportMnu';

function Qna(props) {
  return (
    <section className='support_section'>
      <h2 className='support_none'>고객센터 - 자주하는 질문</h2>
      <SupportMnu />

      <article className='support_page' style={{fontWeight: 'bold', fontSize: '20px', textAlign: 'left', marginBottom: '15px'}}>
        <h3>자주하는 질문</h3>
      </article>
    </section>
  );
}

export default Qna;