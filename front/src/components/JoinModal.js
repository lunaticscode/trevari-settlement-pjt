import React from 'react';
import "../styles/JoinModal.scss";

export default class JoinModal extends React.Component {
    render() {
        return (
            <div id="JoinModalLayout">
                <div id="JoinModalContent">
                    <div id="title">회원가입</div>
                    <br/>
                    <input className="JoinInput" placeholder="이메일" id="input_Email"/>
                    <input className="JoinInput" placeholder="닉네임" id="input_Nickname"/>
                    <input className="JoinInput" placeholder="비밀번호" type="password" id="input_PW"/>
                    <input className="JoinInput" placeholder="비밀번호 확인" type="password" id="input_PW"/>
                </div>
                <div id="registBtn">REGIST</div>
            </div>
        );
    }
}
