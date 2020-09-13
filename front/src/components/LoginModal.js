import React from 'react';
import "../styles/LoginModal.scss";
import { Link } from 'react-router-dom';

export default class LoginModal extends React.Component {
    render() {
        return (
            <div id="LoginModalLayout">
                <div id="LoginModalContent">
                    <div id="loginContent">
                        <div id="title">로그인</div>
                        <br/>
                        <input className="LoginInput" placeholder="Email" id="input_Email"/>
                        <input className="LoginInput" placeholder="Password" type="password" id="input_PW"/>
                    </div>
                    <br/><br/><br/>
                    <div id="actionBtnLayout">
                        <Link to="/join">
                            <div className="actionBtn" id="joinBtn">회원가입</div>
                        </Link>
                        <div className="actionBtn" id="loginBtn">로그인</div>

                    </div>
                </div>

            </div>
        );
    }
}
