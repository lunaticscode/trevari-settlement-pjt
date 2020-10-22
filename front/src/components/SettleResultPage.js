import React from 'react';
import '../styles/SettleResultPage.scss'
import crypto from '../CryptoInfo';
import Fetch from "../Fetch";
import SettleResultForm from "./SettleResultForm";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import Sleep from "../Sleep";
import ClipboardButton from "react-clipboard.js";

class SettleResultPage extends React.Component {
    constructor(props){
        super(props);
        const { params } = this.props.match;
        let settleResult_key_denc = crypto.base64_denc(params.id);
        settleResult_key_denc = crypto.decrypt_account(settleResult_key_denc);

        this.state={

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

            settleParam: params['id'],
            settleOwnerName: null,
            settleKey_info : settleResult_key_denc,
            settleInfo_errorFlag: true,
            settleInfo_title: '',
            settleInfo_formInfoObj: {},
            settleInfo_formCnt: 0,
            settleInfo_sumPrice: 0,
            settleInfo_personArray: [],
            settleInfo_sumValueObj: {},
            settleInfo_bank: {},
            selectedPerson_settleSumPrice: 0,

            selectedPersonName_box: '',
            selectedPerson_settleInfoArray: {},
        };

        this.personNameBox_click = this.personNameBox_click.bind(this);

        console.log(params);

    }

    personNameBox_click(e) {

        let now_SettleFormInfo_array = Object.values( this.state.settleInfo_formInfoObj ).map(elem => elem['settleValueInfo']);
        let selectedPersonName = e.target.innerHTML;

        if(selectedPersonName === this.state.selectedPersonName_box){
            this.setState({selectedPersonName_box : '', selectedPerson_settleInfoArray: [], selectedPerson_settleSumPrice: 0});
            return;
        }

        let tmp_Array = [];
        now_SettleFormInfo_array.forEach( (elem, index) => {
            if(Object.keys(elem).indexOf(selectedPersonName) !== -1){
                tmp_Array.push( { meetcnt: index+1 ,price: elem[selectedPersonName] } );
            }
        });

        let selectedPerson_settleSumPrice = tmp_Array.reduce((acc, cur) => { return acc + parseInt( cur['price'] ); }, 0);
        //console.log(selectedPerson_settleSumPrice);
        this.setState({selectedPersonName_box: selectedPersonName});
        this.setState({selectedPerson_settleInfoArray: tmp_Array});
        this.setState({selectedPerson_settleSumPrice: selectedPerson_settleSumPrice});
    }

