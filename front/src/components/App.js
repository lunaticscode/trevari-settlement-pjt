import React from 'react';
import '../styles/App.scss';
import Header from "./Header";
import Settle from "./Settle";
import History from "./History";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Home";
import LoginModal from "./LoginModal";
import JoinModal from "./JoinModal";
import Account from "./Account";
import AlertModal from './AlertModal';
import Cookie from "../Cookie";
import Fetch from "../Fetch";
import Mypage from "./Mypage";
import {commonModal_open, left_swipe, mask_close, mask_open, modal_close, modal_open, right_swipe} from "../actions";
import {connect} from "react-redux";
import PageStack from "./PageStack";
import SettleEdit from "./SettleEdit";
import SettleDetailModal from "./SettleDetailModal";
import Mask from "./Mask";
import CommonModal from "./CommonModal";
import Sleep from "../Sleep";
import crypto from "../CryptoInfo";
import SettleResultPage from "./SettleResultPage";

(function(j,en,ni,fer) {
    j['dmndata']=[];j['jenniferFront']=function(args){window.dmndata.push(args)};
    j['dmnaid']=fer;j['dmnatime']=new Date();j['dmnanocookie']=false;j['dmnajennifer']='JENNIFER_FRONT@INTG';
    var b=Math.floor(new Date().getTime() / 60000) * 60000;var a=en.createElement(ni);
    a.src='https://d-collect.jennifersoft.com/'+fer+'/demian.js?'+b;a.async=true;
    en.getElementsByTagName(ni)[0].parentNode.appendChild(a);
}(window,document,'script','96c5a0ca'));

