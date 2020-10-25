import React from 'react';
import Fetch from "../Fetch";
import Cookie from "../Cookie";
import "../styles/Mypage.scss";
import Sleep from "../Sleep";
import {mask_close, mask_open, modal_close, modal_open} from "../actions";
import {connect} from "react-redux";
import crypto from "../CryptoInfo";
class Mypage extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            userName: '',
            userEmail: '',
            passwordChangeModal_status: 'none',
            editChangePassword_value : null,
            editPassword_grantFlag: false,
            pwChangeBtn_clickFlag: false,
        };

        let auth_data = { 'token': Cookie.get_cookie("AccessToken"), 'userName': Cookie.get_cookie("UserName") };
        let LoginStatus = ( Cookie.get_cookie('UserName') && Cookie.get_cookie('AccessToken') ) ? true : false;
        if(!LoginStatus) { location.href = '/login'; return; }
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
        this.inputChangePassword= this.inputChangePassword.bind(this);
        this.changePasswordSubmit = this.changePasswordSubmit.bind(this);
        this.exitModal = this.exitModal.bind(this);
    }

    Logout() {
       Cookie.delete_cookie('AccessToken');
       Cookie.delete_cookie('saved_historyDetailPageIndex');
       Cookie.delete_cookie('UserName');
       location.href = '/';
    }

    exitModal(){
        document.getElementById("editChangePassword_input").value = '';
        this.setState({
            passwordChangeModal_status:'none', editChangePassword_value:null, editPassword_grantFlag:false,
        });
        this.props.maskClose();
        document.body.style.overflow = 'auto';
    }

    PasswordChange(){
        let userName = (Cookie.get_cookie('UserName') && Cookie.get_cookie("AccessToken")) ? Cookie.get_cookie("UserName") : null;
        if(!userName){
            let alertModal_text = '(!) 접근 권한 없음, 다시 로그인해주세요.';
            this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
            Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
            return;
        }
        else{
            this.props.maskOpen();
            this.setState({passwordChangeModal_status: 'block'})
            document.body.style.overflow = 'hidden';
        }
    }

    inputChangePassword(e){
        let inputValue = e.target.value;
        let regExp_password = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}/;
        if(  regExp_password.test(inputValue)  ) {
            this.setState({editPassword_grantFlag: true, editChangePassword_value : crypto.create_pw(inputValue, this.state.userEmail)});
        }
        else{
            this.setState({editPassword_grantFlag: false, editChangePassword_value: null});
        }
    }

    changePasswordSubmit(e){
        if( this.state.pwChangeBtn_clickFlag ) {
            return;
        }
        let grantStatus = (e.target.classList.value === 'active' && this.state.editPassword_grantFlag ) ? true : false;
        if(!grantStatus){ return; }
        else{
            let userName = (Cookie.get_cookie('UserName') && Cookie.get_cookie("AccessToken")) ? Cookie.get_cookie("UserName") : null;
            if(!userName){
                let alertModal_text = '(!) 접근 권한 없음, 다시 로그인해주세요.';
                this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
                Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
                return;
            }else{
                let submit_data = {'user_name': this.state.userName, 'change_pw' : this.state.editChangePassword_value};
                console.log(submit_data);

                this.setState({pwChangeBtn_clickFlag: true});

                //* Fetch 진행. (경로: /api/users/changepw )
                Fetch.fetch_api("users/changepw", "POST", submit_data).then(res => {
                    if( res.toString().toLowerCase().trim().indexOf('error') !== -1 ) {
                        console.log('(!) Server Error');
                        console.log(res);
                        let alertModal_text = '(!) 서버 에러, 관리자에게 문의해주세요.';
                        this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
                        Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
                        return;
                    }

                    if( res['result'].toString().trim() === 'success' ){
                        console.log('비밀번호 변경 완료');
                        console.log(res);
                    }

                    if( res['result'].toString().trim() === 'fail' ){
                        let alertModal_text = '(!) 유저 정보를 확인할 수 없습니다. 로그아웃 후 다시 진행해주세요.';
                        this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
                        Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
                        return;
                    }

                    this.setState({pwChangeBtn_clickFlag: false});
                });
            }

        }
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
        let MypageLayout_style = { height: window.innerHeight, };
        let passwordChangeModal_style = { display: this.state.passwordChangeModal_status, top: ( ( window.innerHeight - 180 ) / 2 ) + 30 };
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

                <div id="passwordChangeModal" style={passwordChangeModal_style}>
                    <img id="passwordChangeModal_closeBtn" onClick={this.exitModal} src="/img/delete_icon_white.png" />
                    <div id="passwordChangeModal_title">비밀번호 변경</div>
                    <div id="passwordChangeModal_subTitle"><font className="bold">*</font> 영문,숫자,특수기호 하나를 포함한 8~16자입니다</div>
                    <input id="editChangePassword_input"
                           type="password"
                           className={ ( this.state.editPassword_grantFlag ) ? "active" : "" }
                           onChange={this.inputChangePassword} placeholder="변경할 비밀번호 입력"/>
                    <div id="passwordChangeAction_btn"
                         onClick={this.changePasswordSubmit}
                         className={ (this.state.editPassword_grantFlag ) ? "active" : "" }>
                        비밀번호 변경
                    </div>
                </div>
            </div>
        );
    }
}


let mapDispatchToProps = (dispatch) => {
    return {
        alertModal_open: (text, topPosition) => dispatch(modal_open(text, topPosition)),
        alertModal_close: () => dispatch(modal_close()),
        maskOpen: () => dispatch(mask_open()),
        maskClose: () => dispatch(mask_close()),
    }
};

Mypage = connect(undefined, mapDispatchToProps)(Mypage);


export default Mypage;