import React from 'react';
import "../styles/Settle.scss";
import '../styles/App.scss';
import {Link} from "react-router-dom";
import SettleForm from "./SettleForm";
import {commonModal_open, mask_open} from "../actions";
import {connect} from "react-redux";
import Sleep from "../Sleep";

class Settle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMeetCnt: -1,
            settleFormTitle : '',
            settleContent_locationInfo_Array : [],
            settleContent_sumAmount_Array : [],
            settleContent_people_Array : [],
            settleContent_personName_Text: '',
            settleContent_deleteTarget_person: '',
            settleFormInfo : { title: '', formCnt: 0, personList: [], },
        };
        this.selectMeetCnt = this.selectMeetCnt.bind(this);
        this.inputFormTitle = this.inputFormTitle.bind(this);
        this.inputPersonName_keyup = this.inputPersonName_keyup.bind(this);
        this.inputPersonName_change = this.inputPersonName_change.bind(this);
        this.personName_pop = this.personName_pop.bind(this);
    }

    inputFormTitle(e) {
        let titleText = e.target.value;
        this.setState({ settleFormTitle: titleText, });
        this.state.settleFormInfo['title'] = titleText;
        localStorage.setItem("formInfo", JSON.stringify(this.state.settleFormInfo));
    }

    foldUpDown(e) {
        console.log('click fold icon');
        let MainSettleForm = document.getElementById("SettleFormLayout");
        let nowForm_state = MainSettleForm.classList.value;
        if( nowForm_state === '' ){ MainSettleForm.classList.add('moveUp'); }
        else{ MainSettleForm.classList.remove('moveUp'); }

        if(e.target.classList.value === '' || e.target.classList.value==='rotate_2'){
            e.target.classList.remove('rotate_2');
            e.target.classList.add('rotate_1');
        }else{
            e.target.classList.remove('rotate_1');
            e.target.classList.add('rotate_2');
        }
    }

    selectMeetCnt(e) {
        let selectedMeetCntIndex = e.target.selectedIndex;
        this.state.settleFormInfo['formCnt'] = selectedMeetCntIndex;
        let now_settleFormInfo = Object.assign(this.state.settleFormInfo, {
            formCnt: selectedMeetCntIndex,
        });
        this.setState({ selectedMeetCnt: selectedMeetCntIndex, settleFormInfo :  now_settleFormInfo });
        localStorage.setItem("formInfo", JSON.stringify(this.state.settleFormInfo));
        document.getElementById("SettleFormLayout").classList.add('moveUp');
        document.getElementById("arrow_icon_img").classList.remove('rotate_2');
        document.getElementById("arrow_icon_img").classList.add('rotate_1');
    }

    inputPersonName_change(e) {
        this.setState({settleContent_personName_Text: e.target.value.toString().trim(),})
    }

    inputPersonName_keyup(e) {
            let personName = this.state.settleContent_personName_Text;
            if(e.keyCode === 13 && personName.length > 0){
                if(this.state.settleContent_people_Array.indexOf(this.state.settleContent_personName_Text.toString().trim()) !== -1) {
                    //* Alert Modal 추가 예정.
                    return;
                }else{
                    //this.state.settleContent_people_Array.push(this.state.settleContent_personName_Text.toString().trim());
                    const { settleContent_people_Array } = this.state;
                    this.setState({
                        settleContent_people_Array: settleContent_people_Array.concat(this.state.settleContent_personName_Text.toString().trim()),
                    });

                    this.setState({settleContent_personName_Text : '',});

                    e.target.value = '';

                    this.state.settleFormInfo['personList'] = this.state.settleContent_people_Array;
                    let tmp_obj = Object.assign(this.state.settleFormInfo, {
                        personList: settleContent_people_Array.concat(this.state.settleContent_personName_Text.toString().trim()),
                    });
                    this.setState({settleFormInfo: tmp_obj});
                    localStorage.setItem("formInfo", JSON.stringify(this.state.settleFormInfo));
                }
            }
    }

    personName_pop(e) {
        let personName_text = e.target.getAttribute("value");
        this.setState({settleContent_deleteTarget_person: personName_text});
        let now_settleCheckPersons = document.getElementsByClassName("innerForm_personName selected");
        let now_settleCheck_indexArray = [];

        for(let i = 0; i<now_settleCheckPersons.length; i++) {
            if(now_settleCheckPersons[i].innerHTML.toString().trim() === personName_text){
                now_settleCheck_indexArray.push( parseInt( now_settleCheckPersons[i].getAttribute("value").split("settle_")[1] )+1+"차");
            }
        }
        if(now_settleCheck_indexArray.length > 0) {
            let already_settleCheck_index = now_settleCheck_indexArray.join(', ');
            let modal_text = "선택하신 ["+personName_text+"] 님은 이미 작성된 " + already_settleCheck_index + " 정산 인원에 포함되어있습니다.그래도 삭제하시겠습니까?";

            window.scroll(0,0); document.body.style.overflow = 'hidden';
            this.props.commonModalOpen("personArray modify", modal_text, "negative");
            document.getElementById("Mask_layout").style.height = window.innerHeight +'px';
            Sleep.sleep_func(250).then(()=>this.props.maskOpen());
            //* ----> CommonModal.js 모달 오픈.
            //* [확인] 버튼 클릭 시, 현재 Settle.js props 업데이트 ---> componentDidUpdate() 에서 정산인원 조정 로직 실행.
        }else{
            let modified_array = this.state.settleContent_people_Array.filter(elem => elem !== personName_text);
            this.setState({settleContent_people_Array: modified_array,});
            let tmp_obj = Object.assign(this.state.settleFormInfo, {
                personList: modified_array,
            });
            this.setState({settleFormInfo: tmp_obj});
            localStorage.setItem("formInfo", JSON.stringify(this.state.settleFormInfo));
        }

    }


    componentDidUpdate(prevProps, prevState) {
        if(prevProps.modalConfirm_result !== this.props.modalConfirm_result){

            //* CommonModal.js 에서 [확인] 버튼 클릭 시,
            if(this.props.modalConfirm_result === 'exec') {
                //* 모달 케이스가 정산 인원 수정일 경우,
                if(this.props.modalConfirm_title === 'personArray modify'){

                    //* 정산 공통내용 settleFormInfo 내용 수정.
                    let delete_target = this.state.settleContent_deleteTarget_person;
                    let modified_personArray = this.state.settleContent_people_Array.filter(elem => elem !== delete_target);
                    this.setState({settleContent_people_Array : modified_personArray,
                                   settleContent_deleteTarget_person : ''});
                    let tmp_obj = Object.assign(this.state.settleFormInfo, {
                        personList: modified_personArray,
                    });
                    this.setState({settleFormInfo: tmp_obj});

                    //* 정산 공통 정보 내용 재저장.
                    localStorage.setItem("formInfo", JSON.stringify(this.state.settleFormInfo));

                    //* LocalStorage에 저장된 savedSettle_{index}의 ['settleValueInfo'] 수정.
                    Object.keys(localStorage).forEach( (elem, index) => {
                        if(elem.indexOf('savedSettle_') !== -1
                            && Object.keys( JSON.parse(localStorage.getItem(elem))['settleValueInfo'] ).indexOf(delete_target) !== -1 ) {
                                let saveKey_name = elem.toString();
                                //console.log(saveKey_name);

                                let settleValueInfo_obj = JSON.parse(localStorage.getItem(elem))['settleValueInfo'];
                                //console.log('init_settleValueInfo_obj', settleValueInfo_obj);
                                let settleSum_value = JSON.parse(localStorage.getItem(elem))['settleSum'];
                                //* 정산 공통 내용에서 선택한 인원(delete_target) 삭제.
                                delete settleValueInfo_obj[delete_target];

                                //console.log('settlveValueInfo_modifed_obj : ',settleValueInfo_obj);
                                let modified_obj_length = Object.keys(settleValueInfo_obj).length;
                                if(modified_obj_length > 0){
                                    for(let key in settleValueInfo_obj){
                                        settleValueInfo_obj[key] = Math.floor( settleSum_value / modified_obj_length );
                                    }
                                    let tmp_obj = Object.assign( JSON.parse( localStorage.getItem(elem) ), {
                                        settleValueInfo: settleValueInfo_obj,
                                        settleMinUnit : 1,
                                    });
                                    console.log(tmp_obj);

                                    localStorage.setItem(saveKey_name, JSON.stringify(tmp_obj));
                                }
                                else if(modified_obj_length === 0){
                                    //* 남아있는 정산 인원 없을 경우, 해당 아이템 삭제.
                                    localStorage.removeItem(saveKey_name);
                                }

                        }
                    });



                    //* 각 모임차수 정산 내용 재저장.

                }
            }
        }
    }

    componentDidMount() {

        let savedInfo = null;
        ( localStorage.getItem("formInfo") )  ? savedInfo = JSON.parse( localStorage.getItem("formInfo") ) : savedInfo = null;
        if(savedInfo) {
            this.setState({
                settleFormTitle : savedInfo['title'],  settleContent_people_Array : savedInfo['personList'],
                settleFormInfo : savedInfo,
            });
        }

        let meetCnt_selectElem = document.getElementById("MeetCnt_select");
        if( savedInfo && parseInt( savedInfo['formCnt'] ) > 0 ){
            meetCnt_selectElem.children[parseInt( savedInfo['formCnt'] )].setAttribute("selected", '');
            this.setState({selectedMeetCnt: savedInfo['formCnt']});
        }

    }

    render() {



        //* 모임 차수가 1개 이상일때만, 최종 정산 버튼 visible 처리.

        let SettleFinal_submitBtn_style =
            {display : ( JSON.parse( localStorage.getItem("formInfo") )['formCnt'] ) ? 'block' : 'none', };
        let formCnt_allCnt = JSON.parse(localStorage.getItem("formInfo"))['formCnt'];
        let now_completeFormCnt = Object.keys(localStorage).filter(elem => elem.toString().indexOf('savedSettle_') !== -1).length;

        return (
          <div id="SettleLayout">
              <div id="SettleFormLayout">
                 <div id="SettleContentLayout">
                     <div>
                         <div className="inputTitle">모임 이름</div>
                         <input  placeholder="15자 이내"
                                 onChange={this.inputFormTitle}
                                 className="inputForm_title name"
                                 defaultValue={ ( localStorage.getItem("formInfo" ) )? JSON.parse( localStorage.getItem("formInfo") ).title : '' }
                         />
                         <img id="arrow_icon_img" onClick={this.foldUpDown} src="/img/arrow_icon.png" />
                     </div>
                     <br/>
                     <div>
                         <div className="inputTitle">참석자 이름</div>
                         <input className="inputForm_personName" onChange={this.inputPersonName_change} onKeyUp={this.inputPersonName_keyup} placeholder="이름 입력 후 Enter" />
                         <br/>
                         <div id="personName_Layout">
                             {
                                 this.state.settleContent_people_Array.map((elem, index) => {
                                 return <div key={"person_"+index}  value={elem} className="personName_box">
                                            <img key={"person_"+index} onClick={this.personName_pop} value={elem} src="/img/delete_icon_white.png" className="iconBox-right small"/>
                                            {elem}
                                        </div>
                                 })
                             }
                         </div>
                     </div>
                     <div>
                         <div className="inputTitle">모임 차수 선택</div>
                         <select onChange={this.selectMeetCnt} id="MeetCnt_select">
                             <option>선택</option>
                             <option>1차</option><option>2차</option><option>3차</option>
                             <option>4차</option><option>5차</option><option>6차</option>
                         </select>
                     </div>
                 </div>
              </div>

              <div id="SettleDetailForm_layout">
                    <SettleForm
                        FormInfo={this.state.settleFormInfo}
                        TestProps={this.state.settleFormInfo.formCnt}
                        TestProps2={this.state.settleFormInfo.title}
                        personList={this.state.settleContent_people_Array}
                    />
                    <div id="SettleFinal_submit_btn"
                         className={ (formCnt_allCnt <= now_completeFormCnt) ? "grant" : ""}
                         style={SettleFinal_submitBtn_style}>
                        최종정산
                    </div>
              </div>

          </div>

        );
    }
}

let mapStateToProps = (state) => {
    return {
        modalConfirm_title: state.commonModal.title,
        modalConfirm_result : state.commonModal.resultSign,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        commonModalOpen: (title, text, mood) => dispatch(commonModal_open(title, text, mood)),
        maskOpen: () => dispatch(mask_open()),
    }
};
Settle = connect(mapStateToProps, mapDispatchToProps)(Settle);

export default Settle;