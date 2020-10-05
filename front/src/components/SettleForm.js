import React, {Component} from 'react';
import "../styles/SettleForm.scss";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Home";
import Settle from "./Settle";
import {infomodal_open, mask_close, mask_open} from "../actions";
import {connect} from "react-redux";
import Sleep from "../Sleep";

class SettleForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            nowEditIndex : -1,
            formCnt: this.props.FormInfo['formCnt'],
        };
        this.settleEdit = this.settleEdit.bind(this);
        this.viewSettleInfo = this.viewSettleInfo.bind(this);
    }

    settleEdit(e) {
        let settleFormIndex = parseInt( e.target.id );
        this.setState({nowEditIndex : settleFormIndex});
    }

    componentDidUpdate(prevProps, prevState){
        //console.log('props change', prevProps, this.props);
    }

    viewSettleInfo(e) {
        let settle_index = e.target.getAttribute("value");
        //console.log(settle_index, typeof(settle_index));
        window.scroll(0, 0); document.body.style.overflow = 'hidden';
        document.getElementById("Mask_layout").style.height = window.innerHeight +'px';
        this.props.maskOpen();
        Sleep.sleep_func(250).then(() => this.props.infomodalOpen( JSON.parse( localStorage.getItem("savedSettle_"+settle_index) ) ) );
    }

    componentDidMount() {
        //this.setState({formCnt : this.props.FormInfo['formCnt']});
    }

    render() {
        //console.log(this.props.personList);

        let form_cnt = this.props.FormInfo['formCnt'];
        let formInfo_array = new Array(form_cnt).fill(this.props.FormInfo);

        return (
            <div>
                {/*<div>{this.props.TestProps + '/' + this.props.TestProps2 + '/' + this.props.TestProps3}</div>*/}
                {formInfo_array.map((elem, index) => {
                    return <div  key={"innerForm_"+index} className="settleInputForm">
                                <div className="innerFormContent">

                                    <div className="innerForm_title">
                                        <div className="innerForm_indexBox"># {index+1}차</div>{elem['title']}
                                            <Link key={index} to={ (localStorage.getItem("savedSettle_"+ (index+1) ) ) ?  "/settle" : "/settleEdit/"+index }>
                                                {
                                                    (localStorage.getItem("savedSettle_"+ (index+1) ) )
                                                    ? <div className="settleCom_noti" value={index+1} onClick={this.viewSettleInfo}>작성완료</div>
                                                    : <img className="settle_icon" id={index} onClick={this.settleEdit} src="/img/settle_edit_icon.png" />
                                                }
                                            </Link>
                                    </div>

                                    <div  key={"personList_"+index} className="innerForm_personListBox" >
                                        {elem['personList'].map( (p_name, p_index) => {
                                            return <div key={"person_"+p_index}
                                                        value={"settle_"+index}
                                                        className={
                                                            ( localStorage.getItem("savedSettle_"+(index+1))
                                                            && Object.keys( JSON.parse( localStorage.getItem( "savedSettle_"+ (index+1) ) ).settleValueInfo ).indexOf( p_name ) !== -1 )
                                                           ? "innerForm_personName selected"
                                                           : "innerForm_personName"
                                                        }>
                                                    {p_name}
                                                  </div>
                                        })}
                                    </div>

                                </div>
                           </div>
                })}
             </div>

        );
    }
}

SettleForm.defaultProps = {
    FormInfo : {},
    TestProps: 0,
    TestProps2: '',
    personList: [],
};

let mapDispatchToProps = (dispatch) => {
    return {
        maskOpen: () => dispatch(mask_open()),
        maskClose: () => dispatch(mask_close()),
        infomodalOpen: (modalInfo) => dispatch(infomodal_open(modalInfo)),
    }
};

SettleForm = connect(undefined, mapDispatchToProps)(SettleForm);

export default SettleForm;