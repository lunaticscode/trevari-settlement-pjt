import React from 'react';
import '../styles/Account.scss';
import Cookie from "../Cookie";
import Fetch from "../Fetch";
import Sleep from "../Sleep";
import {modal_close, modal_open} from "../actions";
import {connect} from "react-redux";
import crypto from "../CryptoInfo";
import AccountTimeline from "./AccountTimeline";

class Account extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            bankInfo_obj: {
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

            bankInfo_valueArray : [],
            addAccount_bankInfo : {},
            addAccount_userName: '', addAccount_accountNum: '',

            loginFlag: ( Cookie.get_cookie('UserName') && Cookie.get_cookie("AccessToken") ) ? true : false,
            myAccountList: [],
            slideAccountList: [],

            mac_initOffsetX_list : [],
            now_lookingCardIndex: 0,
            now_sliderOffsetX: 0,
            settleInfo_byAccount_obj: {},
            now_lookingCardInfo_array: [],
            nowEdit_addMyAccount: false,

            nowEdit_bankInfo: {bank_code: null, bank_num: null},
            accountGrant_flag: false,

            cardSliding_availFlag: true,
            now_lookingCardIsEmpty: false,
        };

        this.AccountCardSliding = this.AccountCardSliding.bind(this);
        this.AcconutCardSlider_touchStartMove = this.AcconutCardSlider_touchStartMove.bind(this);
        this.AcconutCardSlider_touchEnd = this.AcconutCardSlider_touchEnd.bind(this);

        this.addMyAccount = this.addMyAccount.bind(this);
        this.addMyAccount_selectBank = this.addMyAccount_selectBank.bind(this);
        this.addMyAccount_inputNumber = this.addMyAccount_inputNumber.bind(this);
        this.addMyAccount_authBtnClick = this.addMyAccount_authBtnClick.bind(this);
        this.addMyAccount_registBtnClick = this.addMyAccount_registBtnClick.bind(this);

        this.deleteMyAccount = this.deleteMyAccount.bind(this);


    }

    AcconutCardSlider_touchStartMove(e){
        Cookie.set_cookie("mac_slider_Scrolling", 'true');
    }
    AcconutCardSlider_touchEnd(e){
        setTimeout(() => { Cookie.set_cookie('mac_slider_Scrolling', 'false'); }, 1000);
    }

    AccountCardSliding(e) {
            if(this.state.cardSliding_availFlag){
                let cardWidth = document.getElementById("myAccountCard_0").offsetWidth;
                let now_slider_offsetX = ( e.target.scrollLeft == 0 ) ? 1 : e.target.scrollLeft;
                this.setState({now_sliderOffsetX : now_slider_offsetX});
                let passing_index = Math.floor( now_slider_offsetX / cardWidth );
                //console.log(passing_index, this.state.now_lookingCardInfo_array);

                this.setState({now_lookingCardIndex: passing_index,});
                let now_accountNum = (this.state.myAccountList[passing_index] ) ? this.state.myAccountList[passing_index]['bank_num'] : null;


                if( !this.state.settleInfo_byAccount_obj || !now_accountNum  ){
                    console.log('empty card section');
                    this.setState({now_lookingCardInfo_array: null});
                }
                else{
                    try{
                            let now_accountSettleInfo = ( now_accountNum ) ? this.state.settleInfo_byAccount_obj[now_accountNum] : null;
                            if(Object.keys(this.state.settleInfo_byAccount_obj).indexOf(now_accountNum) == -1){
                                this.setState({now_lookingCardInfo_array: []});
                                return;
                            }
                            if(now_accountNum && this.state.settleInfo_byAccount_obj[now_accountNum].length > 0) {
                                let tmp_accountSettleInfo_Array = now_accountSettleInfo.sort( (a, b) => b['date'] - a['date'] );
                                this.setState({now_lookingCardInfo_array: tmp_accountSettleInfo_Array});
                            }

                    }catch(e){
                        console.log(e.toString());
                    }
                }
            }


    }

    addMyAccount() {
        this.setState({nowEdit_addMyAccount: true});
    }

    addMyAccount_selectBank(e){
        let option_elems = e.target.children[e.target.selectedIndex];
        let tmp_obj = Object.assign(this.state.nowEdit_bankInfo, {
            bank_code: option_elems.getAttribute("value"),
        });
        this.setState({nowEdit_bankInfo: tmp_obj, accountGrant_flag: false,});
    }

    addMyAccount_inputNumber(e){
        let edit_accountNum = e.target.value;
        if(e.target.value.toString().trim().length> 0 ){
            e.target.borderBottomColor = "rgb(70,236,231)";
        }
        let tmp_obj = Object.assign(this.state.nowEdit_bankInfo, {
            bank_num: edit_accountNum,
        });

        this.setState({nowEdit_bankInfo: tmp_obj, accountGrant_flag: false,});
    }

    addMyAccount_authBtnClick(e){
        let availFlag = Object.values(this.state.nowEdit_bankInfo).every( elem => elem !==null && elem.toString().length > 0 );
        if(!availFlag){
            console.log('revoke');
            return;
        }
        else{
            let submit_data = this.state.nowEdit_bankInfo;
            console.log(submit_data);
            Fetch.fetch_api("banking/accountAuth", "POST", submit_data).then(res=>{

                //* 계좌인증 실패 혹은 점검시간일 경우,
                //* ==== [ Backend-Api Result ] ===> {'code': -1, 'message': '해당되는 계좌정보를 찾을 수 없습니다.', 'response': None}
                //* ( 23:30 ~ 00:30 까지 점검인듯 함. )
                if(res['result'] === 'revoke'){
                    //* 계좌인증 관련 정보 모두 초기화.
                    this.setState({nowEdit_bankIfno: {}, });

                    //* AlertModal 오픈
                    let alertModal_text = '(!)계좌정보가 없습니다. 다시 확인해주세요.';
                    this.props.alertModal_open(alertModal_text, window.innerHeight+window.pageYOffset);
                    Sleep.sleep_func(1000).then( () => { this.props.alertModal_close(); } );
                }

                if(res['result'] === 'grant'){
                    let realname = res['realname'].toString().trim();
                    document.getElementById("addMyAccount_realName").innerHTML = realname;
                    Sleep.sleep_func(150).then( () => {
                        this.setState({
                            accountGrant_flag: true,
                        });
                    });
                }

            });
        }
        }

    addMyAccount_registBtnClick(e){

        let regist_availFlag = this.state.accountGrant_flag;

        if(regist_availFlag) {

            let now_myAccountList = this.state.myAccountList;
            let add_AccountNum = this.state.nowEdit_bankInfo['bank_num'];
            let dupleFlag = now_myAccountList.some(elem => {
                return elem['bank_num'] === add_AccountNum;
            });

            if(dupleFlag){
                let alertModal_text = '(!)이미 등록된 계좌입니다. 다시 확인해주세요.';
                this.props.alertModal_open(alertModal_text, window.innerHeight);
                this.setState({accountGrant_flag: false});
                Sleep.sleep_func(1500).then(()=> {this.props.alertModal_close()});
                return;
            }
            else{
                console.log(now_myAccountList);
                let nowEdit_grantedBankInfo = new Array(1).fill( this.state.nowEdit_bankInfo );
                console.log(nowEdit_grantedBankInfo);
                let add_result_myAccountArray = now_myAccountList.concat(nowEdit_grantedBankInfo);

                let result_obj = {};
                add_result_myAccountArray.forEach( (elem, index) => {
                    result_obj[index + 1] = {
                        bank_code: elem['bank_code'],
                        bank_num: crypto.encrypt_account(elem['bank_num'].toString()),
                    };
                });
                console.log(result_obj);

                if( Cookie.get_cookie("UserName") && Cookie.get_cookie("AccessToken") ){

                    let now_username = Cookie.get_cookie("UserName");

                    Cookie.get_cookie('UserName');
                    let submitData = { username: now_username, account_info: result_obj };

                    Fetch.fetch_api('account', 'POST', submitData).then(res => {

                         if(res.toString().trim().indexOf('Error') !== -1) {
                             console.log(res);
                             let alertModal_text = '(!) 서버 에러 발생, 관리자에게 문의해주세요.';
                             this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
                             Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
                            return;
                         }

                         if( res['result'].toString().trim() === 'success' ) { location.href='/account'; }

                        if( res['result'].toString().trim() === 'revoke' ) {
                            console.log('(!) API Error ', '\n', res);
                            let alertModal_text = '(!) API 요청 오류. 로그아웃 후, 다시 시도해주세요.';
                            this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
                            Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
                            return;
                        }


                    });

                }

            }


        }
    }

    deleteMyAccount(e){
        let now_myAccountInfo_array = this.state.myAccountList;
        let deleteIndex = e.target.getAttribute('value');
        console.log('delete AccountInfo : ', now_myAccountInfo_array[parseInt(deleteIndex)]);
        // ===> {'1': {'bank_code': '003', 'bank_num': 'tac3pgyLwHOYL8KILGezHA=='}, '2': {'bank_code': '090', 'bank_num': 'B//tf0Eu9hRzXStq+s/KvA=='}, .....
        let delete_myAccountInfo_array = now_myAccountInfo_array.filter( (elem, index) => {return index !== parseInt( deleteIndex) });
        console.log(delete_myAccountInfo_array);
        let delete_result_obj = {};
        delete_myAccountInfo_array.forEach( ( elem, index ) => {
            delete_result_obj[ index + 1 ] = {
                bank_code: elem['bank_code'],
                bank_num: crypto.encrypt_account(elem['bank_num'].toString()),
            }
        });
        console.log(delete_result_obj);

        let now_username = Cookie.get_cookie('UserName');
        let submitData = { username: now_username, account_info: delete_result_obj };
        Fetch.fetch_api('account', 'POST', submitData).then(res => {
            console.log(res);
            if(res.toString().trim().indexOf('Error') !== -1) {
                let alertModal_text = '(!) 서버 에러 발생, 관리자에게 문의해주세요.';
                this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
                Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
            }
            if(res['result'] === 'success') {
                //let modifyAccountList = res['accountList'];
                location.href = '/account';
            }

            if( res['result'].toString().trim() === 'revoke' ) {
                console.log('(!) API Error ', '\n', res);
                let alertModal_text = '(!) API 요청 오류. 로그아웃 후, 다시 시도해주세요.';
                this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
                Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
            }

        });
    }

    componentDidMount() {
        console.log('account layout mount');

        let banking_info_array = Object.values(this.state.bankInfo_obj);
        this.setState({bankInfo_valueArray: banking_info_array});
        let userName = ( Cookie.get_cookie('UserName') ) ? Cookie.get_cookie('UserName') : '';
        //* 회원 유저, DB에 등록된 계좌정보 API 호출.
        if( this.state.loginFlag ){
            //console.log('fetch1 - start');
            Fetch.fetch_api("account/"+userName, "GET", null).then(res => {
                //console.log('fetch1 - end');

                if(res.toString().trim().indexOf('Error') !== -1) {
                   console.log('(!) Server error ', '\n', res);
                   let alertModal_text = '(!) 서버 에러 발생, 관리자에게 문의해주세요.';
                   this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
                   Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
               }

               if(res['result'].toString().trim() === 'success'){
                   //console.log(res['account_list']);

                   //* 회원 유저임에도 불구하고, 관리중인 계좌 목록이 하나도 없을 경우, 빈 배열로 설정;
                   let myAccount_list = (res['account_list']) ? JSON.parse( res[ 'account_list' ].toString().replace( /'/g,  '\"' ) ) : [];
                   //console.log(myAccount_list, typeof(myAccount_list), myAccount_list.length);
                   let tmp_accountArray = [];

                       for( let key in myAccount_list ){
                            let tmp_obj = {
                                bank_code: myAccount_list[ key ][ 'bank_code' ],

                                bank_name:
                                    this.state.bankInfo_valueArray[
                                            this.state.bankInfo_valueArray.findIndex( ( b_elem ) => b_elem['code'] === myAccount_list[ key ] [ 'bank_code' ] )
                                        ]['name'],

                                bank_num: crypto.decrypt_account( myAccount_list[ key ][ 'bank_num' ] ),
                            };
                            tmp_accountArray.push( tmp_obj );
                       }

                   //console.log(tmp_accountArray);

                   //let tmp_accountArray = [];

                   this.setState( { myAccountList: tmp_accountArray } );
                   let empty_cardInfo_obj = {
                            bank_code: 0, bank_name: null, bank_num: null,
                   };

                        //* 관리가능 계좌 최대 5개,
                        //* 5개 미만일 경우, [ + 추가 ] 기능있는 빈 계좌 obj 추가.
                        if(tmp_accountArray.length < 5){
                            let tmp_slideAccount_list = tmp_accountArray.concat(empty_cardInfo_obj);
                            this.setState({slideAccountList: tmp_slideAccount_list});
                        }

                        //* 슬라이드 제어를 위한, 슬라이더 레이아웃 내부에 있는 계좌카드 초기 위치( offset X ) state 값으로 저장.
                        if(this.state.myAccountList.length > 0){
                            let slideMac_elems = document.getElementsByClassName("myAccountCard_layout");
                            //console.log(slideMac_elems);

                            let tmp_offsetX_list = [];
                            let real_myCard_cnt = ( this.state.myAccountList.length < 5 ) ? slideMac_elems.length - 1 : slideMac_elems.length;
                            //* 애니메이션 종료 후, 각 카드( 실제 등록되어진 계좌카드일 경우에만 ) offsetX 취합 후에 state로 지정.
                            Sleep.sleep_func(500).then(() => {
                                for(let i = 0; i < real_myCard_cnt; i++){
                                    let offsetX_mac_elem = document.getElementById("myAccountCard_"+i).offsetLeft;
                                    tmp_offsetX_list.push(offsetX_mac_elem);
                                    this.setState({mac_initOffsetX_list: tmp_offsetX_list});
                                }
                            });
                        }


                   //* 현재 유저 정산기록 호출
                   let submit_data = {user_name : userName,};
                   //console.log('fetch2 - start');
                   Fetch.fetch_api("settleList", 'POST', submit_data)
                       .then(res=> {
                           //console.log('fetch2 - end');
                           if( res.toString().trim().indexOf('Error') !== -1){
                               console.log('server error');
                               let AlertText = '(!) 서버에 오류가 발생했습니다. 관리자에게 문의해주세요.';
                               let topPosition = window.innerHeight;
                               this.props.modalOpen( AlertText, ( topPosition-30 ) );
                               Sleep.sleep_func(2000).then(()=> this.props.modalClose());
                               return;
                           }


                           //* 현재 관리중인 계좌가 하나도 없는 유저일 경우,
                           if(res['result'].toString().trim() === 'fail'){
                               this.setState({now_lookingCardInfo_array: null, cardSliding_availFlag: true});
                               return;
                           }

                           //console.log(res['settleInfo_List']);
                           let result_settleInfo = res['settleInfo_List'];

                           //* 정산정보중에 내가 관리중인 계좌가 아닌 정보일 경우, Array에서 해제.
                           let myAccountList = this.state.myAccountList;
                           result_settleInfo = result_settleInfo.filter( elem => {
                               let accountNumber = crypto.decrypt_account(elem['si_account']);
                               return myAccountList.findIndex(i_elem => {
                                   return accountNumber.toString() === i_elem['bank_num'];
                               }) !== -1;
                           });
                           //console.log(result_settleInfo);

                           if(result_settleInfo.length === 0) {
                               this.setState({now_lookingCardInfo_array: null, });
                               return;
                           }
                           else{
                               this.setState({settleInfoList: result_settleInfo});
                           }

                           let tmp_info_array = result_settleInfo.map(elem => {
                               let account_num = crypto.decrypt_account(elem['si_account']);
                               let tmp_obj = {account: account_num, title:elem['si_title'], regdate: elem['si_regdate'], settleInfo: JSON.parse( elem['si_form_info'] )};
                               return tmp_obj;
                           }).sort( (a, b) => a['account'] - b['account'] );

                           //console.log(tmp_info_array);

                           tmp_info_array = tmp_info_array.reduce( ( acc, cur ) => {
                               let tmp_array = [ {info:cur['settleInfo'],
                                   title:cur['title'],
                                   sumprice: Object.values( cur['settleInfo'] ).reduce( (acc, cur) => acc + cur['settleSum'], 0) ,
                                   date:cur['regdate']}];
                               let curValue = ( Object.keys(acc).indexOf(cur['account']) !== -1 ) ? acc[cur['account']].concat(tmp_array) : tmp_array;
                               acc[cur['account']] = curValue;
                               return acc;
                           }, {});

                           Sleep.sleep_func(500).then( ()=> {
                               //* ===> { accountNumber : [ {info}, {info2}, .... ], accountNumber2 : [{}, {}, .... ], ... }
                               this.setState({settleInfo_byAccount_obj: tmp_info_array, cardSliding_availFlag: true});
                               document.getElementById("AccountCard_slider").scroll(1, 0);
                           });
                       });
               }

               if( res['result'].toString().trim() === 'revoke' ) {
                   console.log('(!) API Error ', '\n', res);
                   let alertModal_text = '(!) API 요청 오류. 로그아웃 후, 다시 시도해주세요.';
                   this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
                   Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
               };
            }); // ---> 카드리스트 Fetch ----> 해당 계좌 정산정보 Fetch ----> 종료 지점.
        }

        //* 비회원일 접속일 경우,
        else{ }

    }

    render() {
        let loginFlag = this.state.loginFlag;
        let AccountLayout_style = {height: ( !loginFlag ) ? '500px' : window.innerHeight - 200};
        let CardSlider_style = {display: ( this.state.cardSliding_availFlag ) ? 'block': 'none' }
        let now_userName = ( loginFlag ) ? Cookie.get_cookie('UserName') : '';
        return (
            <div id="AccountLayout" style={AccountLayout_style}>
                {
                    ( loginFlag )
                    ? ''
                    : <div id="Account_title" className="no-user">
                        <font className="bold">*</font> 로그인이 필요한 기능입니다.
                        </div>
                }

                {
                    ( loginFlag )
                        ?
                        <div id="AccountContent_layout">

                            <div id="AccountCard_slider"
                                 style={CardSlider_style}
                                 onTouchStart={this.AcconutCardSlider_touchStartMove}
                                 onTouchMove={this.AcconutCardSlider_touchStartMove}
                                 onTouchEnd={this.AcconutCardSlider_touchEnd}
                                 onScroll={this.AccountCardSliding} >
                                {
                                        this.state.slideAccountList.map( ( elem, index ) => {
                                            //console.log(elem);
                                            return <div className={ (this.state.now_lookingCardIndex === index) ? "myAccountCard_layout active" : "myAccountCard_layout"}
                                                        onTouchStart={this.AcconutCardSlider_touchStartMove}
                                                        onTouchMove={this.AcconutCardSlider_touchStartMove}
                                                        onTouchEnd={this.AcconutCardSlider_touchEnd}
                                                        id={"myAccountCard_"+index} key={index} >
                                                        {
                                                            ( this.state.myAccountList.length !== 5 && ( index ) === this.state.myAccountList.length )
                                                            ?  ''
                                                                : <div className="mac_deleteBtn" onClick={this.deleteMyAccount} value={index} >
                                                                    <img src="/img/delete_icon.png" value={index}/>
                                                                </div>
                                                        }


                                                        <div className="mac owner_name">{now_userName}</div>
                                                        <div className="mac bank_name">{
                                                            ( elem['bank_name'] )
                                                                ? ( elem['bank_name'] )
                                                                : <img id="plusAccount_icon" onClick={this.addMyAccount} src="/img/plus_account.png"/>
                                                        }</div>
                                                        <div className="mac bank_num">{elem['bank_num']}</div>
                                                        <div className="mac chipIcon_layout">
                                                            {
                                                                ( elem['bank_name'] )
                                                                ? <img className="mac chip_icon" src="/img/sim-card.png" />
                                                                : ''
                                                            }

                                                        </div>
                                                    </div>
                                        })
                                }
                            </div>
                            <div id="mac_slider_counter_layout">
                                {
                                    this.state.myAccountList.map( (elem, index) => {
                                    return <span className={ (this.state.now_lookingCardIndex === index ) ? "mac_slide_counter active" : 'mac_slide_counter ' }
                                                 key={index} id={"mac_slide_cnt_"+index}></span>
                                    })
                                }
                            </div>
                            <div id="mac_info_infoLayout">
                                {
                                    ( this.state.now_lookingCardInfo_array )
                                    ?
                                        <div>
                                            <div id="mac_info_box_layout">
                                                <div id="mac_info_settleCnt_box">
                                                    <div className="mac_info title">정산 횟수</div>
                                                    <div className="mac_info value">
                                                        { this.state.now_lookingCardInfo_array.length + " 회"}
                                                    </div>
                                                </div>

                                                <div id="mac_info_settleSumPrice_box">
                                                    <div className="mac_info title">정산 금액</div>
                                                    <div className="mac_info value">
                                                        {
                                                            this.state.now_lookingCardInfo_array.reduce( ( acc, cur ) => {
                                                                return acc + cur['sumprice'];
                                                            }, 0).toLocaleString()+" 원"
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <AccountTimeline
                                                passingCardIndex={this.state.now_lookingCardIndex}
                                                accountInfo={this.state.now_lookingCardInfo_array}
                                            />

                                        </div>

                                    :  ( this.state.nowEdit_addMyAccount )
                                        ? <div>
                                                <div id="addMyAccount_layout">
                                                    <select id="addMyAccount_bankName_select" onChange={this.addMyAccount_selectBank}>
                                                        {
                                                            Object.values( this.state.bankInfo_obj ).map( (elem, index) => {
                                                                return <option key={index} value={elem['code']}
                                                                               className="addMyAccount_bankName_option">
                                                                        {elem['name']}
                                                                       </option>
                                                            })
                                                        }
                                                    </select>
                                                    <div>
                                                        <input id="addMyAccount_input_accountNum" type="number"
                                                               className={
                                                                   ( this.state.nowEdit_bankInfo['num']
                                                                       && ( this.state.nowEdit_bankInfo['num'] ).toString().length > 0 )
                                                                   ? "active" : ''
                                                               }
                                                               onChange={this.addMyAccount_inputNumber}
                                                               placeholder="계좌번호 입력" />

                                                        <div id="addMyAccount_authBtn"
                                                             onClick={this.addMyAccount_authBtnClick}
                                                             className={
                                                                 ( Object.values(this.state.nowEdit_bankInfo).every(elem => elem !== null && elem.toString().length>0 ) )
                                                                 ? "grant" : ""
                                                             }
                                                                >계좌인증
                                                        </div>
                                                        <div id="addMyAccount_realName_layout"
                                                             className={
                                                                 (this.state.accountGrant_flag)
                                                                 ? 'active' : ''
                                                             }>
                                                            예금주
                                                            <div id="addMyAccount_realName"></div>
                                                        </div>
                                                        <div id="addMyAccount_registBtn"
                                                             onClick={this.addMyAccount_registBtnClick}
                                                             className={
                                                                 (this.state.accountGrant_flag )
                                                                 ? 'grant' : ''
                                                                }>
                                                            계좌 등록</div>
                                                    </div>
                                                </div>
                                            </div>
                                        : ''
                                }

                            </div>
                        </div>

                        : ''
                }
                <br/>
            </div>
        );
    }
}


let mapDispatchToProps = (dispatch) => {
    return {
        alertModal_open: (text, topPosition) => dispatch(modal_open(text, topPosition)),
        alertModal_close: () => dispatch(modal_close())
    }
};

Account = connect(undefined, mapDispatchToProps)(Account);

export default Account;

