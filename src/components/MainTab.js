import React, { useState } from 'react';
import ItemCard from './ItemCard';
import itemData from '../data/itemData';
import '../style/maintab.css';

function MainTab(props) {
  const [activeTab, setActiveTab] = useState("# 집꾸미기");
  const tabs = Object.keys(itemData);

  return (
    <div className='main_tab_con'>
      <h3>🧩실생활에 필요한 물건, 그린마켓 추천템으로 해결!💡</h3>
      <div className='main_tab_wrap'>
        {/* 탭 버튼 */}
        <ul className='main_tab_btns'>
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "btnAct" : ""}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>

        {/* 탭 콘텐츠 */}
        <div className='main_tab_content'>
          <div className='main_tab_content_inner'>

            {/* 왼쪽 대표 이미지 */}
            {itemData[activeTab]?.image && (
              <div className='main_tab_main_image'>
                <img
                  src={`${process.env.PUBLIC_URL}${itemData[activeTab].image}`}
                  alt={`${activeTab} 대표 이미지`}
                  className='main_tab_big_img'
                />
              </div>
            )}


            {/* 오른쪽 아이템 리스트 */}
            <ul className='main_tab_content_list'>
              {(itemData[activeTab]?.items || []).map((item) =>
                item.image ? (
                  <ItemCard
                    key={item.id}
                    imgSrc={`${process.env.PUBLIC_URL}${item.image}`}
                    brand={item.brand}
                    name={item.name}
                    price={item.price}
                    time={item.time}
                  />
                ) : (
                  <li key={item.id}>{item.name}</li>
                )
              )}
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}

export default MainTab;
