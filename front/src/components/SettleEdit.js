import React from 'react';
import "../styles/SettleEdit.scss"

export default class SettleEdit extends React.Component {
    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.state = {
            settleIndex : ( params ) ? params['id'] : -1,
            settleInfoObj : JSON.parse( localStorage.getItem("formInfo") ),
            selectedPersonList : [],
            settle_sum : 0, person_settleInfo_obj : {},
            settleCase : 0,
        };
        this.selectPerson_box = this.selectPerson_box.bind(this);
        this.settleSum_input = this.settleSum_input.bind(this);
        this.select_SettleCase = this.select_SettleCase.bind(this);
        this.personSettle_input = this.personSettle_input.bind(this);
    }

    selectPerson_box(e){
        let selectStatus = ( e.target.classList.toString().indexOf('uncheck') !== -1 ) ? false : true;
        let selectPersonName = e.target.innerText;
        let tmp_array = this.state.selectedPersonList.slice();
        if( selectStatus ) {
            e.target.classList.add("uncheck");
            tmp_array.splice(tmp_array.indexOf(selectPersonName), 1);
        }
        else{
            e.target.classList.remove("uncheck");
            tmp_array.push(selectPersonName);
        }
        this.setState({selectedPersonList : tmp_array});
        console.log(tmp_array);
    }

    settleSum_input(e){
        let input_price = e.target.value;
        let comma_price = ( input_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        this.setState({settle_sum : input_price.toString().replace(/,/g, '')});
    }

    select_SettleCase(e){
        let settleCase_index = e.target.getAttribute("id").toString().split('settleCase')[1];
        this.setState({settleCase : settleCase_index});

    }

    //* 개인별 정산 금액 직접 입력 이벤트,
    personSettle_input(e) {
        let input_settleValue = e.target.value;
        console.log(input_settleValue);
        let person_Name = this.state.selectedPersonList[e.target.getAttribute("id")];
        console.log(person_Name);
        let tmp_obj = Object.assign(this.state.person_settleInfo_obj, {
            [person_Name] : input_settleValue,
        });
        this.setState({person_settleInfo_obj : tmp_obj});
        console.log(tmp_obj);
    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentDidMount() {

    }

    render() {

        let settleCase_btns = document.getElementsByClassName("select_settleCase");
        for(var i = 0; i<settleCase_btns.length; i++){
            if(parseInt( this.state.settleCase ) === i ){
                settleCase_btns[i].classList.remove('uncheck');
            }else{ settleCase_btns[i].classList.add('uncheck'); }
        }

        let editLayout_style = {height: window.innerHeight + 'px'};
        return (
            <div id="SettleEditLayout" style={editLayout_style}>
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox"># {parseInt( this.state.settleIndex ) + 1}차</div>
                    <div className="EditForm_title">{this.state.settleInfoObj['title']}</div>
                </div>
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox">모임 장소</div>
                    <input className="EditForm_input" placeholder="장소명 혹은 상호명 입력."/>
                </div>
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox"><font className="bold">*</font> 참석 인원 선택</div><br/>
                    <div id="EditForm_personList">
                    {this.state.settleInfoObj['personList'].map( (elem, index) => {
                        return <div key={"person_"+index} onClick={this.selectPerson_box} className="EditForm_personBox uncheck">{elem}</div>
                    })}
                    </div>
                </div>
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox"><font className="bold">*</font> 모임 비용</div>
                    <input className="EditForm_input" onChange={this.settleSum_input} placeholder={ parseInt( this.state.settleIndex )+1 + "차 모임비용 입력."}/>
                        <br/>
                    <div className="EditForm_titleBox settleCase">정산방식 선택</div>
                    <div onClick={this.select_SettleCase} id="settleCase0" className="select_settleCase">N/1</div>
                    <div onClick={this.select_SettleCase}  id="settleCase1" className="select_settleCase">직접 작성</div>
                </div>
                <div>{this.state.selectedPersonList.map( (elem, index) => {
                    return <div key={"personSettle_"+index}  className="EditForm_personSettle">
                                <div>
                                    {elem} <input id={index} onChange={this.personSettle_input}
                                                  className="EditForm_input"
                                                  value={
                                                      ( parseInt( this.state.settleCase ) === 0 )
                                                      ? parseInt( this.state.settle_sum.toString().replace(/,/g, '') ) / this.state.selectedPersonList.length
                                                          : this.value
                                                  }
                                            />
                                </div>
                           </div>;

                })}</div>

            </div>
        );
    }
}

