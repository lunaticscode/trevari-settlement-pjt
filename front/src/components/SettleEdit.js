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
            settleMinUnit : 1,
            settleResultNoti : '',
        };
        this.selectPerson_box = this.selectPerson_box.bind(this);
        this.settleSum_input = this.settleSum_input.bind(this);
        this.select_SettleCase = this.select_SettleCase.bind(this);
        this.personSettle_input = this.personSettle_input.bind(this);
        this.SettleEditCom = this.SettleEditCom.bind(this);
        this.select_settleMinUnit = this.select_settleMinUnit.bind(this);
    }

    selectPerson_box(e){
        let selectStatus = ( e.target.classList.toString().indexOf('uncheck') !== -1 ) ? false : true;
        let selectPersonName = e.target.innerText;
        let tmp_array = this.state.selectedPersonList.slice();
        if( selectStatus ) {
            e.target.classList.add("uncheck");
            tmp_array.splice(tmp_array.indexOf(selectPersonName), 1);
            if( Object.keys( this.state.person_settleInfo_obj).indexOf(selectPersonName) !== -1 ){
                let tmp_obj = this.state.person_settleInfo_obj;
                delete tmp_obj[selectPersonName];
                this.setState({person_settleInfo_obj : tmp_obj});
                this.setState({ settleResultNoti: ( Object.keys(tmp_obj).length > 0) ? Object.values(tmp_obj).reduce( ( acc, cur ) => acc+cur ) : 0 });
            }
        }
        else{
            e.target.classList.remove("uncheck");
            tmp_array.push(selectPersonName);
        }
        this.setState({selectedPersonList : tmp_array});

        console.log(tmp_array);
    }

    settleSum_input(e){
        let input_value = e.target.value.toString().replace(/[^0-9]/g,'');
        input_value = input_value.replace(/,/g,'');
        e.target.value = input_value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.setState({settle_sum : ( input_value.toString().length > 0 ) ? parseInt( input_value.toString().replace(/,/g, '') ) : 0});

    }

    select_SettleCase(e){
        let settleCase_index = e.target.getAttribute("id").toString().split('settleCase')[1];
        this.setState({settleCase : settleCase_index});

        if(settleCase_index == '1'){
            let personSettle_inputLayout = document.getElementsByClassName("EditForm_input2");
            let tmp_obj = this.state.person_settleInfo_obj;
            if(personSettle_inputLayout.length > 0){
                for(let i = 0; i<personSettle_inputLayout.length; i++){
                    let personSettle_value = personSettle_inputLayout[i].value.toString().replace(/,/g, '');
                    console.log(personSettle_value);
                    tmp_obj[ this.state.selectedPersonList[i] ] = parseInt( personSettle_value );
                }
                this.setState({person_settleInfo_obj : tmp_obj});
                this.setState({ settleResultNoti: ( Object.keys(tmp_obj).length > 0) ? Object.values(tmp_obj).reduce( ( acc, cur ) => acc+cur ) : 0 });
            }
        }
    }

    select_settleMinUnit(e) {
        let minUnit_value = parseInt( e.target.value.toString().split("원")[0].replace(/,/g, '') );
        console.log(minUnit_value);
        this.setState({settleMinUnit : minUnit_value});
    }

    //* 개인별 정산 금액 직접 입력 이벤트,
    personSettle_input(e) {
        let input_value = e.target.value.toString().replace(/[^0-9]/g,'');
        input_value = input_value.replace(/,/g,'');
        e.target.value = input_value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        let person_Name = this.state.selectedPersonList[e.target.getAttribute("id")];
        let tmp_obj = Object.assign(this.state.person_settleInfo_obj, {
                            [person_Name] : parseInt( input_value ),
                        });
        this.setState({person_settleInfo_obj : tmp_obj});
        this.setState({ settleResultNoti: Object.values(tmp_obj).reduce( ( acc, cur ) => acc+cur ) });
    }

    SettleEditCom() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentDidMount() {
        this.setState({settleResultNoti : '0'});
    }

    render() {

        let settleCase_btns = document.getElementsByClassName("select_settleCase");
        for(var i = 0; i<settleCase_btns.length; i++){
            if(parseInt( this.state.settleCase ) === i ){
                settleCase_btns[i].classList.remove('uncheck');
            }else{ settleCase_btns[i].classList.add('uncheck'); }
        }

        let editLayout_style = {height: window.innerHeight + 'px'};

        //* state : settleCase 가 0 일 때 ( = 정산방식 N/1 선택 시 )
        let N1_PersonSettle_inputValue = ( this.state.selectedPersonList.length > 0 )
                ?  ( Math.floor( this.state.settle_sum / this.state.selectedPersonList.length / this.state.settleMinUnit ) * this.state.settleMinUnit ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : '0';

        let settleResult_textValue = this.state.settleResultNoti.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if( parseInt( this.state.settleCase ) == 0 ) {
            console.log("settle case ==>  n/1 ");
            settleResult_textValue = parseInt( N1_PersonSettle_inputValue.replace(/,/g, '') ) * this.state.selectedPersonList.length;
            settleResult_textValue = settleResult_textValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        let settleResultNoti_style = {
            marginLeft: '180px',
            color: ( this.state.settleResultNoti === this.state.settle_sum ) ? 'white'
                    : (this.state.settleResultNoti > this.state.settle_sum )
                        ? "rgb(255, 124, 140)" : "gray",
        };

        return (
            <div id="SettleEditLayout" style={editLayout_style}>
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox"><font className="bold">#</font> {parseInt( this.state.settleIndex ) + 1}차</div>
                    <div className="EditForm_title">{this.state.settleInfoObj['title']}</div>
                </div>
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox">모임 장소</div>
                    <input className="EditForm_input" placeholder="장소명 혹은 상호명 입력."/>
                </div>
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox"><font className="bold">*</font>{parseInt( this.state.settleIndex ) + 1}차 참석 인원 선택</div><br/>
                    <div id="EditForm_personList">
                    {this.state.settleInfoObj['personList'].map( (elem, index) => {
                        return <div key={"person_"+index} onClick={this.selectPerson_box} className="EditForm_personBox uncheck">{elem}</div>
                    })}
                    </div>
                </div>
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox"><font className="bold">*</font> 모임 비용</div>
                    <input className="EditForm_input" onChange={this.settleSum_input} placeholder={ parseInt( this.state.settleIndex )+1 + "차 모임비용 입력."}/>원
                        <br/>
                    <div className="EditForm_titleBox settleCase">정산방식 선택</div>
                    <div onClick={this.select_SettleCase} id="settleCase0" className="select_settleCase">N/1</div>
                    <div onClick={this.select_SettleCase}  id="settleCase1" className="select_settleCase">직접 작성</div>
                    <br/>
                    <div className="EditForm_titleBox settleCase">최소 단위</div>
                    <select id="EditForm_selectBox" onChange={this.select_settleMinUnit}>
                        { new Array(   ( this.state.settle_sum.toString().length > 1 ) ? this.state.settle_sum.toString().length - 1 : this.state.settle_sum.toString().length )
                                    .fill("원").map( (elem,index) => {
                                return <option className="minUnit_option" key={index}>{Math.pow(10, index).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+elem}</option>
                        })}
                    </select>
                </div>

                <div id="SettlePerson_input_layout">{this.state.selectedPersonList.map( (elem, index) => {
                    return <div key={"personSettle_"+index}  className="EditForm_personSettle">
                                <div>
                                    {elem} <input id={index} onChange={this.personSettle_input}
                                                  className="EditForm_input2"
                                                  value={ ( this.state.settleCase == 0 ) ? N1_PersonSettle_inputValue : this.value }
                                            />&nbsp;&nbsp;원
                                </div>
                           </div>
                })}
                </div>

                <div id="SettleResult_noti_layout" style={settleResultNoti_style}>합계&nbsp;&nbsp; { ( this.state.settleResultNoti  ) ? settleResult_textValue+'원' : ''}</div>
                <div id="SettleEditCom_btn" onClick={this.SettleEditCom}> 작성 완료 </div>

            </div>
        );



    }
}

