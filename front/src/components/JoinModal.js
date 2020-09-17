import React from 'react';
import "../styles/JoinModal.scss";
import crypto from '../CryptoInfo';
import Fetch from "../Fetch";

export default class JoinModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            joinFlagArray : new Array(4).fill(false),
            joinEmail : '', joinNickname: '', joinPw: '',
            joinStatus : -1,
            JoinNextStepBtn_color : 'silver',
        };

        this.inputJoinEmail = this.inputJoinEmail.bind(this);
        this.inputJoinNickName = this.inputJoinNickName.bind(this);
        this.inputJoinPassword = this.inputJoinPassword.bind(this);
        this.inputJoinPasswordConfirm = this.inputJoinPasswordConfirm.bind(this);
        this.regist = this.regist.bind(this);
        this.JoinNextStep = this.JoinNextStep.bind(this);
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
        ( inputEmail_flag ) ? this.setState({joinEmail: e.target.value}) : this.setState({joinEmail: ''});
        ( inputEmail_flag ) ? this.state.JoinNextStepBtn_color = '' : this.state.JoinNextStepBtn_color = 'silver';
        this.state.joinFlagArray[3] = false;
        document.getElementById("input_PwConfirm").value = '';
        document.getElementById("input_PwConfirm").style.borderBottomColor = "silver";
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
        ( inputNickname_flag ) ? this.setState({joinNickname: e.target.value}) : this.setState({joinNickname : ''});
        ( inputNickname_flag ) ? this.state.JoinNextStepBtn_color = '' : this.state.JoinNextStepBtn_color = 'silver';
        // console.log(this.state.joinFlagArray);
    }

    inputJoinPassword(e){
        let inputPassword_flag = false;
        if(e.target.value.toString().length == 0){
            e.target.style.borderBottom = "2px solid silver";
            inputPassword_flag = false;
        }
        else{
            let regExp_password = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}/;
            regExp_password.test(e.target.value) ? inputPassword_flag = true : inputPassword_flag = false;
        }
        ( inputPassword_flag ) ? this.state.joinFlagArray[2] = true : this.state.joinFlagArray[2] = false;
        ( inputPassword_flag ) ? e.target.style.borderBottom = "2px solid rgb(70,236,231)" : e.target.style.borderBottom = "2px solid rgb(255, 124, 140)";

        document.getElementById("input_PwConfirm").value = '';
        document.getElementById("input_PwConfirm").style.borderBottomColor = "silver";
        this.state.joinFlagArray[3] = false;
    }

    inputJoinPasswordConfirm(e) {
        let inputPwConfirm_flag = false;
        let pw_confirm_value = '';
        if( e.target.value.toString().length === 0 ) {
            e.target.style.borderBottom = "2px solid silver";
            inputPwConfirm_flag = false;
        }else{
              pw_confirm_value = crypto.create_pw(e.target.value, this.state.joinEmail);
              let pw_value = crypto.create_pw( document.getElementById("input_Pw").value.toString(), this.state.joinEmail );
            ( pw_confirm_value === pw_value ) ? inputPwConfirm_flag = true :  inputPwConfirm_flag = false;
            ( pw_confirm_value === pw_value ) ? this.setState({JoinNextStepBtn_color : ''}) : this.setState({JoinNextStepBtn_color: 'silver'});
        }

        ( inputPwConfirm_flag ) ? this.state.joinFlagArray[3] = true : this.state.joinFlagArray[3] = false;
        ( inputPwConfirm_flag ) ? this.state.joinPw = pw_confirm_value : this.state.joinPw = '';
        ( inputPwConfirm_flag ) ? e.target.style.borderBottom = "2px solid rgb(70,236,231)" : e.target.style.borderBottom = "2px solid rgb(255, 124, 140)";

    }


    JoinNextStep() {
        if(this.state.joinStatus === 1){
            let final_flag = this.state.joinFlagArray.every(elem => elem === true);
            ( final_flag ) ? console.log('go regist function....') : console.log('revoke');
            return;
        }
        let now_joinStep = this.state.joinStatus + 1;
        let joinFlagArray = this.state.joinFlagArray;
        let joinTitleArray = ['Email', 'Nickname', 'Pw', 'PwConfirm'];

        if(joinFlagArray[now_joinStep] ) {

             //* 비밀번호 제외한, [이메일], [닉네임] 중복 체크 진행.
             if(now_joinStep == 0 || now_joinStep == 1) {

                 let api_dir = (now_joinStep === 0) ? "email" : "name";
                 let post_data = (now_joinStep === 0) ? {email: this.state.joinEmail} : {name: this.state.joinNickname};

                 let check_result = Fetch.fetch_api('users/check/'+api_dir, 'POST', post_data );
                 check_result.then(res=> {
                     console.log(res);
                     //* API 서버 off 상태일 경우, 서버 에러 Modal 오픈.
                     if(res.toString().trim().indexOf('Error') !== -1 ){ console.log( '(!) SERVER Error '); return; }

                     if(res['sign'] === 'grant') { this.setState({joinStatus : now_joinStep, JoinNextStepBtn_color:'silver'}); }
                     else{
                         //* 중복일 경우,
                         console.log('revoke => Alert Modal open...');
                         ( api_dir === 'email' ) ? this.setState({joinEmail : ''}) : this.setState({joinNickname : ''});
                        this.setState({JoinNextStepBtn_color:'silver'});
                        document.getElementById("input_"+joinTitleArray[now_joinStep]).style.borderBottomColor = 'rgb(255, 124, 140)';
                        document.getElementById("input_"+joinTitleArray[now_joinStep]).value ='';
                     }
                 });
             }
             else{
                 //* 비밀번호, 비밀번호 확인 진행.
             }

        }

        else{

        }
    }


    regist() {
        let joinIndexArray = ['이메일', '닉네임', '비밀번호', '비밀번호 확인'];
        let revokeIndex_title = -1;
        let joinRevokeFlag = this.state.joinFlagArray.some( (elem, index) => {
            if(elem === false) { revokeIndex_title = joinIndexArray[index]; }
            return elem === false;
        });

        let D = new Date();
        let now_YmdHis = D.getFullYear()+''+(D.getMonth() + 1 )+''+ D.getDate()+''+ D.getHours()+''+D.getMinutes()+''+ D.getSeconds() ;

        //* 회원가입 input 정규식 모두 통과했을 경우,
        if( joinRevokeFlag === false) {
            let userInfoObj = {
                email: this.state.joinEmail, name: this.state.joinNickname, password: this.state.joinPw,
                regdate: now_YmdHis,
            };
            //console.log(userInfoObj);

            let revoke_index = '';
            let joinReq_result = Fetch.fetch_api('users/', 'POST', userInfoObj) ;
            joinReq_result.then( res => {
                console.log(res);

                //* API 서버 off 상태일 경우, 서버 에러 Modal 오픈.
                if(res.toString().trim().indexOf('Error') !== -1 ){
                    console.log( '(!) SERVER Error '); return;
                }

                //* 이메일 or 닉네임 중, DB에 중복된 값이 있는 경우,
                if(res['message'] !== 'success') {
                    revoke_index = res['dupleKey'];
                }

                //* 회원가입 완료.
                else{
                    console.log(' * Success to User Join. * ');
                }
            });
        }

        //* 하나라도 통과 못했을 경우, 해당 input 작성 기입 유도 ---> Modal 오픈.
        else {
            console.log( revokeIndex_title + " 칸을 다시 확인해주세요.");
        }
    }

    componentDidUpdate(prevProps, prevStatus) {

        let joinContentlayout = document.getElementById("JoinModalContent");
        if(prevStatus.joinStatus !== this.state.joinStatus) {
                if(prevStatus.joinStatus < this.state.joinStatus){
                joinContentlayout.classList.add('slide-left');
                setTimeout(function() { joinContentlayout.classList.remove('slide-left');}, 1000);
            }
            else if(prevStatus.joinStatus > this.state.joinStatus){
                joinContentlayout.classList.add('slide-right');
                setTimeout(function() { joinContentlayout.classList.remove('slide-right'); }, 1000);
            }

            if(this.state.joinStatus === -1 && prevStatus.joinStatus !== null) {
                setTimeout(function() {
                    document.getElementById("main_ment").innerHTML = "회원가입을 위한<br/>이메일을 작성해주세요.";
                    document.getElementById("sub_ment").innerHTML = "<font class='Emphasis'>*</font> 유효하지 않은 형식은 등록이 불가능합니다.";
                }, 1000);
            }
            if(this.state.joinStatus === 0) {
                setTimeout(function() {
                    document.getElementById("main_ment").innerHTML = "사용할 닉네임을<br/>작성해주세요.";
                    document.getElementById("sub_ment").innerHTML = "<font class='Emphasis'>*</font> 최소 5자 이상이어야 합니다.";
                }, 1000);
            }
            if(this.state.joinStatus === 1) {
                setTimeout(function() {
                    document.getElementById("main_ment").innerHTML = "사용할 비밀번호를<br/>입력해주세요.";
                    document.getElementById("sub_ment").innerHTML = "<font class='Emphasis'>*</font> 영문,숫자,특수기호 하나를 포함한 8~16자입니다.";
                }, 1000);
            }

            for(var i = 0; i<this.state.joinStatus+1; i++){
                document.getElementsByClassName("ProgressBar")[i].style.background = 'linear-gradient(90deg, rgba(142,240,244,1) 0%, rgba(35,195,224,1) 100%)';
                document.getElementsByClassName("ProgressBar")[i].style.opacity = '0.9';
            }

        }

        let JoinInputElems = document.getElementsByClassName("JoinInput");

        if(this.state.joinStatus === -1 || this.state.joinStatus === 0 ){
            for(var i = 0; i<JoinInputElems.length; i++){
                if( i == (this.state.joinStatus+1) ){ JoinInputElems[i].style.display = 'block'; }
                else{ JoinInputElems[i].style.display = 'none'; }
            }
        }else{
            for(var i = 0; i<JoinInputElems.length; i++){
                if( i == 2 || i == 3 ){ JoinInputElems[i].style.display = 'block'; }
                else{ JoinInputElems[i].style.display = 'none'; }
            }
        }

    }

    componentDidMount() {
        console.log("Init - joinStatus : ",this.state.joinStatus);
        let JoinInputElems = document.getElementsByClassName("JoinInput");
        for(var i = 0; i<JoinInputElems.length; i++){
            if(i !== 0 && this.state.joinStatus == -1 ) { JoinInputElems[i].style.display = 'none';}
        }
        //JJoinGuide_layoutoinModalLayout
        //JoinModalLayout
        //
        // <div id="registBtn" onClick={this.regist}>REGIST</div>
    }

    render() {
        let nextStepBtn_style = {background: this.state.JoinNextStepBtn_color, };
        let tmpJoinLayout = {height: window.innerHeight+'px', };
        return (
            <div id="" style={tmpJoinLayout}>
                <br/>
                <div id="JoinProgressStatus_layout">
                    <div className="ProgressBar"></div>
                    <div className="ProgressBar"></div>
                    <div className="ProgressBar"></div>
                </div>
                <div id="JoinModalContent">
                    <div id="title"></div>
                    <div id="JoinGuide_layout">
                        <div id="main_ment">회원가입을 위한<br/>이메일을 작성해주세요.</div>
                        <div id="sub_ment"><font className="Emphasis">*</font> 유효하지 않은 형식은 등록이 불가능합니다.</div>
                    </div>
                    <input className="JoinInput" onChange={this.inputJoinEmail} placeholder="ex) modu@settle.com" id="input_Email"/>
                    <input className="JoinInput" onChange={this.inputJoinNickName} placeholder="ex) humanwater93" id="input_Nickname"/>
                    <input className="JoinInput" onChange={this.inputJoinPassword} placeholder="비밀번호" type="password" id="input_Pw"/>
                    <input className="JoinInput" onChange={this.inputJoinPasswordConfirm} placeholder="비밀번호 확인" type="password" id="input_PwConfirm"/>
                </div>

                <div id="JoinNextStep_btn" style={nextStepBtn_style} onClick={this.JoinNextStep}>확인</div>

            </div>
        );
    }
}
