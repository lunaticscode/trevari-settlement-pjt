import React from 'react';
import Fetch from "../Fetch";
import Cookie from "../Cookie";
import "../styles/Mypage.scss";
class Mypage extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            userName: '',
            userEmail: '',
        };

        let auth_data = { 'token': Cookie.get_cookie("AccessToken"), 'userName': Cookie.get_cookie("UserName") };
        let LoginStatus = ( Cookie.get_cookie('AccessToken') ) ? true : false;

        if(!LoginStatus) { location.href = '/'; return; }

        if(LoginStatus) {
            console.log('Ready to start Token-Auth work....');
            Fetch.fetch_api('token/auth', 'POST', auth_data)
                .then(res => {
                    if( res.toString().trim().indexOf('Error') !== -1 ){
                        console.log('(!) 서버 에러 발생');
                        location.href = '/';
                        return;
                    }
                    if( res['auth_result'] === 'grant' ){
                        this.setState({userName: Cookie.get_cookie('UserName')});
                        this.setState({userEmail: res['user_email']});
                    }
                    else if( res['auth_result'] === 'revoke' ){
                        this.setState({userName: '', userEmail: ''});
                    }
                });
        }

        this.PasswordChange = this.PasswordChange.bind(this);
        this.Logout = this.Logout.bind(this);
    }

    Logout() {
       Cookie.delete_cookie('AccessToken');
       Cookie.delete_cookie('saved_historyDetailPageIndex');
       Cookie.delete_cookie('UserName');
       location.href = '/';
    }
    PasswordChange(){

    }

    componentDidMount() {
        console.log('mypage component did mount');
        let mypageBtn_elem = document.getElementById("ActionBtn");
        mypageBtn_elem.style.borderColor = "rgb(70, 236, 231)";
        mypageBtn_elem.style.color = "rgb(70, 236, 231)";
        mypageBtn_elem.style.boxShadow = "0px 0px 3px rgb(70, 236, 231)";

        //* 이전페이지에서 클릭되어진 탭 메뉴(폰트, 보더라인) 색상 gray로 변환.
        let clickedTab_elem = document.getElementsByClassName("tabMenu clicked")[0];
        clickedTab_elem.classList.add("off");
    }

    componentWillUnmount(){
        console.log('mypage component unmounted');
        let mypageBtn_elem = document.getElementById("ActionBtn");
        mypageBtn_elem.style.border = "2px solid silver";
        mypageBtn_elem.style.color = "silver";
        mypageBtn_elem.style.boxShadow = "none";

        //* 이전페이지에서 클릭되어진 탭 메뉴(폰트, 보더라인) 색상 다시 원래대로 반환.
        let clickedTab_elem = document.getElementsByClassName("tabMenu clicked")[0];
        clickedTab_elem.classList.remove("off");
    }

    render() {
        let MypageLayout_style = {
            height: window.innerHeight,
        };
        return (
            <div id="Mypage_layout" style={MypageLayout_style}>
                <div id="MypageContent_layout">
                    <div id="userInfo_layout">
                        <div id="userName">{this.state.userName}</div>
                        <div id="userEmail">{this.state.userEmail}</div>
                        <div id="Logout_btn" className="ActionBtn" onClick={this.Logout}>로그아웃</div>
                        <div id="passwordChange_btn" className="ActionBtn" onClick={this.PasswordChange}>비밀번호 변경</div>
                    </div>
                </div>
            </div>
        );
    }
}



export default Mypage;