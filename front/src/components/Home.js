import React from 'react';
import "../styles/Home.scss";
import Cookie from "../Cookie";
import Fetch from "../Fetch";
import {modal_close, modal_open} from "../actions";
import {connect} from "react-redux";
import Sleep from "../Sleep";

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
                loginFlag: false,
                login_userName: null,
                login_userAccountCnt: 0,
                login_userSettleInfoCnt: 0,
        };
    }

    loginUser_directToHistory(){ document.getElementById("tab_2").click()}
    loginUser_directToAccount() { document.getElementById("tab_3").click()}
    Settle_directBtnClick(){ document.getElementById("tab_1").click(); }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.loginFlag !== this.state.loginFlag){
            console.log('Login Status: ', this.state.loginFlag, ' / UserName: ', this.state.login_userName );
        }
    }

    componentDidMount() {
        let userName = ( Cookie.get_cookie("UserName") && Cookie.get_cookie("AccessToken") ) ? Cookie.get_cookie("UserName") : null;
        if ( userName ) {
            this.setState({loginFlag: true, login_userName : userName} );

            //* 로그인 유저, 계좌정보 API 호출.
            Fetch.fetch_api("account/"+userName, "GET", null).then(res => {
                if( res.toString().trim().indexOf('Error') !== -1 ) {
                    console.log('(!) Server Error');
                    let alertModal_text = '(!)서버 에러. 관리자에게 문의해주세요.';
                    this.props.alertModal_open(alertModal_text, window.innerHeight+window.pageYOffset);
                    Sleep.sleep_func(1000).then( () => { this.props.alertModal_close(); } );
                    return;
                }

                if( res['result'].toString().trim() === 'fail' ){
                    let alertModal_text = '(!)계좌정보를 불러올 수 없습니다. 다시 로그인해주세요.';
                    this.props.alertModal_open(alertModal_text, window.innerHeight+window.pageYOffset);
                    Sleep.sleep_func(1000).then( () => { this.props.alertModal_close(); } );
                    return;
                }

                if( res['result'].toString().trim() === 'success' ) {
                    //console.log(res['account_list']);

                    if(!res['account_list']){ this.setState({login_userAccountCnt: 0}); return; }

                    let accountList_obj = JSON.parse( res['account_list'].replace(/'/g, "\""));
                    this.setState({login_userAccountCnt: Object.keys(accountList_obj).length});
                }
            });

            //* 로그인 유저, 정산내역 정보 API 호출.
            Fetch.fetch_api("settleList", "POST", {user_name: userName}).then( res => {
                if( res.toString().trim().indexOf('Error') !== -1 ) {
                    console.log('(!) Server Error');
                    let alertModal_text = '(!)서버 에러. 관리자에게 문의해주세요.';
                    this.props.alertModal_open(alertModal_text, window.innerHeight+window.pageYOffset);
                    Sleep.sleep_func(1000).then( () => { this.props.alertModal_close(); } );
                    return;
                }

                if( res['result'].toString().trim() === 'fail' ){
                    console.log('정산정보 없음.');
                    // let alertModal_text = '(!)정산정보를 불러올 수 없습니다. 다시 로그인해주세요.';
                    // this.props.alertModal_open(alertModal_text, window.innerHeight+window.pageYOffset);
                    // Sleep.sleep_func(1000).then( () => { this.props.alertModal_close(); } );
                    return;
                }

                if( res['result'].toString().trim() === 'success' ) {
                    //console.log(res['account_list']);
                    if(!res['settleInfo_List']){ this.setState({login_userSettleInfoCnt: 0}); return; }
                    let settleInfo_list = res['settleInfo_List'];
                    this.setState({login_userSettleInfoCnt: settleInfo_list.length});
                }
            });
        }


    }

    render() {
        let HomeLayout_style = {height: window.innerHeight+'px'};
        //console.log(this.props.userName);

        let userName = this.state.login_userName;
        let nouserDirectBtn_style = {top: window.innerHeight - 65,};
        return (
            <div id="HomeLayout" style={HomeLayout_style}>
                {

                    (!userName)
                        ? <div id="Home_nouserContentLayout">
                            <div className="nouser_welcomeMent">쉽고 <font className="bold">,</font></div>
                            <div className="nouser_welcomeMent">빠르고 <font className="bold">,</font></div>
                            <div className="nouser_welcomeMent">정확하게 <font className="bold">.</font></div>
                            <div className="nouser_welcomeMent title"><img src="/img/app-logo-color.png"/> 모두의정산</div>

                                <div id="Settle_directGoBtn" onClick={this.Settle_directBtnClick} style={nouserDirectBtn_style}>
                                    정산 바로가기
                                    <img src="/img/arrow_icon.png"/>
                                </div>
                          </div>

                        :
                        <div id="Home_loginUserLayout">
                            <div id="loginuser_welcomeLayout">
                                <div id="loginuser_welcomeMent">안녕하세요<font className="bold"> ,</font></div>
                                <div id="loginuser_name">{userName}</div>
                                <div id="loginuser_infoBox_layout">
                                    <div className="loginuser_infoBox history" onClick={this. loginUser_directToHistory}>
                                        <div className="lui_title">총 정산횟수</div>
                                        <div  className="lui_value"><font className="bold">{this.state.login_userSettleInfoCnt}</font> 회</div>
                                    </div>
                                    <div className="loginuser_infoBox account" onClick={this. loginUser_directToAccount}>
                                        <div className="lui_title">등록계좌 수</div>
                                        <div className="lui_value"><font className="bold">{this.state.login_userAccountCnt}</font> / 5개</div>

                                    </div>

                                </div>

                            </div>

                            <div id="Settle_directGoBtn" onClick={this.Settle_directBtnClick} style={nouserDirectBtn_style}>
                                정산 바로가기
                                <img src="/img/arrow_icon.png"/>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

Home.defaultProps = {
    userName : null,
};


let mapDispatchToProps = (dispatch) => {
    return {
        alertModal_open: (text, topPosition) => dispatch(modal_open(text, topPosition)),
        alertModal_close: () => dispatch(modal_close())
    }
};

Home = connect(undefined, mapDispatchToProps)(Home);

export default Home;