    AccountCopySuccess(){
        document.getElementById("AccountCopySuccess_alertModal").style.display = 'block';
        Sleep.sleep_func(1000).then( () => {
            document.getElementById("AccountCopySuccess_alertModal").style.display = 'none';
        });
        //console.log('asd');
    }
    componentDidMount(){
        window.scroll(0, 0);
        let BackBtn_flag = ( this.props.appMoveInfo['nowPage'] === '/history' ) ? this.setState({backBtn_flag: true}) : this.setState({backBtn_flag: false});
        //console.log('BackBtn_flag : ', BackBtn_flag);

        let keyInfo_splitArray = this.state.settleKey_info.split('&&');

        //* 저장된 정산결과 내용이 비회원 유저가 작성한 경우,
        if(keyInfo_splitArray[0] === 'nouser'){

            let access_key = this.state.settleKey_info;
            //console.log('nouser access_key : ', access_key);

            Fetch.fetch_api('nousersettle/'+access_key, 'GET', null).then(res => {
                //console.log(res);
                if(res.toString().trim().indexOf('Error') !== -1){
                    this.setState({settleInfo_errorFlag: true});
                    console.log("(!) 존재하지 않는 URL 파라미터");
                }

                if(res['result'] === 'success'){
                    this.setState({settleInfo_errorFlag: false});

                    let settleInfo_obj = res['settleInfo'];
                    let settleBankInfo = settleInfo_obj['bank_info'];

                    if(settleBankInfo){
                        let bank_index = Object.values( this.state.bankInfo_obj ).findIndex(elem => elem['code'] === settleBankInfo['bank_code'] );
                        let bank_name = Object.values ( this.state.bankInfo_obj )[bank_index]['name'];
                        let tmp_obj = Object.assign(settleBankInfo, {
                            bank_num: crypto.decrypt_account(settleBankInfo.bank_num),
                            bank_name: bank_name,
                        });
                        this.setState({settleInfo_bank: tmp_obj});
                    }


                    let settleInnerInfo = JSON.parse( res['settleInfo']['settle_info'] );
                    //console.log(settleInnerInfo);

                    let settleInnerForm_cnt = Object.keys(settleInnerInfo).length;

                    let settleTitle = settleInfo_obj['settle_title'];

                    let tmp_personName_array = [], tmp_personValue_array = [];
                    Object.values(settleInnerInfo).forEach( elem => {
                            tmp_personName_array = tmp_personName_array.concat(Object.keys( elem['settleValueInfo'] ));
                            tmp_personValue_array = tmp_personValue_array.concat(Object.values(elem['settleValueInfo']));
                    });

                    //* 키값 중복되는 객체 병합( ==> reduce )
                    //* 결과 obj = { 이름1: 총 금액1, 이름2 : 총 금액2, .... }
                    let personSettleInfo_obj = tmp_personName_array.map( ( elem, index ) => {
                        let tmp_obj = {name: elem, value: tmp_personValue_array[index]};
                        return tmp_obj;
                    }).reduce( ( acc, cur ) => {
                            let curValue = ( Object.keys(acc).indexOf( cur['name'] ) !== -1 ) ? acc[cur['name']] + cur['value'] : cur['value'];
                            acc[cur['name']] = curValue;
                            return acc;
                        }, {});
                    //console.log(personSettleInfo_obj);

                    this.setState({
                                    settleInfo_title: settleTitle,
                                    settleInfo_formCnt: settleInnerForm_cnt,
                                    settleInfo_formInfoObj : settleInnerInfo,
                                    settleInfo_sumValueObj : personSettleInfo_obj,
                                    settleInfo_personArray: Object.keys( personSettleInfo_obj ),
                                    selectedPersonArray : Object.keys( personSettleInfo_obj ),
                                    settleInfo_sumPrice: Object.values( personSettleInfo_obj ).reduce( ( acc, cur ) => acc + cur ).toLocaleString(),
                                 });
                }
            });
        }

        //* 회원 유저의 정산결과,
        else{
            let access_key = crypto.base64_denc(this.state.settleParam);
            access_key = crypto.decrypt_account(access_key);
            let get_param = access_key.split('&&')[1];
            let userName = access_key.split('&&')[0];
            this.setState({settleOwnerName: userName});
            //console.log(access_key);
            Fetch.fetch_api("settle/"+get_param, 'GET', null).then(res => {

                if(res['result'].toString() === 'success'){
                    this.setState({settleInfo_errorFlag: false});

                    let settleInnerInfo = JSON.parse( res['settleInfo'] );
                    let settleBankInfo = res['settleBankInfo'];

                    if(settleBankInfo){
                        let bank_index = Object.values( this.state.bankInfo_obj ).findIndex(elem => elem['code'] === settleBankInfo['bank_code'] );
                        let bank_name = Object.values ( this.state.bankInfo_obj )[bank_index]['name'];
                        let tmp_obj = Object.assign(settleBankInfo, {
                             bank_num: crypto.decrypt_account(settleBankInfo.bank_num),
                             bank_name: bank_name,
                        });
                        this.setState({settleInfo_bank: tmp_obj});
                    }

                    let settleInnerForm_cnt = Object.keys(settleInnerInfo).length;

                    let settleTitle = res['settleTitle'];

                    let tmp_personName_array = [], tmp_personValue_array = [];
                    Object.values(settleInnerInfo).forEach( elem => {
                        tmp_personName_array = tmp_personName_array.concat(Object.keys( elem['settleValueInfo'] ));
                        tmp_personValue_array = tmp_personValue_array.concat(Object.values(elem['settleValueInfo']));
                    });

                    //* 키값 중복되는 객체 병합( ==> reduce )
                    //* 결과 obj = { 이름1: 총 금액1, 이름2 : 총 금액2, .... }
                    let personSettleInfo_obj = tmp_personName_array.map( ( elem, index ) => {
                        let tmp_obj = {name: elem, value: tmp_personValue_array[index]};
                        return tmp_obj;
                    }).reduce( ( acc, cur ) => {
                        let curValue = ( Object.keys(acc).indexOf( cur['name'] ) !== -1 ) ? acc[cur['name']] + cur['value'] : cur['value'];
                        acc[cur['name']] = curValue;
                        return acc;
                    }, {});
                    //console.log(personSettleInfo_obj);

                    this.setState({
                        settleInfo_title: settleTitle,
                        settleInfo_formCnt: settleInnerForm_cnt,
                        settleInfo_formInfoObj : settleInnerInfo,
                        settleInfo_sumValueObj : personSettleInfo_obj,
                        settleInfo_personArray: Object.keys( personSettleInfo_obj ),
                        selectedPersonArray : Object.keys( personSettleInfo_obj ),
                        settleInfo_sumPrice: Object.values( personSettleInfo_obj ).reduce( ( acc, cur ) => acc + cur ).toLocaleString(),
                    });

                }
            });
        }

    }
    render() {
        let selectedPerson_settleInfoLayout_style = {display: (this.state.selectedPersonName_box.length > 0) ? 'block' : 'none'}
        return (
            <div id="SettleResultPage_layout">
                <br/>

                <div id="SettleResultPage_titleLogo" onClick={()=>location.href='/'}>
                        <img id="title_icon" src="/img/AppLogo2-neon.png" />
                        모두의정산
                </div>

                <div id="SettleResultPage_title">
                    {
                        ( this.state.backBtn_flag )
                        ? <Link to={"/history"}>
                            <div id="BackBtn">
                               <img src="/img/back-arrow.png"/>
                            </div>
                         </Link>
                         : ''
                    }

                    {
                        ( this.state.settleOwnerName )
                        ? <font className="bold"><font id="settleOwnerName">{this.state.settleOwnerName}<font id="settleOwnerConnecter"> 님의</font></font> 정산결과</font>
                        : <font className="bold">정산결과</font>
                    }
                </div>

                <div id="SettleResultPage_content">
                    {
                        ( this.state.settleInfo_errorFlag )
                        ? <div>존재하지않는 정산페이지 입니다.</div>
                        :
                            <div>
                                <div className="srp_subTitleContent">
                                    <div className="srp_subTitleBox">모임명</div>
                                    <div className="srp_subTitle_value">{this.state.settleInfo_title}</div>
                                </div>
                                <div className="srp_subTitleContent">
                                    <div className="srp_subTitleBox">총 모임차수</div>
                                    <div className="srp_subTitle_value">{this.state.settleInfo_formCnt}차</div>
                                </div>
                                <div className="srp_subTitleContent">
                                    <div className="srp_subTitleBox">총 정산금액</div>
                                    <div className="srp_subTitle_value">{this.state.settleInfo_sumPrice}원</div>
                                </div>
                                <div className="srp_subTitleContent">
                                    <div className="srp_subTitleBox">정산계좌</div>
                                    <div className="srp_subTitle_value account">
                                        <ClipboardButton id="AccountCopyBtn"
                                                         onSuccess={this.AccountCopySuccess}
                                                         data-clipboard-text={this.state.settleInfo_bank['bank_name']+" "+this.state.settleInfo_bank['bank_num']}>
                                            {this.state.settleInfo_bank['bank_name']+" "+this.state.settleInfo_bank['bank_num']}
                                        </ClipboardButton>

                                    </div>
                                </div>
                                <div className="srp_subTitleContent">
                                    <div className="srp_subTitleBox">정산 참여인원 <font className="bold">({this.state.settleInfo_personArray.length}명)</font></div>
                                    <br/>
                                    <div className="srp_subTitle_value personList">
                                        {this.state.settleInfo_personArray.map( ( elem, index ) => {
                                            return <div onClick={this.personNameBox_click}
                                                        className={
                                                            ( this.state.selectedPersonName_box === elem )
                                                            ? "srp_personBox"
                                                            : "srp_personBox uncheck"
                                                        }
                                                        key={index} id={ "personBox_"+index } >
                                                        {elem}
                                                   </div>
                                        })}
                                    </div>
                                </div>
                                <div id="selectedPerson_settleInfoLayout" style={selectedPerson_settleInfoLayout_style}>
                                    {
                                        (this.state.selectedPerson_settleInfoArray.length > 0)
                                        ?
                                            this.state.selectedPerson_settleInfoArray.map( (elem, index)=> {
                                                return <div className="selectedPerson_infoLine" key={index}>
                                                            <div className="selectedPerson_info meetcnt">{elem['meetcnt']}차</div>
                                                            <div className="selectedPerson_info price">{elem['price'].toLocaleString()}원</div>
                                                       </div>;
                                            })
                                        : ''
                                    }
                                    <div id="personSettle_sumPrice_layout">
                                        {
                                            (this.state.selectedPerson_settleInfoArray.length > 0) 
                                            ? 
                                                <div id="personSettle_sumPrice_box">
                                                    <span><font className="bold">*</font>합계</span>
                                                    <div id="personSettle_sumPrice_value">{this.state.selectedPerson_settleSumPrice.toLocaleString()}원</div>
                                                </div>
                                            : ''    
                                        }
                                    </div>
                                </div>

                                <div id="AccountCopySuccess_alertModal">계좌복사 완료</div>
                                <SettleResultForm
                                    selectedPersonName={this.state.selectedPersonName_box}
                                    settleFormInfo={this.state.settleInfo_formInfoObj}
                                />

                            </div>

                    }


                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    //console.log('redux store - pageChangeInfo : ',state['pageChange']);
    //console.log(state['pageChange']);
    return{
        appMoveInfo : state['pageChange'],
    };

};

SettleResultPage = connect(mapStateToProps, null)(SettleResultPage);

export default SettleResultPage;