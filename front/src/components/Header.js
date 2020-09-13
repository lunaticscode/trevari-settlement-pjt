import React from 'react';
import '../styles/Header.scss'
import { Link } from 'react-router-dom';
import Home from "./Home";
export default class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tabMenuArray : ['홈', '정산하기', '히스토리', '계좌관리'],
        };
        this.tabMenuClick = this.tabMenuClick.bind(this);
    }

    tabMenuClick(e){
        let tabText_array = this.state.tabMenuArray;
        let tabMenu_doc = document.getElementsByClassName("tabMenu");
        let clickTab_text = e.target.innerText;
        let tabIndex = tabText_array.indexOf(clickTab_text);
        tabText_array.forEach((elem, index) => {
        if(tabIndex == index){
            tabMenu_doc[tabIndex].style.color = "rgb(70, 236, 231)";
            tabMenu_doc[tabIndex].style.borderBottom = "3px solid rgb(70, 236, 231)";
        }else{
            tabMenu_doc[index].style.color = "gray";
            tabMenu_doc[index].style.borderBottom = "0px solid gray";
        }
        });
    }


    render() {
        let first_tabMenu = {
            marginLeft:"15px",
            borderBottom:  "3px solid rgb(70, 236, 231)",
            color: "rgb(70, 236, 231)",
        };
        return (
            <div id="HeaderLayout">
                <div id="TopSection">
                    <div id="MainLogo">
                        <img id="AppLogo" src={"/img/AppLogo.png"}/>
                    </div>
                    <Link to={"/login"}>
                        <div id="LoginBtn">로그인</div>
                    </Link>
                    </div>

                <div id="tabMenuSection">
                        <Link to="/">
                            <div style={first_tabMenu} onClick={this.tabMenuClick} className="tabMenu">홈</div>
                        </Link>
                        <Link to="/settle">
                            <div onClick={this.tabMenuClick} className="tabMenu">정산하기</div>
                        </Link>
                        <Link to="/history">
                            <div onClick={this.tabMenuClick} className="tabMenu">히스토리</div>
                        </Link>
                        <Link to="/account">
                            <div onClick={this.tabMenuClick} className="tabMenu">계좌관리</div>
                        </Link>
               </div>
            </div>
        );
    }
}
