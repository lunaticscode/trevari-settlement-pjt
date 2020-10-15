import React from 'react';
import "../styles/SettleEdit.scss"
import {mask_open, mask_close, infomodal_open} from "../actions";
import {connect} from "react-redux";
import Sleep from "../Sleep";
class SettleEdit extends React.Component {
    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.state = {
            settleIndex : ( params ) ? params['id'] : -1,

            //* 전체 정산 정보가 이전에 등록 되어있는 경우, localStorage 값으로 대체.
            common_settleInfoObj : ( localStorage.getItem("formInfo") )
                                        ? JSON.parse( localStorage.getItem("formInfo") ) : '',

            //* 현재 모임차수 정산 정보가 이전에 등록 되어있는 경우, localStorage 값으로 대체.
            savedSettleInfo : ( localStorage.getItem("savedSettle_"+(parseInt( params['id']) +1)) )
                                ? JSON.parse(localStorage.getItem("savedSettle_"+(parseInt( params['id'])+1) )) : null,

            selectedPersonList : [],
            settle_sum : 0, person_settleInfo_obj : {},
            settleCase : 0,
            settleMinUnit : 1,
            settleResultNoti : '',
            settleEditCom_flag : false,
            settleShopname : '',
        };
        this.selectPerson_box = this.selectPerson_box.bind(this);
        this.settleSum_input = this.settleSum_input.bind(this);
        this.select_SettleCase = this.select_SettleCase.bind(this);
        this.personSettle_input = this.personSettle_input.bind(this);
        this.SettleEditCom = this.SettleEditCom.bind(this);
        this.select_settleMinUnit = this.select_settleMinUnit.bind(this);
        this.input_Shopname = this.input_Shopname.bind(this);
        this.personAllSelectBtn_click = this.personAllSelectBtn_click.bind(this);
    }

    input_Shopname(e) {
        let shopName = e.target.value;
        this.setState({settleShopname : shopName});
    }

    //* 정산인원 전체선택 버튼( input [type = checkbox] ) 클릭 이벤트.
    personAllSelectBtn_click(e) {
        console.log(e.target.checked);
        let personName_boxs = document.getElementById("EditForm_personList").children;
        let allSelectBtn_label = document.getElementById("EditForm_personAllSelect_label");
        if(e.target.checked == true) {
            let init_personArray = this.state.common_settleInfoObj['personList'];
            for(let i = 0; i<personName_boxs.length; i++){ personName_boxs[i].classList.remove("uncheck"); }
            this.setState({selectedPersonList: init_personArray});
            allSelectBtn_label.style.color = 'powderblue';
            e.target.setAttribute("checked", '');
        }
        else{
            for( let i = 0; i<personName_boxs.length; i++ ){ personName_boxs[i].classList.add("uncheck"); }
            this.setState({selectedPersonList: []});
            allSelectBtn_label.style.color = 'gray';
            e.target.removeAttribute("checked");
        }
    }

    //* 정산인원 리스트 내부, 각 인원들 [NAME] 박스 클릭 이벤트.
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

        //* 정산인원 선택에 따른, 전체인원 체크 버튼 상태 변경.
        let allSelectBox_elem = document.getElementById("EditForm_personAllSelect_btn");
        let allSelectBoxLabel_elem = document.getElementById("EditForm_personAllSelect_label");
        if(tmp_array.length === this.state.common_settleInfoObj['personList'].length){
            allSelectBox_elem.setAttribute("checked", '');
            allSelectBoxLabel_elem.style.color = 'powderblue';
        }
        else{
            allSelectBox_elem.removeAttribute("checked");
            allSelectBoxLabel_elem.style.color = 'gray';
        }
    }

    //* 해당 차수 모임 비용 입력 이벤트.
    settleSum_input(e){
        let input_value = e.target.value.toString().replace(/[^0-9]/g,'');
        input_value = input_value.replace(/,/g,'');
        e.target.value = input_value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.setState({settle_sum : ( input_value.toString().length > 0 ) ? parseInt( input_value.toString().replace(/,/g, '') ) : 0});
        if( this.state.settleCase == 0 && this.state.selectedPersonList.length > 0 ) {
            let now_selectedPersonList = this.state.selectedPersonList;
            let now_settleSum = parseInt( input_value );
            let now_selectedMinUnit = this.state.settleMinUnit;
            this.setState({settleResultNoti: ( now_selectedPersonList.length > 0 )
                    ? Math.floor( now_settleSum / now_selectedPersonList.length / now_selectedMinUnit ) * now_selectedMinUnit * now_selectedPersonList.length
                    : now_settleSum });
        }
    }

    //* 정산방법 ( N/1 or 직접정산(=직접 기입) ) 선택 이벤트.
    select_SettleCase(e){
        let settleCase_index = e.target.getAttribute("id").toString().split('settleCase')[1];
        this.setState({settleCase : settleCase_index});

            if(settleCase_index == '1'){
                let personSettle_inputLayout = document.getElementsByClassName("EditForm_input2");
                let tmp_obj = this.state.person_settleInfo_obj;
                if(personSettle_inputLayout.length > 0){
                    for(let i = 0; i<personSettle_inputLayout.length; i++){
                        let personSettle_value = personSettle_inputLayout[i].value.toString().replace(/,/g, '');
                        //console.log(personSettle_value);
                        tmp_obj[ this.state.selectedPersonList[i] ] = parseInt( personSettle_value );
                    }
                    this.setState({person_settleInfo_obj : tmp_obj});
                    this.setState({ settleResultNoti: ( Object.keys(tmp_obj).length > 0) ? Object.values(tmp_obj).reduce( ( acc, cur ) => acc+cur ) : 0 });
                }
            }
            else if(settleCase_index == '0'){
                let now_selectedPersonList = this.state.selectedPersonList;
                let now_settleSum = this.state.settle_sum;
                let now_selectedMinUnit = this.state.settleMinUnit;
                this.setState({settleResultNoti: ( now_selectedPersonList.length > 0 )
                        ? Math.floor( now_settleSum / now_selectedPersonList.length / now_selectedMinUnit ) * now_selectedMinUnit * now_selectedPersonList.length
                        : now_settleSum });
                let tmp_obj = this.state.person_settleInfo_obj;
                if(this.state.selectedPersonList.length > 0){
                    for(let i = 0; i<this.state.selectedPersonList.length; i++){
                        tmp_obj[ this.state.selectedPersonList[i] ] = Math.floor( now_settleSum / now_selectedPersonList.length / now_selectedMinUnit ) * now_selectedMinUnit;
                    }
                }
            }
    }

    //* 정산 최소단위( = 절삭단위 ) selectBox 변경 이벤트.
    select_settleMinUnit(e) {
        let minUnit_value = parseInt( e.target.value.toString().split("원")[0].replace(/,/g, '') );
        //console.log(minUnit_value);
        this.setState({settleMinUnit : minUnit_value});
        if(parseInt( this.state.settleCase ) == 0) {
            let resultNoti_value = Math.floor( this.state.settle_sum / this.state.selectedPersonList.length / minUnit_value ) * minUnit_value * this.state.selectedPersonList.length;
            this.setState({settleResultNoti : resultNoti_value});
        }
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
        this.setState({ person_settleInfo_obj : tmp_obj});
        this.setState({ settleResultNoti : Object.values(tmp_obj).reduce( ( acc, cur ) => acc+cur ) });
    }


    SettleEditCom(e) {
        if(parseInt( this.state.settle_sum ) < 0 || !Number(this.state.settle_sum) ){
            //console.log('모임 비용을 입력해주세요.');
            return;
        }
        if(parseInt( this.state.settleCase ) == 0){ document.getElementById("settleCase0").click(); }
        if(this.state.settle_sum < this.state.settleResultNoti || this.state.settleResultNoti <= 0 || this.state.selectedPersonList.length === 0){
            if( parseInt( this.state.settleCase ) == 0 && this.state.selectedPersonList.length > 0 ){
                document.getElementById("settleCase0").click();
            }else{
                //console.log('다시 확인');
                return;
            }
        }

        window.scroll(0, 0);
        let EditForm_allCnt = this.state.common_settleInfoObj.formCnt;
        let now_EidtForm_index = parseInt( this.state.settleIndex );
        let settleSum = this.state.settle_sum, settleResult_value = this.state.settleResultNoti;
        let settle_Shopname = this.state.settleShopname;
        let settlePerson_nameArray = this.state.selectedPersonList;
        let settlePerson_settleInfo = this.state.person_settleInfo_obj;
        let settleCase = parseInt( this.state.settleCase );
        let settleMinUnit = parseInt(this.state.settleMinUnit);

        let settleInfo_obj = {
            modalInfo_case : 0,
            title: ( now_EidtForm_index+1 )+"차 정산내용",
            settleLocation : ( this.state.settleShopname.toString().length > 0 ) ? this.state.settleShopname : '미입력',
            settleAllCnt: EditForm_allCnt, settleIndex : now_EidtForm_index,
            settleSum : settleSum, settleCase : settleCase, settleMinUnit : settleMinUnit,
            settleValueInfo: settlePerson_settleInfo,
            settleResult: settleResult_value,
        };
        this.props.maskOpen();
        Sleep.sleep_func(250).then(() => this.props.infomodalOpen(settleInfo_obj));
    }

    componentDidUpdate(prevProps, prevState) {

    }


    componentDidMount() {

        this.setState({settleResultNoti : '0'});

        //* 새로운 정산내용 작성인지, 저장된 정산내용의 수정인지 판단.
        let savedInfo =  ( this.state.savedSettleInfo ) ? this.state.savedSettleInfo : null;

        let savedShopname = ( savedInfo ) ? savedInfo['settleLocation'] : '';
        this.setState({settleShopname : savedShopname});
        let savedPersonList =  ( savedInfo ) ? Object.keys( savedInfo['settleValueInfo'] ) : [];
        let savedSettleSum = ( savedInfo ) ? savedInfo['settleSum'] : 0;
        let personBox_list = document.getElementsByClassName("EditForm_personBox");
        //console.log(personBox_list, savedPersonList);
        for(let i = 0; i<personBox_list.length; i++){
            if( savedPersonList.indexOf(personBox_list[i].innerHTML) !== -1) {
                personBox_list[i].classList.remove('uncheck');
            }
        }

        this.setState({selectedPersonList: savedPersonList });
        if(savedPersonList.length === this.state.common_settleInfoObj['personList'].length){
            document.getElementById("EditForm_personAllSelect_btn").setAttribute("checked", '');
            document.getElementById("EditForm_personAllSelect_label").style.color = 'powderblue';
        }

        this.setState({settle_sum : savedSettleSum });

        let savedSettleCase = ( savedInfo ) ? savedInfo['settleCase'] : 0;
        this.setState({settleCase : ( savedSettleCase) ? savedSettleCase : 0 });

        let savedSettleMinUnit = ( savedInfo ) ? savedInfo['settleMinUnit'] : 1;
        this.setState({settleMinUnit: ( savedSettleMinUnit ) ? savedSettleMinUnit : 1 });
        let settleMinUnit_options = document.getElementsByClassName("minUnit_option");
        Sleep.sleep_func(250).then(()=> {
            for(let i = 0; i<settleMinUnit_options.length; i++ ){
                if( settleMinUnit_options[i].innerHTML.toString().replace(/,/g, '') === savedSettleMinUnit + '원' ){
                    settleMinUnit_options[i].setAttribute("selected", '');
                    return;
                }
            } });

        //* 저장된 정산 정보가 [직접정산] 유형일 경우,
        if(savedInfo && savedInfo['settleCase'] == 1){
            this.setState({person_settleInfo_obj: savedInfo['settleValueInfo']});
            let settleValueInfo_price = Object.values( savedInfo['settleValueInfo'] );
            let settleValue_elems = document.getElementsByClassName("EditForm_input2");
            Sleep.sleep_func(250).then(() => {
                for(let i = 0; i<settleValue_elems.length; i++){
                    settleValue_elems[i].value = settleValueInfo_price[i].toLocaleString();
                }
            });
            this.setState({settleResultNoti: settleValueInfo_price.reduce((acc, cur) => acc + cur), settleEditCom_flag: true});
        }


    }


    render() {

        let settleCase_btns = document.getElementsByClassName("select_settleCase");
        for(var i = 0; i<settleCase_btns.length; i++){
            if(parseInt( this.state.settleCase ) === i ){
                settleCase_btns[i].classList.remove('uncheck');
            }else{ settleCase_btns[i].classList.add('uncheck'); }
        }

        //* state : settleCase 가 0 일 때 ( = 정산방식 N/1 선택 시 )
        let N1_PersonSettle_inputValue = ( this.state.selectedPersonList.length > 0 )
                ?  ( Math.floor( this.state.settle_sum / this.state.selectedPersonList.length / this.state.settleMinUnit ) * this.state.settleMinUnit ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : '0';

        let settleResult_textValue = this.state.settleResultNoti.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if( parseInt( this.state.settleCase ) == 0 ) {
            //console.log("settle case ==>  n/1 ");
            settleResult_textValue = parseInt( N1_PersonSettle_inputValue.replace(/,/g, '') ) * this.state.selectedPersonList.length;
            settleResult_textValue = settleResult_textValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        let settleResultNoti_style = {
            marginLeft: '180px',
            color: ( this.state.settleResultNoti === this.state.settle_sum ) ? 'white'
                    : (this.state.settleResultNoti > this.state.settle_sum )
                        ? "rgb(255, 124, 140)" : "gray",
        };

        let EditCom_flag = ( this.state.settle_sum >= this.state.settleResultNoti && this.state.settleResultNoti > 0 && this.state.selectedPersonList.length > 0 ) ? true : false;
        if(this.state.settleCase === 0 && this.state.selectedPersonList.length > 0 && this.state.settle_sum > 0 ) {
            EditCom_flag = true;
        }

        return (
            <div id="SettleEditLayout" >
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox"><font className="bold">#</font> {parseInt( this.state.settleIndex ) + 1}차</div>
                    <div className="EditForm_title">{this.state.common_settleInfoObj['title']}</div>
                </div>
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox">모임 장소</div>
                    <input className="EditForm_input"
                           defaultValue={ ( this.state.savedSettleInfo ) ? this.state.savedSettleInfo.settleLocation : '' }
                           onChange={this.input_Shopname} placeholder="장소명 혹은 상호명 입력."/>
                </div>
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox"><font className="bold">*</font>{parseInt( this.state.settleIndex ) + 1}차 참석 인원 선택</div>
                    <input id="EditForm_personAllSelect_btn" type="checkbox" onClick={this.personAllSelectBtn_click} /><label id="EditForm_personAllSelect_label" htmlFor="EditForm_personAllSelect_btn">전체선택</label>
                    <br/>

                    <div id="EditForm_personList">
                    {this.state.common_settleInfoObj['personList'].map( (elem, index) => {

                        return <div key={"person_"+index} id={"personBox_"+index} onClick={this.selectPerson_box} className="EditForm_personBox uncheck">{elem}</div>

                    })}
                    </div>

                </div>
                <div className="EditForm_contentBox">
                    <div className="EditForm_titleBox"><font className="bold">*</font> 모임 비용</div>
                    <input className="EditForm_input"
                           onChange={this.settleSum_input}
                           defaultValue={ ( this.state.savedSettleInfo ) ? this.state.savedSettleInfo['settleSum'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '' }
                           placeholder={ parseInt( this.state.settleIndex )+1 + "차 모임비용 입력."}/><span className="EditForm_unitText">원</span>
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
                                                  value={ ( this.state.settleCase == 0 ) ? N1_PersonSettle_inputValue : this.value}
                                                  readOnly={ ( parseInt( this.state.settleCase ) == 0 ) ? true : false}
                                            /><span className="EditForm_unitText">원</span>
                                </div>
                           </div>
                })}
                </div>

                <div id="SettleResult_noti_layout" style={settleResultNoti_style}>합계&nbsp;&nbsp; { ( this.state.settleResultNoti  ) ? settleResult_textValue+'원' : ''}</div>
                <div id="SettleEditCom_btn"
                     className={ ( EditCom_flag ) ? "grant" : "" }
                     onClick={this.SettleEditCom}> 작성 완료 </div>

            </div>
        );



    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        maskOpen: () => dispatch(mask_open()),
        maskClose: () => dispatch(mask_close()),
        infomodalOpen: (modalInfo) => dispatch(infomodal_open(modalInfo)),
    }
};

SettleEdit = connect(undefined, mapDispatchToProps)(SettleEdit);

export default SettleEdit;