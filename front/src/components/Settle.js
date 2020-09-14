import React from 'react';
import "../styles/Settle.scss";
import '../styles/App.scss';
import {Link} from "react-router-dom";
export default class Settle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMeetCnt: -1,
            settleContentArray : [],
            settleFormTitle : '',
            settleContent_locationInfo_Array : [],
            settleContent_sumAmount_Array : [],
            settleContent_people_Array : [],
        };
        this.selectMeetCnt = this.selectMeetCnt.bind(this);
        this.inputFormTitle = this.inputFormTitle.bind(this);
    }

    inputFormTitle(e) {
        let titleText = e.target.value;
        this.setState({settleFormTitle: titleText,});
    }

    selectMeetCnt(e) {
        let selectedMeetCntIndex = e.target.selectedIndex;
        this.setState({
            selectedMeetCnt: selectedMeetCntIndex,
            settleContentArray : new Array(selectedMeetCntIndex).fill(0),
            });
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
                         <input  placeholder="10자 이내" onChange={this.inputFormTitle} className="inputForm" />
                     </div>
                     <br/>
                     <div>
                         <div className="inputTitle">모임 차수 선택</div>
                         <select onChange={this.selectMeetCnt} id="MeetCnt_select">
                             <option>선택</option>
                             <option>1차</option><option>2차</option>
                             <option>3차</option><option>4차</option>
                             <option>5차</option><option>6차</option>
                         </select>
                     </div>
                        <br/>

                     <div id="SettleDetailForm_layout">
                         {this.state.settleContentArray.map( (elem, index) => {
                             return <div key={index} className="settleInputForm" id={"Form_"+index}>
                                        <div className="inputFormContent">
                                            <div>
                                                {this.state.settleFormTitle} &nbsp;<font className="bold">[</font>{index+1}차<font className="bold">]</font>
                                                <div className="iconBox-right"><img className="small-icon" src="/img/down-arrow.png"/></div>
                                                <div className="innerForm-box">
                                                    <div className="innerForm-index">장소</div>
                                                    <input className="inner-inputForm"/>
                                                </div>
                                                <div className="innerForm-box">
                                                    <div className="innerForm-index">총 금액</div>
                                                    <input className="inner-inputForm"/>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                         })}
                     </div>

                 </div>
              </div>
          </div>
        );
    }
}

