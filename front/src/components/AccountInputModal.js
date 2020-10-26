import React from 'react';
import '../styles/AccountInputModal.scss'
import Fetch from "../Fetch";
import {infomodal_open, mask_close, mask_open, modal_open, modal_close, commonModal_open} from "../actions";
import {connect} from "react-redux";
import Sleep from "../Sleep";
import crypto from "../CryptoInfo";
import Cookie from "../Cookie";
import AlertModal from "./AlertModal";
import SettleShareModal from "./SettleShareModal";

class AccountInputModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bankInfo_obj : {
                0: {code: "001", name: "한국은행"}, 1: {code: "002", name: "산업은행"},
                2: {code: "003", name: "기업은행"}, 3: {code: "004", name: "국민은행"},
                4: {code: "007", name: "수협중앙회"}, 6: {code: "011", name: "농협은행"},
                8: {code: "020", name: "우리은행"}, 9: {code: "023", name: "SC은행"},
                10: {code: "027", name: "한국씨티은행"}, 11: {code: "031", name: "대구은행"},
                12: {code: "032", name: "부산은행"}, 13: {code: "034", name: "광주은행"},
                14: {code: "035", name: "제주은행"}, 15: {code: "037", name: "전북은행"},
                16: {code: "039", name: "경남은행"}, 17: {code: "045", name: "새마을금고중앙회"},
                18: {code: "048", name: "신협중앙회"}, 19: {code: "050", name: "상호저축은행"},
                20: {code: "052", name: "모건스탠리은행"}, 29: {code: "062", name: "중국공상은행"},
                30: {code: "063", name: "중국은행"}, 31: {code: "064", name: "산림조합중앙회"},
                32: {code: "065", name: "대화은행"}, 33: {code: "066", name: "교통은행"},
                34: {code: "071", name: "우체국"}, 37: {code: "081", name: "KEB하나은행"},
                38: {code: "088", name: "신한은행"}, 39: {code: "089", name: "케이뱅크"},
                40: {code: "090", name: "카카오뱅크"}, 44: {code: "096", name: "한국전자금융(주)"}
            },
            selectedBank_info : {},
            bankAuthInfo : {},
            registAccount_flag : false,
            realnameFlag: false,
            bank_realname: '',
            accountAuth_status: null,
            savedAccountText: '',

            //* 마지막 정산계좌 등록 후, 정산결과 공유 모달 오픈 시 아래 state 값으로 회원 / 비회원 구분.
            settleShare_loginFlag: false,
            settleShare_info: {},
            settleShareSite_key: null,

            settleShareModal_display: 'none',
        };
        this.selectBank = this.selectBank.bind(this);
        this.accountInput_banknum = this.accountInput_banknum.bind(this);
        this.authAccount = this.authAccount.bind(this);
        this.registAccount = this.registAccount.bind(this);
        this.accountModal_close = this. accountModal_close.bind(this);

        this.settleShareModal_close = this.settleShareModal_close.bind(this);
    }

    selectBank(e) {
        let selectedOption_elem = e.target.children[e.target.selectedIndex];
        let bank_code = (selectedOption_elem.getAttribute("value")) ? selectedOption_elem.getAttribute("value") : null;
        let tmp_obj = Object.assign(this.state.bankAuthInfo, {bank_code: bank_code,});
        this.setState({
            bankAuthInfo: tmp_obj,
            registAccount_flag: false,
            realnameFlag: false,
            accountAuth_status: null,
        });

        //* [ My 계좌 ] select-box 에서 선택한 option 일 경우,
        if (e.target.getAttribute("id").toString().indexOf('onlyUser') !== -1) {
            if(Cookie.get_cookie('UserName') && Cookie.get_cookie("AccessToken") ){
                document.getElementById("AccountInputModal_selectBank").children[0].setAttribute("selected", '');
                document.getElementById("AccountInputModal_onlyUser_selectBank").children[0].removeAttribute("selected");
            }

            let onlyUser_savedAccountNum = this.state.myAccountInfo_array[e.target.selectedIndex - 1]['account_num'];
            let onlyUser_savedBankCode = this.state.myAccountInfo_array[e.target.selectedIndex - 1]['bank_info']['code'];
            document.getElementById("AccountInputModal_input_banknum").value = onlyUser_savedAccountNum;
            let tmp_obj = Object.assign(this.state.bankAuthInfo, {
                bank_code: onlyUser_savedBankCode,
                bank_num: onlyUser_savedAccountNum,
            });
            this.setState({
                bankAuthInfo: tmp_obj,
                registAccount_flag: false,
                realnameFlag: false,
                accountAuth_status: null,
            });
        }else{
            if(Cookie.get_cookie('UserName') && Cookie.get_cookie("AccessToken") ){
                document.getElementById("AccountInputModal_onlyUser_selectBank").children[0].setAttribute("selected", '');
                document.getElementById("AccountInputModal_selectBank").children[0].removeAttribute("selected");
            }
        }
    }
    accountInput_banknum(e){
        let banknum_value = e.target.value;
        (banknum_value.toString().trim().length > 0) ? e.target.style.borderBottomColor = 'cyan' : e.target.style.borderBottomColor = 'gray';
        let tmp_obj = Object.assign(this.state.bankAuthInfo, { bank_num : banknum_value.toString().trim(),});
        this.setState({bankAuthInfo : tmp_obj, registAccount_flag: false, realnameFlag: false, bank_realname: '', accountAuth_status: null,});
    }

    accountModal_close(){
        this.props.AccountModal_close();
        this.props.maskClose();
        document.body.style.overflow = 'auto';

        //* 작성된 모든 값 초기화.
        this.setState({ bankAuthInfo: {}, bank_realname: '', realnameFlag: false, registAccount_flag: false, accountAuth_status: null, });
        let bank_selectElem = document.getElementById("AccountInputModal_selectBank");
        bank_selectElem.selectedIndex = 0;
        let bank_accountNumInputElem = document.getElementById("AccountInputModal_input_banknum");
        bank_accountNumInputElem.value = '';
    }

    //* [ 계좌인증 ] 버튼 클릭 이벤트.
    authAccount(e){
        if( e.target.getAttribute('value').toString().trim() === 'true' && !this.state.accountAuth_status ){
            let submit_data = this.state.bankAuthInfo;
            //console.log(submit_data);
            this.setState({accountAuth_status: 'exec'});
            Fetch.fetch_api("banking/accountAuth", "POST", submit_data).then(res=>{

                //* 계좌인증 실패 혹은 점검시간일 경우,
                //* ==== [ Backend-Api Result ] ===> {'code': -1, 'message': '해당되는 계좌정보를 찾을 수 없습니다.', 'response': None}
                //* ( 23:30 ~ 00:30 까지 점검인듯 함. )
                if(res['result'] === 'revoke'){

                    //* 계좌인증 관련 정보 모두 초기화.
                    this.setState({registAccount_flag: false, realnameFlag: false, bank_realname: '', accountAuth_status:null,});
                    let tmp_obj = Object.assign(this.state.bankAuthInfo, { bank_num : '', });
                    this.setState({bankAuthInfo: tmp_obj});

                    //* AlertModal 오픈
                    let acconutNum_inputElem = document.getElementById("AccountInputModal_input_banknum");
                    acconutNum_inputElem.style.borderBottomColor = 'rgb(255, 124, 140)';
                    let alertModal_text = '(!)계좌정보가 없습니다. 다시 확인해주세요.';
                    this.props.alertModalOpen(alertModal_text, window.innerHeight+window.pageYOffset);
                    Sleep.sleep_func(1000).then( () => { this.props.alertModalClose(); } );
                }

                if(res['result'] === 'grant'){
                    Sleep.sleep_func(300).then( () => {
                        this.setState({registAccount_flag: true,
                            realnameFlag: true,
                            bank_realname: res['realname'],
                            accountAuth_status: 'grant'
                        });
                    });
                }

            });
        }
    }

    //* [ 정산계좌 등록 ] 버튼 클릭이벤트.
    registAccount(e){
        let flag = ( e.target.classList.value === 'active' ) ? true : false;
        if( flag ){

            //* 회원 유저일 경우,
            if( Cookie.get_cookie('UserName') && Cookie.get_cookie('AccessToken') ){
                //this.props.AccountModal_close();
                //this.props.maskClose(); document.body.style.overflow = 'auto';

                let encrypted_account = crypto.encrypt_account(this.state.bankAuthInfo['bank_num'].toString().trim());
                let finalSubmit_data = Object.assign(this.props.finalSubmitData, {
                    si_account : encrypted_account,
                    si_bankcode: this.state.bankAuthInfo['bank_code'],
                });

                this.setState({tmp_savedAccountText: encrypted_account});
                this.setState({tmp_savedBankCode: this.state.bankAuthInfo['bank_code']});
                //console.log(finalSubmit_data);

                Fetch.fetch_api('settle', 'POST', finalSubmit_data)
                    .then(res => {
                        if(res.toString().trim().indexOf('Error') !== -1){
                            console.log('(!) 서버 에러 발생');
                            return;
                        }

                        if(res['result'] === 'success'){
                            //console.log(res);
                            let saved_settleInfoId = res['savedIndex'];
                            //console.log('saved_settleIndex : ',saved_settleInfoId);
                            //* 작성된 모든 값 초기화.
                            this.setState({ bankAuthInfo: {}, bank_realname: '', realnameFlag: false, registAccount_flag: false, accountAuth_status: null, });
                            let bank_selectElem = document.getElementById("AccountInputModal_selectBank");
                            bank_selectElem.selectedIndex = 0;
                            let bank_accountNumInputElem = document.getElementById("AccountInputModal_input_banknum");
                            bank_accountNumInputElem.value = '';

                            localStorage.removeItem("formInfo");
                            Object.keys( localStorage ).forEach(elem => {
                                if(elem.toString().indexOf('savedSettle_') !== -1) {
                                    localStorage.removeItem(elem.toString());
                                }
                            });


                            if( Cookie.get_cookie('UserName') ){
                                let myAccountInfo_arrayLength =  ( this.state.myAccountInfo_array ) ? this.state.myAccountInfo_array.length : 0;
                                let now_savedAccountNum = crypto.decrypt_account(this.state.tmp_savedAccountText);
                                //console.log('now_savedAccountNum ', now_savedAccountNum);

                                //let settleShareSite_key = Cookie.get_cookie('UserName') + '&&' + saved_settleInfoId + '&&' + finalSubmit_data.si_regdate;
                                let settleShareSite_key = Cookie.get_cookie('UserName') + '&&' + saved_settleInfoId;

                                //* 유저가 이미 관리중인 계좌를 [최종 정산계좌]로 등록하는 경우, 혹은(or) 현재 관리중인 계좌 개수가 5개 이상일 때,
                                if(
                                        ( this.state.myAccountInfo_array && this.state.myAccountInfo_array.some( elem => elem['account_num'] === now_savedAccountNum ) )
                                          || myAccountInfo_arrayLength >= 5
                                  )
                                    {
                                    this.setState({tmp_savedAccountText: '', tmp_savedBankCode: ''});
                                    // console.log( finalSubmit_data );
                                    // console.log( settleShareSite_key );
                                    console.log('Ready to Open Settle-Share-Modal.');
                                        this.setState({
                                            settleShareSite_key: settleShareSite_key,
                                            settleShare_info: finalSubmit_data,
                                            settleShare_loginFlag: true,
                                        });
                                    this.setState({ settleShareModal_display: 'block'});

                                    //location.href = '/settle';
                                    }

                                //* 이전에 없던 새로운 계좌로 등록하는 경우,
                                else{
                                    let mainText = "현재 계좌정보를 [계좌관리] 리스트에 추가하시겠습니까?";
                                    let subText = '최대 5개까지 저장됩니다. (현재 ' + myAccountInfo_arrayLength + '개 관리중)';

                                    this.setState({ tmp_finalSubmitData: finalSubmit_data, tmp_settleShareSite_key: settleShareSite_key});

                                    //** 제어권 이동 ---> componentDidUpdate( ... )에서 처리.
                                    this.props.commonModalOpen('AccountInfo manage', mainText, subText, 'positive');


                                }

                            }

                            //* ....??
                            // else{
                            //     this.setState({tmp_savedAccountText: '', tmp_savedBankCode: ''});
                            //     //location.href = '/settle';
                            // }

                        }
                        else{
                            //console.log(res);
                        }
                    });
            }

            //* 비회원 유저의 정산계좌 등록일 경우,
            else{
                //this.props.AccountModal_close();
                //this.props.maskClose(); document.body.style.overflow = 'auto';
                let encrypted_account = crypto.encrypt_account(this.state.bankAuthInfo['bank_num'].toString().trim());
                let finalSubmit_data = Object.assign(this.props.finalSubmitData, {
                    si_account : encrypted_account,
                    si_bankcode: this.state.bankAuthInfo['bank_code'],
                });
                let random_key = Math.random().toString(36).slice(2);
                let settleShareSite_key = 'nouser&&' + random_key + '&&' + Date.now();
                console.log('Ready to Open Settle-Share-Modal.');
                // console.log( finalSubmit_data );
                // console.log( settleShareSite_key );
                this.setState({ settleShareSite_key: settleShareSite_key, settleShare_info: finalSubmit_data, settleShare_loginFlag: false });
                this.setState({ settleShareModal_display: 'block'});
            }

        } //******
    }

    //* 자식 컴포넌트 [SettleShareModal.js] 레이아웃 closing 함수 ===> 함수 통째로 props 전달.
    //* 자식 컴포넌트 닫히는 동시에 현재 정산계좌등록 모달도 같이 closing. ( + 저장값 모두 초기화 )
    settleShareModal_close(){
        this.setState( {settleShareModal_display: 'none'} );
        this.setState({ bankAuthInfo: {}, bank_realname: '', realnameFlag: false, registAccount_flag: false, accountAuth_status: null, });
        this.props.maskClose();
        this.props.AccountModal_close();
        location.href = '/settle';
    }

    componentDidUpdate(prevProps, prevState){

        //* 로그인 유저일 경우, 현재 컴포넌트 열리는(display=block) 동시에 관리중인 계좌리스트 호출.
        if( Cookie.get_cookie('UserName') && Cookie.get_cookie('AccessToken')
            && this.props.displayStatus === 'block' && prevProps.displayStatus !== this.props.displayStatus ){
            Fetch.fetch_api('account/'+Cookie.get_cookie('UserName'), 'GET', null).then(res => {
                if( res.toString().trim().indexOf('Error') !== -1 ) {
                    let alertModal_text = '(!) 서버 에러 발생. 계좌리스트를 불러올 수 없습니다.';
                    console.log('(!)서버 에러 발생');
                    this.props.alertModalOpen(alertModal_text, window.innerHeight);
                    Sleep.sleep_func(1000).then( () => { this.props.alertModalClose(); });
                    return;
                }
                if( res['result'] === 'success' ) {

                    let tmp_array = ( res['account_list'] ) ? Object.values( JSON.parse( res['account_list'].replace( /'/g, "\"" ) ) ) : [];
                    //console.log(tmp_array);

                    let myAccountInfo_array = [];
                    let bankInfoObj_valueArray = Object.values( this.state.bankInfo_obj );
                    if( tmp_array && tmp_array.length > 0 ){
                        tmp_array.forEach( elem => {
                            let bankInfo_index = bankInfoObj_valueArray.findIndex( b_elem => {
                                return b_elem['code'].toString() === elem['bank_code'].toString();
                            });

                            let tmp_obj = {
                                bank_info: bankInfoObj_valueArray[bankInfo_index],
                                account_num: crypto.decrypt_account(elem['bank_num']),
                            };
                            myAccountInfo_array.push(tmp_obj);
                        });
                    }
                    //console.log(myAccountInfo_array);
                    this.setState({myAccountInfo_array : myAccountInfo_array});
                    this.setState({
                        userAccountList : ( res['account_list'] )
                                ? JSON.parse( res['account_list'].replace(/'/g, "\"") )
                                : null
                    });
                }
                if( res['result'] === 'revoke' ){
                    console.log(res);
                    let alertModal_text = '(!) 서버 에러 발생. 계좌리스트를 불러올 수 없습니다.';
                    this.props.alertModalOpen(alertModal_text, window.innerHeight);
                    Sleep.sleep_func(1000).then( () => { this.props.alertModalClose(); });
                    return;
                }
            });
        }

        //* 계좌관리 리스트 추가 안내 모달 오픈 시,
        if(prevProps.modalConfirm_result !== this.props.modalConfirm_result){

            let finalSubmit_data = this.state.tmp_finalSubmitData;
            let settleShareSite_key = this.state.tmp_settleShareSite_key;
            //console.log('Now accountAdd_Modal Open..... ',finalSubmit_data, settleShareSite_key);

            //* 모달에서 [확인] 버튼 클릭 시,
            if(this.props.modalConfirm_result === 'exec') {

                if(this.props.modalConfirm_title === 'AccountInfo manage'
                    && ( !this.state.userAccountList || Object.keys(this.state.userAccountList).length < 5 ) ) {
                    let savedUserAccountList_cnt = ( this.state.userAccountList ) ? Object.keys(this.state.userAccountList).length : 0;

                    // console.log(this.state.tmp_savedAccountText, this.state.tmp_savedBankCode);
                    // console.log(' ===>  save into user_db to [' + Cookie.get_cookie('UserName') +']');

                    if(this.state.userAccountList === null) { this.state.userAccountList = {}; }
                    let save_accountInfo_obj = Object.assign(this.state.userAccountList, {
                        [ savedUserAccountList_cnt  + 1 ] : {
                            bank_code: this.state.tmp_savedBankCode,
                            bank_num: this.state.tmp_savedAccountText,
                        }
                    });
                    //console.log(save_accountInfo_obj);

                    let now_username = Cookie.get_cookie('UserName');
                    let submitData = { username: now_username, account_info: save_accountInfo_obj };
                    Fetch.fetch_api('account', 'POST', submitData).then(res => {
                        //console.log(res);
                        if(res['result'] === 'success') {
                            this.setState({savedAccountText: ''});
                            this.setState({tmp_savedAccountText: '', tmp_savedBankCode: ''});
                            // console.log( finalSubmit_data );
                            // console.log( settleShareSite_key );
                            console.log('Ready to Open Settle-Share-Modal.');
                            this.setState({
                                settleShareSite_key: settleShareSite_key,
                                settleShare_info: finalSubmit_data,
                                settleShare_loginFlag: true,
                            });
                            this.setState({ settleShareModal_display: 'block'});

                        }
                    });
                }
            }
            //* 계좌리스트 추가 모달에서 [취소] 버튼 클릭 시,
            else if(this.props.modalConfirm_result === 'revoke') {
                    //console.log('Do not save accountInfo');
                  this.setState({savedAccountText: ''});
                    console.log('Ready to Open Settle-Share-Modal.');
                    this.setState({
                        settleShareSite_key: settleShareSite_key,
                        settleShare_info: finalSubmit_data,
                        settleShare_loginFlag: true,
                    });
                    this.setState({ settleShareModal_display: 'block'});
            }

        }

    }

    componentDidMount(){
        //console.log(this.props.finalSubmitData);
    }

    render() {
        let bankAuthInfo_obj = this.state.bankAuthInfo;
        let authAccount_flag = ( Object.keys(bankAuthInfo_obj).length === 2 &&  Object.values(bankAuthInfo_obj).every( elem => elem !== null && elem !== '' ) );

        let layout_style = {display: this.props.displayStatus, height: (this.state.userAccountList) ? '280px' : '240px'};
        return (
            <div id="AccountInputModal_layout" style={layout_style}>
                <div id="AccountInputModal_content" >
                    <div id="AccountInputModal_title"><font className="bold">#</font>정산계좌 입력</div>
                    <img id="AccountInputModal_closeBtn" onClick={this.accountModal_close} src={"/img/delete_icon_white.png"}/>
                    <br/>

                    {
                        ( this.state.userAccountList && this.state.myAccountInfo_array.length > 0 )
                            ? <div id="AccountInputModal_selectBank_onlyUser_layout">
                                <font className="bold">My</font> 계좌
                                <select id="AccountInputModal_onlyUser_selectBank" onChange={this.selectBank}>
                                    <option> ----- </option>
                                    {
                                       this.state.myAccountInfo_array.map( (elem, index) => {
                                            return <option value={elem['bank_info']['code']}
                                                           key={index}>
                                                {elem['bank_info']['name'] + ' / ' + elem['account_num']}
                                            </option>
                                       })
                                    }
                                </select>
                            </div>
                            : ''
                    }


                    <div id="AccountInputModal_selectBank_layout">
                        은행 선택
                        <select id="AccountInputModal_selectBank" onChange={this.selectBank}>
                            <option> ----- </option>
                            {
                                Object.values(this.state.bankInfo_obj).map( ( elem, index ) => {
                                    return <option key={index} value={elem['code']}>
                                            { elem['name'] }
                                           </option>
                                })
                            }
                        </select>
                    </div>
                    <div className="AccountInputModal_inputLayout">
                        <input id="AccountInputModal_input_banknum"
                               className="AccountInputModal_input banknum"
                               type="number"
                               placeholder="예금주 계좌번호 입력"
                               onChange={this.accountInput_banknum} />
                        <div id="Account_authBtn"
                             className={( authAccount_flag ) ? 'AccountInputModal_input authBtn active' : 'AccountInputModal_input authBtn'}
                             value={authAccount_flag}
                             onClick={this.authAccount} >
                            {
                                ( !this.state.accountAuth_status ) ? '계좌인증'
                                    : (this.state.accountAuth_status === 'exec' ) ? <img value={authAccount_flag} className="Account_authIcon exec" src={"img/circle-progress.png"} />
                                        : <img value={authAccount_flag} className="Account_authIcon grant" src={"/img/check-icon.png"} />
                            }
                        </div>
                    </div>
                    <div id="AccountInputModal_realnameLayout" className={ ( this.state.realnameFlag ) ? 'active' : '' }>예금주
                        <div id="AccountInputModal_realname">{this.state.bank_realname}</div>
                    </div>
                    <div id="AccountInputModal_accountRegistBtn"
                         onClick={this.registAccount}
                         className={ (this.state.registAccount_flag && this.state.realnameFlag ) ? "active" : '' }>
                        정산계좌 등록
                    </div>
                </div>

                <SettleShareModal
                    settleShareModal_displayStatus={this.state.settleShareModal_display}
                    settleShareModal_close={this.settleShareModal_close}
                    settleShare_Info={this.state.settleShare_info}
                    settleShare_loginFlag={this.state.settleShare_loginFlag}
                    settleShareSite_key={this.state.settleShareSite_key}
                />

            </div>
        );
    }
}

AccountInputModal.defaultProps = {
    displayStatus : 'none',
    finalSubmitData: {},
};


let mapStateToProps = (state) => {
    return {
        modalConfirm_title: state.commonModal.title,
        modalConfirm_result : state.commonModal.resultSign,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        maskClose: () => dispatch( mask_close() ),
        commonModalOpen: ( title, text, subText, mood ) => dispatch( commonModal_open( title, text, subText, mood) ),
        alertModalOpen: ( text, position ) => dispatch( modal_open( text, position ) ),
        alertModalClose: () => dispatch( modal_close() ),
    }
};

AccountInputModal = connect(mapStateToProps, mapDispatchToProps)(AccountInputModal);

export default AccountInputModal;