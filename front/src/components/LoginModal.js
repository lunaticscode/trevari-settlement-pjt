import React from 'react';
import "../styles/LoginModal.scss";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { modal_open, modal_close } from '../actions';
import Sleep from "../Sleep";
import Fetch from "../Fetch";
import crypto from "../CryptoInfo";
import Cookie from "../Cookie";

class LoginModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            LoginEmail : '', LoginPw : '',
            LoginEmail_flag : 'init',
            LoginPassword_flag : 'init',
        };

        this.InputEmail = this.InputEmail.bind(this);
        this.InputPassword = this.InputPassword.bind(this);
        this.Login = this.Login.bind(this);
    }

    InputEmail(e){
        let regExp_email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        regExp_email.test(e.target.value) ? this.setState({LoginEmail_flag : true,}) : this.setState({LoginEmail_flag : false, });
        regExp_email.test(e.target.value) ? this.setState({LoginEmail : e.target.value, }) : this.setState({LoginEmail : '', });
    }

    InputPassword(e){
        let regExp_password = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}/;
        let pw_value = crypto.create_pw( e.target.value.toString(), this.state.LoginEmail );
        regExp_password.test(e.target.value) ? this.setState({LoginPassword_flag : true, }) : this.setState({LoginPassword_flag : false,});
        regExp_password.test(e.target.value) ? this.setState({LoginPw : pw_value, }) : this.setState({LoginPw : '',});
        console.log(this.state.LoginPw);
    }

    componentDidUpdate(prevProps, prevState) {

    }
    componentDidMount(){

    }

    Login() {
        let LoginFlag_array = [this.state.LoginEmail_flag, this.state.LoginPassword_flag];
        //console.log(LoginFlag_array);
        let revoke_title_array = ['이메일', '비밀번호'],  Alert_text = '';
        let LoginFlag = LoginFlag_array.some((elem, index) => {
            Alert_text = '(!) ' + revoke_title_array[index] + '(을)를 다시 확인해주세요.';
            return elem === false || elem === 'init';
        });

        //* 로그인 [ 이메일 , 비밀번호 ] 정규식 통과 후, 로그인 API 접근.
        let revoke_index = null;
        if(LoginFlag === false) {
            Alert_text = '';

            let LoginData = {email :this.state.LoginEmail, password: this.state.LoginPw};
            Fetch.fetch_api('users/login', 'POST',  LoginData)
                .then(res=> {
                    //console.log(res);
                    if(res.toString().trim().indexOf('Error') !== -1 ){
                        let AlertText = '(!) 서버에 오류가 발생했습니다.<br/>관리자에게 문의해주세요.';
                        let topPosition = window.innerHeight;
                        this.props.modalOpen( AlertText, ( topPosition-30 ) );
                        Sleep.sleep_func(1000).then(()=> this.props.modalClose());
                        console.log( '(!) SERVER Error ');
                        return;
                    }
                    if(res['sign'] ==='grant') {
                        this.receiveToken(res);
                    }
                    else{
                        let revoke_message = res['message'];
                        revoke_index = res['revoke_index'];
                        this.props.modalOpen(revoke_message, (window.innerHeight -30));
                        Sleep.sleep_func(1000).then(()=> this.props.modalClose());
                    }
                })
                .then(() => {
                    if(revoke_index === 'email'){ this.setState({LoginEmail : '', LoginEmail_flag : false,}); }
                    else if(revoke_index === 'password') {
                        this.setState({LoginPw: '', LoginPassword_flag: false,});
                    }
                });
        }
        else{
            this.props.modalOpen(Alert_text, (window.innerHeight - 30) );
            Sleep.sleep_func(1000).then(()=> this.props.modalClose());
        }

    }

    //* 로그인 성공 후, JWT 쿠키 저장 이벤트.
    receiveToken(api_result) {
        console.log('** Success to receive JWT-Token from Login API **');
        //console.log(api_result, api_result['token']);
        let user_name = api_result['UserName'], user_email = api_result['UserEmail'];
        let user_token = api_result['token'];
        Cookie.set_cookie("UserName", user_name, 30);
        Cookie.set_cookie("AccessToken", user_token, 30);
        location.href='/';

    }


    render() {
        let InputEmail_style = {
            borderBottom: (this.state.LoginEmail_flag === 'init') ? "2px solid silver"
                                                    : (this.state.LoginEmail_flag) ? "2px solid rgb(70,236,231)"
                                                        : "2px solid rgb(255, 124, 140)",
        };
        let InputPassword_style = {
            borderBottom: (this.state.LoginPassword_flag === 'init') ? "2px solid silver"
                                                    : (this.state.LoginPassword_flag) ? "2px solid rgb(70,236,231)"
                                                        : "2px solid rgb(255, 124, 140)",
        };

        return (
            <div id="LoginModalLayout">
                <div id="LoginModalContent">

                    <div id="loginContent">
                        <div id="title">로그인</div>
                        <br/>
                        <input className="LoginInput" onChange={this.InputEmail} placeholder="Email" style={InputEmail_style} id="input_Email"/>
                        <input className="LoginInput" onChange={this.InputPassword} placeholder="Password" style={InputPassword_style} type="password" id="input_PW"/>
                    </div>
                    <div id="findPassword">
                        <font className="bold">*</font>아이디 / 비밀번호를 잊어버리셨나요?
                    </div>
                    <br/><br/><br/><br/>

                    <div id="actionBtnLayout">
                        <Link to="/join">
                            <div className="actionBtn" id="joinBtn">회원가입</div>
                        </Link>
                        <div className="actionBtn" id="loginBtn" onClick={this.Login}>로그인</div>

                    </div>
                </div>
            </div>
        );
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        modalOpen: (text, topPosition) => dispatch(modal_open(text, topPosition)),
        modalClose: () => dispatch(modal_close())
    }
}


LoginModal = connect(undefined, mapDispatchToProps)(LoginModal);

export default LoginModal;