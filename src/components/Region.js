import React, { useCallback, useEffect, useState } from 'react';

import regionCity from '../data/region.json';

function Region({onChange, defer = false}) {
  // defer = false : 회원가입 / ture: 수정
  const [selectRegion, setSelectRegion] = useState('');
  const [selectCity, setSelectCity] = useState('');
  const [town, setTown] = useState('');
  const [location, setLocation] = useState('');
  const [prevNotifyData, setPrevNotifyData] = useState(null); // 무한루프 해결목적 비교

  // 공통 값 부모로 전달
  const notify = useCallback((region, city, town, location) => {
    onChange({region, city, town, locate: location});
  }, [onChange]); // onChange가 props로 들어왔으므로 의존성에 추가
  // 의존성 배열을 위해 usecallback 사용 (GPT 참고)

  // 회원정보 수정 부분(여기만)
  useEffect(() => {
    if (defer) {
    // defer가 true일 때도 최초에 한번만 notify 호출하도록 수정
    if (!prevNotifyData) {
      const dataNotify = (() => {
        // 지역이 '기타'
        if (selectRegion === '기타' && location) {
          return { region: selectRegion, city: '', town: '', locate: location };
        }
        // '세종시'일 때
        if (selectRegion === '세종특별자치시' && town) {
          return { region: selectRegion, city: '', town, locate: '' };
        }
        // 일반 공통
        if (selectRegion && selectCity && town) {
          return { region: selectRegion, city: selectCity, town, locate: '' };
        }
        return null;
      })();

      if (dataNotify) {
        notify(dataNotify.region, dataNotify.city, dataNotify.town, dataNotify.locate);
        setPrevNotifyData(dataNotify);
      }
    }
    return; // 그 뒤론 무한루프 방지를 위해 종료
  }

  // defer === false 일때 실행하는 기존 로직
  const dataNotify = (() => {
    if (selectRegion === '기타' && location) {
      return { region: selectRegion, city: '', town: '', locate: location };
    }
    if (selectRegion === '세종특별자치시' && town) {
      return { region: selectRegion, city: '', town, locate: '' };
    }
    if (selectRegion && selectCity && town) {
      return { region: selectRegion, city: selectCity, town, locate: '' };
    }
    return null;
  })();

  if (dataNotify && JSON.stringify(dataNotify) !== JSON.stringify(prevNotifyData)) {
    notify(dataNotify.region, dataNotify.city, dataNotify.town, dataNotify.locate);
    setPrevNotifyData(dataNotify);
  }
}, [selectRegion, selectCity, town, location, defer, notify, prevNotifyData]);

  // 지역(도/특별시/광역시) 선택시
  const handleRegion = (e) => {
    const newRegion = e.target.value;
    setSelectRegion(newRegion);
    setSelectCity(''); // 초기화
    setTown('');
    setLocation('');

    // 회원정보 수정시 조건여부 파악
    if(!defer) notify(newRegion, '', '', ''); // 부모 전달
  }

  // 지역 선택 후 도시(시/군/구) 선택시
  const handleCity = (e) => {
    const newCity = e.target.value;
    setSelectCity(newCity);

    // 회원정보 수정시 조건여부 파악
    if(!defer) notify(selectRegion, newCity, '', ''); // 부모 전달
  }

  // 도시 선택 후 타운(읍/면/동) 선택시
  const handleTown = (e) => {
    const newTown = e.target.value;
    setTown(newTown);

    // 회원정보 수정시 조건여부 파악
    if(!defer) notify(selectRegion, selectCity, newTown, '');
  }

  const handleLocation = (e) => {
    const newLocate = e.target.value;
    setLocation(newLocate);

    // 회원정보 수정시 조건여부 파악
    if(!defer) notify(selectRegion, '', '', newLocate);
  }

  return (
    <>
      <select id='logform_region' name='region' value={selectRegion} onChange={handleRegion}>
        <option value=''>도/특별시/광역시</option>
        {Object.keys(regionCity).map((region) => (
          <option key={region} value={region}>{region}</option>
        ))}
        <option value='기타'>기타(섬 등)</option>
      </select>

      {/* 상단의 option 선택시 나오는 select */}
      {selectRegion && regionCity[selectRegion] && selectRegion !=='세종특별자치시' && (
        <select id='logform_city' name='city' value={selectCity} onChange={handleCity}>
          <option value=''>시/군/구</option>
          {regionCity[selectRegion].map((city) => (
            <option key={city} value={city}>{city}</option>
            ))}
        </select>
      )}

      {/* 상단의 option에서 '세종시' 선택시 나오는 input */}
      {selectRegion === '세종특별자치시' && (
        <input type='text' name='town' placeholder='읍/면/동을 입력해주세요' value={town} onChange={handleTown} id='logform_town' />
      )}
      {/* 상단의 option에서 시/군/구 (대부분 해당) 선택시 나오는 input */}
      {selectCity && selectRegion !== '세종특별자치시' && (
        <input type='text' name='town' placeholder='읍/면/동을 입력해주세요' value={town} onChange={handleTown} id='logform_town' />
      )}

      {/* 최상단의 option에서 기타 선택시 나오는 input */}
      {selectRegion === '기타' && (
        <input type='text' name='locate' placeholder='섬 또는 해당 지역을 입력해주세요' value={location} onChange={handleLocation} id='logform_locate' />
      )}
    </>
  );
}

export default Region;
// 지역 참고사이트 : https://www.laiis.go.kr/lips/mlo/wco/wholeCountryList.do => region.json에 데이터 입력
// GPT 질문의 답변 : sql 정상 입력 가능.
// GPT 참고 작성