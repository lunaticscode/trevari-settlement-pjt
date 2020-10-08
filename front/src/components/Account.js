import React from 'react';
import '../styles/Account.scss';
import Cookie from "../Cookie";
import Fetch from "../Fetch";
import Sleep from "../Sleep";

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
        };

        this.registAccount = this.registAccount.bind(this);
        this.selectBank = this.selectBank.bind(this);
        this.addAccount = this.addAccount.bind(this);
    }


    registAccount(){
       let registForm_elem = document.getElementById("AccountRegist_formLayout");
       let registForm_status = ( registForm_elem.classList.value.toString().length > 0 ) ? true : false;
       if( registForm_status ){
           registForm_elem.classList.remove('active');
       }else{
           registForm_elem.classList.add('active');
       }
    }

    selectBank(e){
        let bankInfo_array = this.state.bankInfo_valueArray;
        let selected_bankInfo = bankInfo_array[ e.target.selectedIndex - 1 ];
        this.setState({addAccount_bankInfo : selected_bankInfo} );
    }

    addAccount(){
        let bank_data = {"bank_code": this.state.addAccount_bankInfo['code'], "bank_num": this.state.addAccount_accountNum, "username": this.state.addAccount_userName};
        console.log(bank_data);
        Fetch.fetch_api("banking/accountAuth", "POST", bank_data).then(res=>{
           console.log(res);
        });
    }

    componentDidMount() {
        let banking_info_array = Object.values(this.state.bankInfo_obj);
        this.setState({bankInfo_valueArray: banking_info_array});
    }

    render() {
        let loginFlag = (Cookie.get_cookie('UserName') && Cookie.get_cookie("AccessToken") ) ? true : false;
        let now_userName = ( loginFlag ) ? Cookie.get_cookie('UserName') : '';
        return (
            <div id="AccountLayout">
                {
                    ( loginFlag )
                    ? <div id="Account_title">{now_userName}님의 <font className="bold">정산 계좌관리</font></div>
                    : <div id="Account_title" className="no-user">
                        <font className="bold">*</font> 로그인이 필요한 기능입니다.
                        </div>
                }

                {
                    ( loginFlag )
                        ?
                        <div>
                            <div id="AccountRegist_btn" onClick={this.registAccount}><font className="bold">+ </font> 계좌추가</div>
                              <br/>
                              <div id="AccountRegist_formLayout">
                                  <select id="Account_selectBox" onChange={this.selectBank} >
                                    <option value="0">은행 선택</option>
                                      {this.state.bankInfo_valueArray.map( (elem, index) => {
                                            return <option key={index} value={elem['code']}>{elem['name']}</option>
                                      })}
                                  </select>
                                  <br/>
                                  <input className="Account_input" type="text" onChange={(e)=> this.setState({addAccount_userName: e.target.value})} placeholder="예금주 실명" />
                                  <input className="Account_input" type="number" onChange={(e)=> this.setState({addAccount_accountNum: e.target.value})} placeholder="계좌번호 입력" />
                                  <div id="Account_addBtn" onClick={this.addAccount}>작성완료</div>
                              </div>
                        </div>

                        : ''
                }
                <br/>
            </div>
        );
    }
}

export default Account;

