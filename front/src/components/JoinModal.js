import React from 'react';
import "../styles/JoinModal.scss";
import crypto from '../CryptoInfo';
export default class JoinModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            joinFlagArray : new Array(4).fill(false),
        };

        this.inputJoinEmail = this.inputJoinEmail.bind(this);
        this.inputJoinNickName = this.inputJoinNickName.bind(this);
        this.inputJoinPassword = this.inputJoinPassword.bind(this);
        this.inputJoinPasswordConfirm = this.inputJoinPasswordConfirm.bind(this);
    }

    inputJoinEmail(e){
        let inputEmail_flag = false;
        if(e.target.value.toString().length == 0){
            e.target.style.borderBottom = "2px solid silver";
            inputEmail_flag = false;
        }else{
            let regExp_email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
            regExp_email.test(e.target.value) ? inputEmail_flag = true : inputEmail_flag = false;
        }
        ( inputEmail_flag ) ? this.state.joinFlagArray[0] = true : this.state.joinFlagArray[0] = false;
        ( inputEmail_flag ) ? e.target.style.borderBottom = "2px solid rgb(70,236,231)" : e.target.style.borderBottom = "2px solid rgb(255, 124, 140)";
    }

    inputJoinNickName(e){
        let inputNickname_flag = false;
        if(e.target.value.toString().length == 0) {
            e.target.style.borderBottom = "2px solid silver";
            inputNickname_flag = false;
        }else if(e.target.value.toString().length > 4){
            inputNickname_flag = true;
        }
        ( inputNickname_flag ) ? this.state.joinFlagArray[1] = true : this.state.joinFlagArray[1] = false;
        ( inputNickname_flag ) ? e.target.style.borderBottom = "2px solid rgb(70,236,231)" : e.target.style.borderBottom = "2px solid rgb(255, 124, 140)";
        console.log(this.state.joinFlagArray);
    }

    inputJoinPassword(e){
        let inputPassword_flag = false;
        if(e.target.value.toString() > 0){
            e.target.style.borderBottom = "2px solid silver";
            inputPassword_flag = false;
        }
        else{
            let regExp_password = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}/;
            regExp_password.test(e.target.value) ? inputPassword_flag = true : inputPassword_flag = false;
        }
        ( inputPassword_flag ) ? this.state.joinFlagArray[2] = true : this.state.joinFlagArray[2] = false;
        ( inputPassword_flag ) ? e.target.style.borderBottom = "2px solid rgb(70,236,231)" : e.target.style.borderBottom = "2px solid rgb(255, 124, 140)";

    }
    inputJoinPasswordConfirm(e) {
        let inputPwConfirm_flag = false;
        if(e.target.value.toString() > 0) {
            e.target.style.borderBottom = "2px solid silver";
            inputPwConfirm_flag = false;
        }else{

            // *---------------------- crypto pbkdf2 적용 후에 비밀번호 확인 값 비교. ----------------------------- *

        }
    }


    render() {
        return (
            <div id="JoinModalLayout">
                <div id="JoinModalContent">
                    <div id="title">회원가입</div>
                    <br/>
                    <input className="JoinInput" onChange={this.inputJoinEmail} placeholder="이메일" id="input_Email"/>
                    <input className="JoinInput" onChange={this.inputJoinNickName} placeholder="닉네임" id="input_Nickname"/>
                    <input className="JoinInput" onChange={this.inputJoinPassword} placeholder="비밀번호" type="password" id="input_PW"/>
                    <input className="JoinInput" onChange={this.inputJoinPasswordConfirm} placeholder="비밀번호 확인" type="password" id="input_PW"/>
                </div>
                <div id="registBtn">REGIST</div>
            </div>
        );
    }
}
