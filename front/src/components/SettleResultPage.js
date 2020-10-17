import React from 'react';
import '../styles/SettleResultPage.scss'
import crypto from '../CryptoInfo';
import Fetch from "../Fetch";
import SettleResultForm from "./SettleResultForm";
class SettleResultPage extends React.Component {
    constructor(props){
        super(props);
        const { params } = this.props.match;
        let settleResult_key_denc = crypto.base64_denc(params.id);
        settleResult_key_denc = crypto.decrypt_account(settleResult_key_denc);
        this.state={
            settleParam: params['id'],
            settleKey_info : settleResult_key_denc,
            settleInfo_errorFlag: true,
            settleInfo_title: '',
            settleInfo_formCnt: 0,
            settleInfo_sumPrice: 0,
            settleInfo_personArray: [],
            settleInfo_sumValueObj: {},
        };
        console.log(params);
    }
    componentDidMount(){
        let keyInfo_splitArray = this.state.settleKey_info.split('&&');

        //* 저장된 정산결과 내용이 비회원 유저가 작성한 경우,
        if(keyInfo_splitArray[0] === 'nouser'){
            let access_key = keyInfo_splitArray[1] + keyInfo_splitArray[2];
            access_key = crypto.encrypt_account(access_key);
            console.log('nouser access_key : ', access_key);

            Fetch.fetch_api('nousersettle/'+access_key, 'GET', null).then(res => {
                console.log(res);
                if(res.toString().trim().indexOf('Error') !== -1){
                    this.setState({settleInfo_errorFlag: true});
                    console.log("(!) 존재하지 않는 URL 파라미터");
                }

                if(res['result'] === 'success'){
                    this.setState({settleInfo_errorFlag: false});
                    let settleInfo_obj = res['settleInfo'];


                    let settleInnerInfo = JSON.parse( res['settleInfo']['settle_info'] );
                    console.log(settleInnerInfo);

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
                    console.log(personSettleInfo_obj);

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
            console.log(access_key);
            Fetch.fetch_api("settle/"+get_param, 'GET', null).then(res => {
                console.log(res);
                if(res['result'].toString() === 'success'){
                    this.setState({settleInfo_errorFlag: false});
                    let settleInnerInfo = JSON.parse( res['settleInfo'] );
                    console.log(settleInnerInfo);

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
                    console.log(personSettleInfo_obj);

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
        return (
            <div id="SettleResultPage_layout">
                <br/>
                <div id="SettleResultPage_titleLogo">
                    <img id="title_icon" src="/img/AppLogo.png" />
                    모두의정산
                </div>
                <div id="SettleResultPage_title"><font className="bold">정산결과</font></div>
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
                                    <div className="srp_subTitleBox">정산 참여인원 <font className="bold">({this.state.settleInfo_personArray.length}명)</font></div>
                                    <br/>
                                    <div className="srp_subTitle_value personList">
                                        {this.state.settleInfo_personArray.map( ( elem, index ) => {
                                            return <div className="srp_personBox uncheck" key={index} id={ "personBox_"+index } >
                                                        {elem}
                                                   </div>
                                        })}
                                    </div>
                                </div>

                                <SettleResultForm
                                    settleFormInfo={this.state.settleInfo_formInfoObj}
                                />

                            </div>

                    }


                </div>
            </div>
        );
    }
}

export default SettleResultPage;