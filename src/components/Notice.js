import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import SupportMnu from './SupportMnu';
import '../style/notice.css';
import '../style/support.css';

function Notice() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // 관리자 여부 확인(GPT 도움)
  const [isAdmin, setIsAdmin] = useState(false); // (false: 숨기기, true: 표시)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
        const decoded = jwtDecode(token);
        // console.log('decoded: ', decoded);
        setIsAdmin(decoded.role === 'admin'); // role이 'admin'일 경우만 관리자
    }
  }, []);

  // 페이지네이션 생성
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 화면 표시 글 갯수

  // 페이지 계산
  const indexOfLast = currentPage * itemsPerPage; // 현재 페이지 마지막 번호
  const indexOfFirst = indexOfLast - itemsPerPage; // 현재 페이지 첫 인덱스 번호
  const currentItems = data.slice(indexOfFirst, indexOfLast); // 현재 페이지 해당 정도(처음,끝 사이)
  const totalPage = Math.ceil(data.length / itemsPerPage); // 전체 페이지 수 (올림 계산)

  let startPage = Math.max(1, currentPage - 2); // 시작 번호
  let lastPage = Math.min(totalPage, startPage + 4); // 마지막 번호

  const pageNumbers = Array.from({length: lastPage - startPage + 1}, (_, i) => startPage + i); // 동적인 페이지 번호 배열

  // 리스트 조회
  const loadData = () => {
    axios
    .get('http://localhost:9070/notice')
    // 성공시
    .then(res => {
      setData(res.data);
    })
    // 실패시
    .catch(err => console.log(err));
  }
  useEffect(() => {loadData();}, []);

  // 리스트 삭제
  const delData = (id) => {
    if(window.confirm('데이터를 삭제하시겠습니까?')) {
      axios
      .delete(`http://localhost:9070/notice/${id}`)
      .then(() => {
        alert('삭제가 완료되었습니다.');
        loadData();

        // 삭제 후 페이지 조정
        if((currentPage - 1) * itemsPerPage >= data.length - 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      })
      .catch(err => console.log(err));
    }
  }

  // 게시일 - 날짜만 표시되도록 (GPT 도움)
  function formatDate(datetime) {
    return new Date(datetime).toISOString().split('T')[0]; // T로 시작하는 부분부터 절삭;
  }

  return (
    // 공지사항 출력(조회) [-> 조회, 삭제는 별도 페이지에서 관리...? or 관리자 전용으로 버튼 활성화]
    <section className='support_section notice_section'>
      <h2 className='support_none'>고객센터 - 공지사항</h2>
      <SupportMnu />

      <article className='support_page notice_page'>
        <h3 className='support_none'>공지사항</h3>
        <table>
          <caption>공지사항</caption>
          <thead>
            <tr>
              <th>No.</th>
              <th>제목</th>
              <th>작성자</th>
              <th>게시일</th>
              {isAdmin && (<th>관리</th>)}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td><Link to={`/notice/${item.id}`} title={`${item.title}`}>&#91;{item.category}&#93; {item.title}</Link></td>
                <td>{item.writer}</td>
                <td>{formatDate(item.datetime)}</td>

                {/* 관리자만 활성화 */}
                {isAdmin && (
                  <td>
                    <button type='button' onClick={() => navigate(`./update/${item.id}`)} className='notice_upd_btn'>수정</button>
                    <button type='button' onClick={() => {delData(item.id)}} className='notice_del_btn'>삭제</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className='pagination'>
          <p>
            {currentPage > 1 && (
              <button type='button' onClick={() => setCurrentPage(currentPage - 1)}>이전</button>
            )}
          </p>
          
          {pageNumbers.map(number => (
            <button type='button' key={number} onClick={() => setCurrentPage(number)} style={{
              backgroundColor: currentPage === number ? '#B9EC8F' : '#e0e0e0'
            }}>{number}</button>
          ))}
          
          <p>
            {currentPage < totalPage && (
              <button type='button' onClick={() => setCurrentPage(currentPage + 1)}>다음</button>
            )}
          </p>
        </div>

        {/* 버튼은 관리자만 활성화 */}
        {isAdmin && (
          <div className='notice_crt_btn'>
            <button type='button' onClick={() => navigate('/notice/create')}>등록</button>
          </div>
        )}
      </article>
    </section>
  );
}

export default Notice;