import React from 'react';
import SupportMnu from './SupportMnu';

function InquiryForm(props) {
  return (
    <section className='support_section'>
      <h2 className='support_none'>고객센터 - 1:1문의</h2>
      <SupportMnu />

      <article className='support_page' style={{fontWeight: 'bold', fontSize: '20px', textAlign: 'left', marginBottom: '15px'}}>
        <h3>1:1 문의</h3>
      </article>
    </section>
  );
}

export default InquiryForm;