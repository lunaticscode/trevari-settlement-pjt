import React from 'react';
import '../styles/Header.scss'
export default class Header extends React.Component {
    render() {
        return (
            <div id="HeaderLayout">
                <div id="TopSection">
                    <div id="MainLogo">LOGO</div>
                    <div id="LoginBtn">로그인</div>
                </div>
                <div id="tabMenuSection">
                    <div className="tabMenu">홈</div>
                    <div className="tabMenu">정산하기</div>
                    <div className="tabMenu">히스토리</div>
               </div>
            </div>
        );
    }
}
