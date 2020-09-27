import React, {Component} from 'react';
import "../styles/SettleForm.scss";
import SettleEdit from "./SettleEdit";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Home";
import Settle from "./Settle";


export default class SettleForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            nowEditIndex : -1,
        };
        this.settleEdit = this.settleEdit.bind(this);
    }

    settleEdit(e) {
        let settleFormIndex = parseInt( e.target.id );
        //console.log(settleFormIndex, typeof(settleFormIndex));
        this.setState({nowEditIndex : settleFormIndex});

    }
    componentDidUpdate(prevProps, prevState){

    }

    componentDidMount() {

    }

    render() {
        let form_cnt = this.props.FormInfo['formCnt'];
        let formInfo_array = new Array(form_cnt).fill(this.props.FormInfo);
        return (

            <div>
                {formInfo_array.map((elem, index) => {
                    return <div  key={"innerForm_"+index} className="settleInputForm">
                                <div className="innerFormContent">

                                    <div className="innerForm_title">
                                        <div className="innerForm_indexBox"># {index+1}차</div>{elem['title']}
                                            <Link key={index} to={"/settleEdit/"+index}>
                                                <img className="settle_icon" id={index} onClick={this.settleEdit} src="/img/settle_edit_icon.png" />
                                            </Link>
                                    </div>

                                    <div  key={"personList_"+index} className="innerForm_personListBox" >
                                        {elem['personList'].map( (p_name, p_index) => {
                                            return <div key={"person_"+p_index} className="innerForm_personName">{p_name}</div>
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
    FormInfo : ( localStorage.getItem("formInfo") ) ? JSON.parse( localStorage.getItem("formInfo") ) : {},
};
