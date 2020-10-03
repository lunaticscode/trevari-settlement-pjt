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
        }else{
            let modified_array = this.state.settleContent_people_Array.filter(elem => elem !== personName_text);
            this.setState({settleContent_people_Array: modified_array,});
            let tmp_obj = Object.assign(this.state.settleFormInfo, {
                personList: modified_array,
            });
            this.setState({settleFormInfo: tmp_obj});
        }

    }


    componentDidUpdate(prevProps, prevState) {
        if(prevProps.modalConfirm_result !== this.props.modalConfirm_result){
            if(this.props.modalConfirm_result === 'exec') {
                if(this.props.modalConfirm_title === 'personArray modify'){
                    let delete_target = this.state.settleContent_deleteTarget_person;
                    let modified_personArray = this.state.settleContent_people_Array.filter(elem => elem !== delete_target);
                    this.setState({settleContent_people_Array : modified_personArray,
                                   settleContent_deleteTarget_person : ''});
                    let tmp_obj = Object.assign(this.state.settleFormInfo, {
                        personList: modified_personArray,
                    });
                    this.setState({settleFormInfo: tmp_obj});
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
        let settleDetailForm_style = { height: window.innerHeight + 'px'};

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

              <div id="SettleDetailForm_layout" style={settleDetailForm_style}>
                    <SettleForm
                        FormInfo={this.state.settleFormInfo}
                        TestProps={this.state.settleFormInfo.formCnt}
                        TestProps2={this.state.settleFormInfo.title}
                        personList={this.state.settleContent_people_Array}
                    />
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