const host_addr = window.location.protocol + '//' + window.location.hostname;

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {

            userName: '',
            movingTouch_X : -1,
            startTouch_X : -1, endTouch_X : -1,
            userSocketId : '',

            movingTouch_direction : null,
            swipeNoti_pageRealname: '',

            accessPlatform: '',
            accessPlatform_displayStatus: '',
            alertModal_cookieCheckStatus: false,

            appWidth: window.innerWidth,
            app_pc_version_displayStatus: 'none',
        };
        //location.href= this.state.pageStack[0];


        let LoginStatus = ( Cookie.get_cookie('AccessToken') ) ? true : false;
        if(LoginStatus) {
            let auth_data = { 'token': Cookie.get_cookie("AccessToken"), 'userName': Cookie.get_cookie("UserName") };
            //console.log('Ready to start Token-Auth work....');
            Fetch.fetch_api('token/auth', 'POST', auth_data)
                .then(res => {
                    let result_message = res.toString().trim();
                    if(result_message.indexOf('Error') !== -1 ){
                        this.props.alertModalOpen('(!) 서버 에러 발생', window.innerHeight);
                        Sleep.sleep_func(2000).then(() => this.props.alertModalClose());
                        return;
                    }
                    if(res['auth_result'] === 'grant'){
                        this.setState({userName: Cookie.get_cookie('UserName')})
                    }
                });
        }
        this.AppTouchStart = this.AppTouchStart.bind(this);
        this.AppTouchEnd = this.AppTouchEnd.bind(this);
        this.AppTouchMove = this.AppTouchMove.bind(this);
        this.accessPlatform_modalClose = this.accessPlatform_modalClose.bind(this);
        this.alertModal_cookieBtnClick = this.alertModal_cookieBtnClick.bind(this);
        this.windowResize = this.windowResize.bind(this);
    }

    windowResize(){ this.setState({appWidth: window.innerWidth}); }


    accessPlatform_modalClose() {
        let cookieBtn_checkStatus = this.state.alertModal_cookieCheckStatus;
        if(cookieBtn_checkStatus){
            Cookie.set_cookie("platform_alertModal", true, 3);
        }
        this.setState({accessPlatform_displayStatus: ''});
        this.props.maskClose();
        document.body.style.overflow = 'auto';
    }

    alertModal_cookieBtnClick(e){
      let checkStatus =  e.target.checked;
      if(checkStatus){
          this.setState({alertModal_cookieCheckStatus: true});
      }
      else{
          this.setState({alertModal_cookieCheckStatus: false})
      }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.accessPlatform !== this.state.accessPlatform){
            if(this.state.accessPlatform === 'pc'){
                if( Cookie.get_cookie("platform_alertModal") ) {return;}
                else{
                    this.props.maskOpen();
                    document.body.style.overflow = 'hidden';
                }
            }
        }

    }

    componentDidMount() {
        let platformFilter = "win16|win32|win64|mac";
        let accessPlatform = navigator.platform;
        if(platformFilter.indexOf(accessPlatform.toLowerCase()) == -1) {
            this.setState({accessPlatform: 'mobile'});
        }else{
            this.setState({accessPlatform: 'pc'});
            if( Cookie.get_cookie("platform_alertModal") ){ return; }
            else{ this.setState({accessPlatform_displayStatus: 'visible'}); }
        }
    }

    AppTouchStart(e) {
        this.setState({startTouch_X : e.touches[0].clientX});
    }

    AppTouchEnd(e){
        let now_appWidth = window.innerWidth;
        let endTouch_X = this.state.movingTouch_X;
        this.setState({endTouch_X : endTouch_X});

        let userSlide_direction = ( this.state.startTouch_X - endTouch_X > 0 ) ? 'right' : 'left';
        let userSlide_result = Math.abs( this.state.startTouch_X - endTouch_X );
        let prevChange_path = window.location.pathname;

        if( userSlide_result > ( now_appWidth / 3 ) && this.state.movingTouch_X !== -1 ) {
            let now_PageStackArray = ( localStorage.getItem("PageStack") )
                                    ? localStorage.getItem("PageStack").split(',') : ['/', '/settle', '/history', '/account'];

            if(userSlide_direction === 'right') {
                let shiftElem = now_PageStackArray.shift(); now_PageStackArray.push(shiftElem);
                let afterChange_path = now_PageStackArray[0];
                this.props.rightSwipe(afterChange_path);
            }
            else if(userSlide_direction === 'left'){
                let popElem = now_PageStackArray.pop(); now_PageStackArray.unshift(popElem);
                let afterChange_path = now_PageStackArray[0];
                this.props.leftSwipe(afterChange_path);
            }
        }
        this.setState({movingTouch_X : -1, startTouch_X : -1, endTouch_X : -1,});
        this.setState({movingTouch_direction: null});
    }

    AppTouchMove(e){

        let now_path = window.location.pathname;
        if(
            now_path.toString().indexOf('settleResult') == -1
            && now_path.toString().indexOf('settleEdit') == -1
            && ( Cookie.get_cookie("mac_slider_Scrolling") == 'false' || !Cookie.get_cookie("mac_slider_Scrolling") )
          )
        {
            let movingTouch_x = e.touches[0].clientX;
            this.setState({movingTouch_X : movingTouch_x});

            let now_PageStackArray = ( localStorage.getItem("PageStack") )
                ? localStorage.getItem("PageStack").split(',') : ['/', '/settle', '/history', '/account'];
            //let pageRealName_Array = ['홈', '정산하기', '히스토리', '계좌관리'];
                let movingTouch_direction = ( this.state.startTouch_X > movingTouch_x ) ? 'left' : 'right';
            if( Math.abs( this.state.startTouch_X - movingTouch_x ) > ( window.innerWidth / 4 ) ) {
                //console.log('Ready to visible slide noti layout', '\ndirection : ',movingTouch_direction);
                //* 현재 터치 방향이 왼쪽일 경우 ---> 오른쪽 방향의 페이지로 넘어감
                this.setState({ movingTouch_direction: movingTouch_direction });
                let Page_pathname = '';
                if( movingTouch_direction === 'left' ){
                    //* Right-side-noti visible, next-page pathname
                    Page_pathname = now_PageStackArray[1];
                }
                if( movingTouch_direction === 'right' ){
                    //* Left-side-noti visible, prev-page pathname
                    Page_pathname = now_PageStackArray[now_PageStackArray.length - 1];
                }

                switch (Page_pathname) {
                    case "/":
                        this.setState({swipeNoti_pageRealname: "홈"});
                        return;
                    case "/settle":
                        this.setState({swipeNoti_pageRealname: "정산하기"});
                        return;
                    case "/history":
                        this.setState({swipeNoti_pageRealname: "히스토리"});
                        return;
                    case "/account":
                        this.setState({swipeNoti_pageRealname: "계좌관리"});
                        return;
                    default:
                        return false;
                }

            }
        }
    }

    render() {
        let sliderNotiLayout_style = {height: window.innerHeight+pageYOffset,
                                      display: (this.state.movingTouch_direction) ? 'block' : 'none'};
        let sliderNotiImg_style = {top: ( window.innerHeight+pageYOffset ) / 2 - 10 };
        let sliderNotiPathname_style = {top: ( window.innerHeight+pageYOffset ) / 2 + 5};
        let AccessPlatform_alertModal_style = {display: (this.state.accessPlatform_displayStatus === 'visible') ? 'block' : 'none', top: ( window.innerHeight - 300 ) / 2 };

        window.addEventListener('resize', this.windowResize);
        let App_pc_version_style = {display:  ( this.state.appWidth > 600 ) ? 'block' : 'none' };
        return (
            <Router>

                <div id="App_pc_version_layout" style={App_pc_version_style}>
                    <div class="pcversion_mainText">
                        <img src="/img/AppLogo2-neon.png"/><font className="bold">모두의 정산</font> 서비스는 모바일 사이즈에 최적화되어있습니다.
                    </div>
                    <div className="pcversion_subText">
                        <font className="bold">* </font>모바일로 접속 혹은, 현재 브라우저의 크기(600px 이하)를 줄여주세요.
                    </div>
                    <div className="pcversion_nowWidth">현재 {this.state.appWidth + 'px'}</div>
                </div>
                <div id="AppLayout"
                     onTouchStart={this.AppTouchStart}
                     onTouchEnd={this.AppTouchEnd}
                     onTouchMove={this.AppTouchMove}
                >
                    <div id="AppSlideDirectionNoti_layout" style={sliderNotiLayout_style}
                         className={
                                (this.state.movingTouch_direction === 'left')
                                    ? 'go-right-page'
                                    : 'go-left-page'
                         }
                    >
                        <img src={
                            (this.state.movingTouch_direction === 'left')
                                ? '/img/slide-direction-noti-right.png'
                                : '/img/slide-direction-noti-left.png'
                            }
                             style={sliderNotiImg_style}
                        />
                        <div id="SliderNoti_pathRealname" style={sliderNotiPathname_style}>
                            {this.state.swipeNoti_pageRealname}
                        </div>
                    </div>

                    <div id="AccessPlatform_alertModal" style={AccessPlatform_alertModal_style}>
                        <img src="/img/mobileIcon.png"/>
                        <div className="mainText">모바일에 최적화된 서비스 입니다.</div>
                        <div className="subText"><font className="bold">* </font> 원활한 사용을 위해, 모바일로 접속해주세요.</div>
                        <div className="cookieBtnLayout">
                        <label htmlFor="alertModal_cookieBtn">3일 동안 다시 보지 않기</label><input onChange={this.alertModal_cookieBtnClick} type="checkbox" id="alertModal_cookieBtn" />
                        </div>
                        <div className="confirmBtn"
                             onClick={this.accessPlatform_modalClose}>
                            확인</div>
                    </div>

                    <PageStack/>
                    <Header
                        LoginUserName={this.state.userName}
                    />
                        <br/><br/><br/>
                        <Switch>
                            <Route exact={true} path="/" render={()=> <Home userName={this.state.userName} />} />
                            <Route exact={true} path="/settle" component={Settle}/>
                            <Route exact={true} path="/settleEdit/:id" component={SettleEdit} />
                            <Route exact={true} path="/history" component={History} />
                            <Route exact={true} path="/account" component={Account} />
                            <Route exact={true} path="/mypage" component={Mypage} />
                            <Route exact={true} path="/login" component={LoginModal}/>
                            <Route exact={true} path="/join" component={JoinModal}/>
                            <Route exact={true} path="/settleResult/:id" component={SettleResultPage}/>
                        </Switch>
                    <SettleDetailModal/>
                    <CommonModal/>
                    <AlertModal/>
                    <Mask/>

            </div>
            </Router>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        leftSwipe: (nowPage) => dispatch(left_swipe(nowPage)),
        rightSwipe: (nowPage) => dispatch(right_swipe(nowPage)),
        alertModalOpen: (text, position) => dispatch(modal_open(text, position)),
        alertModalClose: () => dispatch(modal_close()),
        maskOpen: () => dispatch(mask_open()),
        maskClose: () => dispatch(mask_close()),
    }
};

App = connect(undefined, mapDispatchToProps)(App);

App.defaultProps = {
    app_nowWidth: window.innerWidth,
};

export default React.memo(App);

