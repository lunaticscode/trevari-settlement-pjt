import React from 'react';
import '../styles/Header.scss';
import { Link } from 'react-router-dom';
import Home from "./Home";
import {click_link} from "../actions";
import {connect} from "react-redux";
import App from "./App";
import {createStore} from "redux";
import counterApp from "../reducers";

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tabMenuArray : ['홈', '정산하기', '히스토리', '계좌관리'],
            tabPathArray : ['/', '/settle', '/history', '/account'],
            nowPath : ( localStorage.getItem( "PageStack" ) ) ? localStorage.getItem( "PageStack" ).split(',')[0] : '/',
        };
        this.props.appMoveInfo['nowPage'] = this.state.nowPath;

        this.tabMenuClick = this.tabMenuClick.bind(this);
    }

    tabMenuClick(e){
        let clickedTab_textValue = e.target.innerText;
            let tabIndexNumber = this.state.tabMenuArray.indexOf(clickedTab_textValue);
            let clickedTab_pathName = this.state.tabPathArray[tabIndexNumber];
            this.props.clickLink(clickedTab_pathName);
    }

    componentDidUpdate(prevProps, prevState) {
        //* PageStack.js 에서 관리중인 pageStackArray[] 변경 시,
        //* mapStateToProps 에서 감지.
        //* 그리고 현재 Header.js 컴포넌트의 props 변경.
        //* 현재 페이지가 변경됬을 때만, 아래 조건문 실행.
        if(prevProps.appMoveInfo['nowPage'] !== this.props.appMoveInfo['nowPage']) {
            let prevTabIndex = this.state.tabPathArray.indexOf(prevProps.appMoveInfo['nowPage']);
            let nowTabIndex = this.state.tabPathArray.indexOf(this.props.appMoveInfo['nowPage']);
            document.getElementById("tab_"+prevTabIndex).classList.remove('clicked');
            document.getElementById("tabBorder_"+prevTabIndex).classList.remove("clickedBorder");
            document.getElementById("tab_"+nowTabIndex).classList.add('clicked');
            document.getElementById("tabBorder_"+nowTabIndex).classList.add('clickedBorder');
        }
    }


    componentDidMount() {
        let now_tabIndex = this.state.tabPathArray.indexOf(this.props.appMoveInfo['nowPage']);
        document.getElementById("tab_"+now_tabIndex).classList.add('clicked');
        document.getElementById("tabBorder_"+now_tabIndex).classList.add('clickedBorder');

        if(this.state.nowPath !== window.location.pathname && this.state.tabPathArray.indexOf(window.location.pathname) !== -1 ){
            this.props.clickLink(window.location.pathname);
        }

    }

    render() {
        //* history.back() 이벤트 때,
        //* window 실제 경로와 PageStack에서 관리중인 경로 불일치 시,
        //* window 실제 경로로 다시 PageStack 재구성.
        window.addEventListener('popstate',() => {
            let now_pageStack = localStorage.getItem("PageStack").split(',');
            if(now_pageStack[0] !== window.location.pathname) {
                this.props.clickLink(window.location.pathname);
            }
        });

        let actionBtn_class = (this.props.LoginUserName) ? 'mypage' : ' ';
        return (
            <div id="HeaderLayout">
                <div id="TopSection">
                    <div id="MainLogo">
                        <img id="AppLogo" src={"/img/AppLogo2.png.png"}/>
                        <div id="AppLogo_text">모두의 정산</div>
                    </div>
                    <Link to={ (this.props.LoginUserName) ?  "/mypage"  : "/login"}>
                        <div id="ActionBtn" className={actionBtn_class}>{ (this.props.LoginUserName) ? '내 정보' : '로그인' }</div>
                    </Link>
                </div>

                <div id="tabMenuSection">
                    {this.state.tabMenuArray.map((elem, index) => {
                        return <Link key={index} to={this.state.tabPathArray[index]}>
                                    <div id={"tab_"+index} onClick={this.tabMenuClick} className="tabMenu">
                                        {elem}
                                        <div id={"tabBorder_"+index}  className="tabMenuBorder"></div>
                                    </div>

                               </Link>
                    })}
               </div>
            </div>
        );
    }
}


Header.defaultProps = {
    LoginUserName : null,
};

//* Redux Store에서 관리중인, state 값 변경 감지,
//* ( 마우스 터치 슬라이드 혹은 클릭 이벤트 때, 탭메뉴 표시를 위해.. )
const mapStateToProps = (state) => {
    //console.log('redux store - pageChangeInfo : ',state['pageChange']);
    console.log(state['pageChange']);
    return{
      appMoveInfo : state['pageChange'],
    };

};

let mapDispatchToProps = (dispatch) => {
    return {
        clickLink: (nowPage) => dispatch(click_link(nowPage))
    }
};

Header = connect(mapStateToProps, mapDispatchToProps)(Header);

export default Header;
