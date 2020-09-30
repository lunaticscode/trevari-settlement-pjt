import React from 'react';
import {connect} from "react-redux";
import "../styles/InfoModal.scss"
import {infomodal_close, mask_close, modal_close} from "../actions";

class InfoModal extends React.Component {

    constructor(props){
        super(props);

        this.state = {

        };

        this.infoModal_close = this.infoModal_close.bind(this);

    }

    infoModal_close(){
        this.props.infomodalClose();
        this.props.maskClose();
    }

    render() {
        console.log(this.props.info);
        let InfoModal_style = {
            display: this.props.displayStatus,
        };
        //modalInfo_case : 'settle',
        //             settleAllCnt: EditForm_allCnt, settleIndex : now_EidtForm_index,
        //             settleSum : settleSum, settleCase : settleCase, settleMinUnit : settleMinUnit,
        //             settleValueInfo: settlePerson_settleInfo,
        //             settleResult: settleResult_value,
        return (
            <div id="InfoModal_layout" style={InfoModal_style}>
                <div id="InfoModal_contentLayout">
                    <div id="info_title">{(this.props.info && this.props.info.modalInfo_case == 0 ) ? <font className="bold">#</font> : ''}
                                         { ( this.props.info ) ? this.props.info.title : '' }
                        {(this.props.info && this.props.info.modalInfo_case == 0) ? <div id="settleInfoBorder_line"></div> : ''}
                    </div>
                    <br/>
                    <div id="info_content">
                        {
                            ( this.props.info && this.props.info.modalInfo_case == 0 ) ?
                                <div>
                                    <div className="content_line">
                                        <div className="content_title">모임 장소</div> {this.props.info.settleLocation}
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
                                        <div className="content_title">세부 내용</div><br/>
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
                                            { Object.values(this.props.info.settleValueInfo).reduce( (acc, cur) => acc+cur ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"원" }
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                : ''
                        }
                    </div>
                </div>
                <div id="InfoModal_btnLine">
                    <div id="InfoModal_cancelBtn" onClick={this.infoModal_close} className="InfoModal_actionBtn">취소</div>
                    <div id="InfoModal_confirmBtn" className="InfoModal_actionBtn">확인</div>
                </div>
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

InfoModal = connect(mapStateToProps, mapDispatchToProps)(InfoModal);

export default InfoModal;