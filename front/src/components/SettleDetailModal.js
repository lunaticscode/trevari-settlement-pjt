import React from 'react';
import {connect} from "react-redux";
import "../styles/SettleDetailModal.scss"
import {infomodal_close, mask_close, modal_close} from "../actions";
import {Link} from "react-router-dom";

class SettleDetailModal extends React.Component {

    constructor(props){
        super(props);
        this.state = { };

        this.infoModal_close = this.infoModal_close.bind(this);
        this.infoModal_confirm = this.infoModal_confirm.bind(this);
        this.infoModal_modify = this.infoModal_modify.bind(this);
    }

    infoModal_close(){
        this.props.infomodalClose();
        this.props.maskClose();
        document.body.style.overflow = 'auto';
    }

    infoModal_confirm() {
        localStorage.setItem("savedSettle_"+ ( this.props.info.settleIndex + 1), JSON.stringify( this.props.info ) );
        this.props.infomodalClose();
        this.props.maskClose();
        document.getElementById("backToSettle_btn").click();
        document.body.style.overflow = 'auto';
    }

    infoModal_modify(){
        document.getElementById("modifySettle_btn").click();
        this.props.infomodalClose();
        this.props.maskClose();
        document.body.style.overflow = 'auto';
    }

    render() {
        //console.log(this.props.info);
        let InfoModal_style = {
            display: this.props.displayStatus,
        };

        let now_path = window.location.pathname;

        let settleResult_value = ( this.props.info ) ? Object.values( this.props.info.settleValueInfo ).reduce((acc, cur) => acc+cur) : '';
        //console.log(settleResult_value);
        // modalInfo_case : 'settle',
        //             settleAllCnt: EditForm_allCnt, settleIndex : now_EidtForm_index,
        //             settleSum : settleSum, settleCase : settleCase, settleMinUnit : settleMinUnit,
        //             settleValueInfo: settlePerson_settleInfo,
        //             settleResult: settleResult_value,

        // CommonInfo_case : 'common',
        //
        return (
            <div id="InfoModal_layout" style={InfoModal_style}>
                <div id="InfoModal_contentLayout">
                    <div id="info_title">
                        {(this.props.info && this.props.info.modalInfo_case == 0 ) ? <font className="bold">#</font> : ''}
                        { ( this.props.info ) ? this.props.info.title : '' }
                        { (this.props.info && this.props.info.modalInfo_case == 0) ? <div id="settleInfoBorder_line"></div> : ''}
                    </div>
                    <br/>
                    <div id="info_content">
                        {
                            ( this.props.info && this.props.info.modalInfo_case == 0 ) ?
                                <div>
                                    <div className="content_line">
                                        <div className="content_title">모임 장소</div>{this.props.info.settleLocation}
                                    </div>
                                    <div className="content_line">
                                        <div className="content_title">모임 비용</div>
                                        {this.props.info.settleSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"원"}
                                    </div>
                                    <div className="content_line">
                                        <div className="content_title">정산 방법</div>
                                        { ( parseInt( this.props.info.settleCase ) == 0 ) ? "N/1 (최소단위: "+this.props.info.settleMinUnit +'원)' : "직접 정산"}
                                    </div>
                                    <br/>
                                    <div className="content_line">
                                        <div className="content_title settleDetail">정산 결과</div><br/>
                                        {
                                         Object.keys(this.props.info.settleValueInfo).map( (elem,index) => {
                                                return <div className="settlePrice_infoLine" key={index}>
                                                    <font className="bold">*</font>{elem}
                                                        <div className="settlePrice"> {this.props.info.settleValueInfo[elem].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"원"} </div>
                                                       </div>
                                         })
                                        }
                                        <div className="settlePrice_infoLine result">
                                            <font className="bold">*</font>합계
                                            <div className="settlePrice">
                                            { settleResult_value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"원" }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content_line">
                                        {
                                            (  settleResult_value  <  this.props.info.settleSum  )
                                                ? <div className="settlePrice_infoLine garbage">
                                                    <font className="bold2">*</font>남는 금액 (모임비용 - 정산결과 금액)
                                                    <div className="settlePrice">
                                                      { ( this.props.info.settleSum - settleResult_value ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"원" }
                                                    </div>
                                                  </div>

                                                : ''

                                        }
                                    </div>

                                </div>
                                : ''
                        }
                    </div>
                </div>
                <div id="InfoModal_btnLine">
                    <div id="InfoModal_cancelBtn" onClick={this.infoModal_close} className="InfoModal_actionBtn">취소</div>
                    {
                        ( now_path == '/settle' )
                            ? <div id="InfoModal_modifyBtn" onClick={this.infoModal_modify} className="InfoModal_actionBtn">수정</div>
                            :<div id="InfoModal_confirmBtn" onClick={this.infoModal_confirm} className="InfoModal_actionBtn">확인</div>
                    }

                </div>
                <Link id="backToSettle_btn" to='/settle'/>
                { ( now_path == '/settle' && this.props.info ) ? <Link id="modifySettle_btn" to={"/settleEdit/" + this.props.info.settleIndex} /> : '' }
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        displayStatus : state.infomodal.displayStatus,
        info : state.infomodal.info,
    };
};

let mapDispatchToProps = (dispatch) => {
    return {
        maskClose: () => dispatch(mask_close()),
        infomodalClose : ()=> dispatch(infomodal_close()),
    }
};

SettleDetailModal = connect(mapStateToProps, mapDispatchToProps)(SettleDetailModal);

export default SettleDetailModal;