import React from 'react';
import '../styles/Header.scss';
import { Link } from 'react-router-dom';
import Home from "./Home";
export default class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tabMenuArray : ['홈', '정산하기', '히스토리', '계좌관리'],
            tabPathArray : ['/', '/settle', '/history', '/account'],
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

    componentDidMount() {
        if(this.state.tabPathArray.indexOf(window.location.pathname) !==  -1){
            let nowTabIndex = this.state.tabPathArray.indexOf(window.location.pathname);
            let nowTabElem = document.getElementById("tab_"+nowTabIndex);
            nowTabElem.style.color = "rgb(70,236,231)";
            nowTabElem.style.borderBottom = "3px solid rgb(70,236,231)";
        }
    }

    render() {

        let actionBtn_class = (this.props.LoginUserName) ? 'mypage' : ' ';

        return (
            <div id="HeaderLayout">
                <div id="TopSection">
                    <div id="MainLogo">
                        <img id="AppLogo" src={"/img/AppLogo.png"}/>
                        <div id="AppLogo_text">모두의 정산</div>
                    </div>
                    <Link to={ (this.props.LoginUserName) ?  "/mypage"  : "/login"}>
                        <div id="ActionBtn" className={actionBtn_class}>{ (this.props.LoginUserName) ? '내 정보' : '로그인' }</div>
                    </Link>
                    </div>

                <div id="tabMenuSection">
                    {this.state.tabMenuArray.map((elem, index) => {
                        return <Link key={index} to={this.state.tabPathArray[index]}>
                                    <div id={"tab_"+index} onClick={this.tabMenuClick} className="tabMenu">{elem}</div>
                               </Link>
                    })}
               </div>
            </div>
        );
    }
}

Header.defaultProps = {
    LoginUserName : null,
}
