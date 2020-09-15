import React from 'react';
import "../styles/Settle.scss";
import '../styles/App.scss';
import {Link} from "react-router-dom";
import SettleForm from "./SettleForm";
export default class Settle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMeetCnt: -1,
            settleFormTitle : '',
            settleContent_locationInfo_Array : [],
            settleContent_sumAmount_Array : [],
            settleContent_people_Array : [],
            settleContent_personName_Text: '',
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
        //console.log(this.state.settleFormInfo);
    }


    selectMeetCnt(e) {
        let selectedMeetCntIndex = e.target.selectedIndex;
        this.setState({ selectedMeetCnt: selectedMeetCntIndex, });
        this.state.settleFormInfo['formCnt'] = selectedMeetCntIndex;
        //console.log(this.state.settleFormInfo);
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
                    this.state.settleContent_people_Array.push(this.state.settleContent_personName_Text.toString().trim());
                    this.setState({settleContent_personName_Text : '',});
                    e.target.value = '';
                    this.state.settleFormInfo['personList'] = this.state.settleContent_people_Array;
                    //console.log(this.state.settleFormInfo);
                }
            }

    }

    personName_pop(e) {
        let personName_text = e.target.innerHTML;
        let modified_array = this.state.settleContent_people_Array.filter(elem => elem !== personName_text);
        this.setState({settleContent_people_Array: modified_array,});
        this.state.settleFormInfo['personList'] = modified_array;
        //console.log(this.state.settleFormInfo);
    }


    componentDidUpdate(prevProps, prevState) {

    }

    componentDidMount() {

    }

    render() {
        return (
          <div id="SettleLayout">
              <div id="SettleFormLayout">
                 <div id="SettleContentLayout">
                     <div>
                         <div className="inputTitle">모임 이름</div>
                         <input  placeholder="15자 이내" onChange={this.inputFormTitle} className="inputForm_title" />
                     </div>
                     <br/>
                     <div>
                         <div className="inputTitle">참석자 이름</div>
                         <input className="inputForm" onChange={this.inputPersonName_change} onKeyUp={this.inputPersonName_keyup} placeholder="이름 입력 후 Enter" />
                         <br/>
                         <div id="personName_Layout">
                             {
                                 this.state.settleContent_people_Array.map((elem, index) => {
                                 return <div key={"person_"+index} onClick={this.personName_pop} className="personName_box">
                                            {elem}
                                        </div>;
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
                    />
              </div>

          </div>

        );
    }
}

