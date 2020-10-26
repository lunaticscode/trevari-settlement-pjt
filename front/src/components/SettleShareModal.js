import React from 'react';
import '../styles/SettleShareModal.scss';
import Cookie from "../Cookie";
import crypto from "../CryptoInfo"
import ClipboardButton from "react-clipboard.js"
import Sleep from "../Sleep";
import Fetch from "../Fetch";

class SettleShareModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //* nouser&&[ randomkey ]&&[ UTC-time ]
            linkUrl: '',
            copySuccessAlertModal_display: 'none',
        };
        this.copySuccess= this.copySuccess.bind(this);
        this.SettleShareModal_close = this.SettleShareModal_close.bind(this);
    }

    copySuccess() {
        //console.log(this.state.linkUrl);
        this.setState({copySuccessAlertModal_display: 'block'});
        Sleep.sleep_func(1000).then( () => { this.setState({ copySuccessAlertModal_display: 'none' }) });
    }

    SettleShareModal_close() {
          this.props.settleShareModal_close();
    }

    componentDidUpdate(prevProps, prevState){

        //* 마운트 후, 실제 현재 컴포넌트 레이아웃이 visible 상태일 때,
        if( prevProps.settleShareModal_displayStatus !== this.props.settleShareModal_displayStatus
            && prevProps.settleShare_Info !== this.props.settleShare_Info ) {
            //console.log('Start to save SettleInfo');
            let tmp_param = this.props.settleShareSite_key;
            let settleSite_param = crypto.encrypt_account(tmp_param);
            //console.log(settleSite_param);
            //console.log(crypto.decrypt_account(settleSite_param));

            settleSite_param = crypto.base64_enc(settleSite_param);
            let now_host_addr = window.location.protocol + '//' + window.location.hostname + ':9500/';
            this.setState({linkUrl: now_host_addr+'settleResult/'+settleSite_param});

            if(this.props.settleShare_loginFlag){
                //console.log('회원 유저, 정산정보 저정완료 모달 오픈');

            }
            //* 비회원 유저 정산정보 저장 api 호출
            else{
                //console.log('비회원 유저, 정산정보 저장 api 호출 준비');
                let settleResultSite_param = this.props.settleShareSite_key;
                let settleInfo = this.props.settleShare_Info;
                //console.log(settleInfo);

                let nouserSettle_key = settleResultSite_param;
                let submitData = {
                    nsi_owner_key: nouserSettle_key,
                    nsi_regdate: settleInfo['si_regdate'],
                    nsi_title: settleInfo['si_title'],
                    nsi_form_info: settleInfo['si_form_info'],
                    nsi_account: settleInfo['si_account'],
                    nsi_bankcode: settleInfo['si_bankcode'],
                };

                Fetch.fetch_api("nousersettle", 'POST', submitData).then( res =>{
                        console.log(res);
                        if(res.toString().trim().indexOf('Error') !== -1){
                            console.log("(!) Server error ");
                        }
                        if(res['result'] === 'success'){
                            console.log(res);
                        }
                        else{
                            console.log(res);
                        }
                });

            }
            this.kakaoLinkCreate(now_host_addr+'settleResult/'+settleSite_param);
        }
        if(prevProps.settleShare_loginFlag !== this.props.settleShare_loginFlag && Cookie.get_cookie('UserName') ) {
            //console.log('회원 유저 정산정보 저장 완료 모달 오픈');
            let tmp_param = this.props.settleShareSite_key;
            let settleSite_param = crypto.encrypt_account(tmp_param);
            // console.log(settleSite_param);
            // console.log(crypto.decrypt_account(settleSite_param));

            settleSite_param = crypto.base64_enc(settleSite_param);
            let now_host_addr = window.location.protocol + '//' + window.location.hostname + ':9500/';
            this.setState({linkUrl: now_host_addr+'settleResult/'+settleSite_param});
            this.kakaoLinkCreate(now_host_addr+'settleResult/'+settleSite_param);
        }

        // console.log('param url ',this.state.linkUrl);
    }

    kakaoLinkCreate(link_value) {
        //console.log(link_value);
        console.log('ready to start kakao-link create ');
        //* Kakao.init() 중복 초기화 오류 방지.
        if(!window.Kakao.isInitialized()){
            window.Kakao.init('43b8c6cdeb67e860c94b30ba2385b42c');
        }
        window.Kakao.Link.createDefaultButton({
            container: '#kakao-link',
            objectType: 'feed',
            content: {
                title: '모두의정산',
                description: '정산결과 공유',
                imageUrl:
                document.images[0].src,
                link: {
                    mobileWebUrl: link_value,
                    androidExecParams: 'test',
                },
            },
            buttons: [
                {
                    title: '웹으로 이동',
                    link: {
                        mobileWebUrl: link_value,
                    },
                },
                {
                    title: '앱으로 이동',
                    link: {
                        mobileWebUrl: link_value,
                    },
                },
            ]
        });
    }

    componentDidMount() {

    }

    render() {
        let layout_style = {display: this.props.settleShareModal_displayStatus, };
        let copySuccessAlertModal_layout = { display: this.state.copySuccessAlertModal_display, };
        return (
            <div id="SettleShareModal_layout" style={layout_style}>
                <div id="SettleShareModal_iconLayout">
                    <img id="SettleShareModal_icon" src="/img/save_success_icon.png"/>
                </div>
                <div id="SettleShareModal_content">
                    정산내용을 저장했습니다.
                    <br/>
                    {
                        ( !this.props.settleShare_loginFlag )
                        ?  <div id="SettleShareModal_nouserGuide">
                             <font className="bold2">*</font> 비회원일 경우, 정산내용 [히스토리] 기능이 지원되지 않습니다.
                           </div>

                        : ''
                    }
                    <div id="SettleShareModal_copyBtn_layout">
                        <ClipboardButton id="SettleShareModal_copyBtn" data-clipboard-text={this.state.linkUrl}
                                         onSuccess={this.copySuccess} >
                            정산결과 링크복사
                        </ClipboardButton>
                    </div>
                    <div id="SettleShareModal_kakaoLinkBtn">
                        <a id="kakao-link"><img id="kakaoLinkIcon" src="/img/kakao-talk-link-icon.png" />카카오톡 공유</a>
                    </div>

                </div>

                <div id="copySuccessAlertModal" style={copySuccessAlertModal_layout}>
                    링크복사 완료
                </div>

                <div id="SettleShareModal_confirmBtn" onClick={this.SettleShareModal_close}>
                    확인
                </div>
            </div>
        );
    }
}

SettleShareModal.defaultProps={
    settleShareModal_displayStatus: 'none',
    settleShare_Info: '',
    settleShare_loginFlag: false,
    settleShareSite_key: '',
};

export default SettleShareModal;