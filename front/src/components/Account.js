import React from 'react';
import '../styles/Account.scss';
import Cookie from "../Cookie";
import Fetch from "../Fetch";
import Sleep from "../Sleep";
import {modal_close, modal_open} from "../actions";
import {connect} from "react-redux";
import crypto from "../CryptoInfo";

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
            now_cardIndex: 0,
        };
    }

    componentDidMount() {
        let banking_info_array = Object.values(this.state.bankInfo_obj);
        this.setState({bankInfo_valueArray: banking_info_array});

        if( this.state.loginFlag ){
            let userName = Cookie.get_cookie('UserName');
            Fetch.fetch_api("account/"+userName, "GET", null).then(res => {

               if(res.toString().trim().indexOf('Error') !== -1) {
                   console.log('(!) Server error ', '\n', res);
                   let alertModal_text = '(!) 서버 에러 발생, 관리자에게 문의해주세요.';
                   this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
                   Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
               }

               if(res['result'].toString().trim() === 'success'){
                        console.log(res['account_list']);
                   let myAccount_list = JSON.parse( res[ 'account_list' ].toString().replace( /'/g,  '\"' ) );
                   let tmp_account_array = [];
                   for( let key in myAccount_list ){
                        let tmp_obj = {
                            bank_code: myAccount_list[ key ][ 'bank_code' ],
                            bank_name:
                                this.state.bankInfo_valueArray[
                                    this.state.bankInfo_valueArray
                                        .findIndex( (b_elem) => b_elem['code'] === myAccount_list[ key ]['bank_code'] )
                                    ].name,
                            bank_num: crypto.decrypt_account( myAccount_list[ key ][ 'bank_num' ] ),
                        };
                        tmp_account_array.push( tmp_obj );
                   }
                   this.setState( { myAccountList: tmp_account_array } );
                   let empty_cardInfo_obj = {
                            bank_code: 0, bank_name: null, bank_num: null,
                   };
                   let tmp_slideAccount_list = tmp_account_array.concat(empty_cardInfo_obj);
                   this.setState({slideAccountList: tmp_slideAccount_list});
               }

               if( res['result'].toString().trim() === 'revoke' ) {
                   console.log('(!) API Error ', '\n', res);
                   let alertModal_text = '(!) API 요청 오류. 로그아웃 후, 다시 시도해주세요.';
                   this.props.alertModal_open(alertModal_text, window.innerHeight - 30);
                   Sleep.sleep_func(1000).then( () => { this.props.alertModal_close() } );
               }
            });
        }

    }

    render() {
        let loginFlag = this.state.loginFlag;
        let AccountLayout_style = {height: ( !loginFlag ) ? '500px' : window.innerHeight - 50};

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

                            <div id="AccountCard_slider">
                                {
                                    ( this.state.slideAccountList.length )
                                    ?
                                        this.state.slideAccountList.map( ( elem, index ) => {
                                            return <div className="myAccountCard_layout" id={"myAccountCard_"+index} key={index} >
                                                        <div className="mac owner_name">{now_userName}</div>
                                                        <div className="mac bank_name">{
                                                            ( elem['bank_name'] )
                                                                ? ( elem['bank_name'] )
                                                                : <img id="plusAccount_icon" src="/img/plus_account.png"/>
                                                        }</div>
                                                        <div className="mac bank_num">{elem['bank_num']}</div>
                                                        <div className="mac chipIcon_layout"><img className="mac chip_icon" src="/img/sim-card.png" /></div>
                                                    </div>
                                        })

                                    :
                                        <div>noneCard</div>
                                }
                            </div>
                            <div id="mac_slider_counter_layout">
                                {
                                    this.state.myAccountList.map( (elem, index) => {
                                    return <span className="mac_slide_counter" key={index} id={"mac_slide_cnt_"+index}> </span>
                                    })
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

