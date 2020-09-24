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

        let auth_data = { 'token': Cookie.get_cookie("AccessToken"), 'userName': Cookie.get_cookie("UserName") };
        let LoginStatus = ( Cookie.get_cookie('AccessToken') ) ? true : false;
        if(LoginStatus) {
            //console.log('Ready to start Token-Auth work....');

            Fetch.fetch_api('token/auth', 'POST', auth_data)
                .then(res => {
                    if(res.toString().trim().indexOf('Error') !== -1 ){
                        console.log('(!) 서버 에러 발생');
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
        let nowPage_path = window.location.pathname;

        if( userSlide_result  >  ( now_appWidth / 3 ) && this.state.movingTouch_X !== -1 ) {
            if(userSlide_direction === 'right') {
                this.props.rightSwipe(nowPage_path);
            }
            else if(userSlide_direction === 'left'){
                this.props.leftSwipe(nowPage_path);
            }
        }
        //this.state.movingTouch_X = -1; this.state.startTouch_X = -1; this.state.endTouch_X = -1;
        this.setState({movingTouch_X : -1, startTouch_X : -1, endTouch_X : -1,});
    }

    AppTouchMove(e){ this.setState({movingTouch_X : e.touches[0].clientX}); }

    render() {

        return (
            <Router>

            <div id="AppLayout"
                 onTouchStart={this.AppTouchStart}
                 onTouchEnd={this.AppTouchEnd}
                 onTouchMove={this.AppTouchMove}
            >

                    <Header
                        LoginUserName={this.state.userName}
                    />
                        <br/><br/><br/>
                        <Switch>
                            <Route exact={true} path="/" render={()=> <Home userName={this.state.userName} />} />
                            <Route exact={true} path="/settle" component={Settle} />
                            <Route exact={true} path="/history" component={History} />
                            <Route exact={true} path="/account" component={Account} />
                            <Route exact={true} path="/mypage" component={Mypage} />
                            <Route exact={true} path="/login" component={LoginModal}/>
                            <Route exact={true} path="/join" component={JoinModal}/>
                        </Switch>

                        <AlertModal/>

            </div>
            </Router>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        leftSwipe: (nowPage) => dispatch(left_swipe(nowPage)),
        rightSwipe: (nowPage) => dispatch((right_swipe(nowPage)))
    }
};

App = connect(undefined, mapDispatchToProps)(App);

export default App;

