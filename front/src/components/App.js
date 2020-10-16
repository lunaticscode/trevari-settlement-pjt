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
import {left_swipe, modal_close, modal_open, right_swipe} from "../actions";
import {connect} from "react-redux";
import PageStack from "./PageStack";
import SettleEdit from "./SettleEdit";
import SettleDetailModal from "./SettleDetailModal";
import Mask from "./Mask";
import CommonModal from "./CommonModal";
import Sleep from "../Sleep";
import crypto from "../CryptoInfo";
import SettleResultPage from "./SettleResultPage";

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            appWidth: window.innerWidth,
            userName: '',
            movingTouch_X : -1,
            startTouch_X : -1, endTouch_X : -1,
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
    }

    componentWillReceiveProps(props){
        console.log(props);
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentDidMount() {
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
    }

    AppTouchMove(e){

        let now_path = window.location.pathname;
        if(
            now_path.toString().indexOf('settleResult') == -1
            && now_path.toString().indexOf('settleEdit') == -1
            && ( Cookie.get_cookie("mac_slider_Scrolling") == 'false' || !Cookie.get_cookie("mac_slider_Scrolling") )
          )
        {
            this.setState({movingTouch_X : e.touches[0].clientX});
        }
    }


    render() {
        return (
            <Router>
                <div id="AppLayout"
                     onTouchStart={this.AppTouchStart}
                     onTouchEnd={this.AppTouchEnd}
                     onTouchMove={this.AppTouchMove}
                >

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
    }
};

App = connect(undefined, mapDispatchToProps)(App);

export default App;

