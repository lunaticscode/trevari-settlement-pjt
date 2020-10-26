import React from 'react';
import '../styles/CommonModal.scss';
import {mask_close, commonModal_close, commonModal_action} from "../actions";
import {connect} from "react-redux";


class CommonModal extends React.Component {
    constructor(props){
        super(props);

        this.state={ };

        this.CommonModal_close = this.CommonModal_close.bind(this);
        this.CommonModal_confirm = this.CommonModal_confirm.bind(this);
    }
    CommonModal_confirm(){
        this.props.maskClose();
        this.props.modalConfirm();
        document.body.style.overflow = 'auto';
    }

    CommonModal_close() {
        this.props.modalClose();
        this.props.maskClose();
        document.body.style.overflow = 'auto';
    }

    render() {
        let CommonModal_style = {display: this.props.displayStatus, };
        let emphasys_style = {color:  ( this.props.mood ) ?
                                        ( this.props.mood =='positive' ) ? 'cyan' : 'rgb(255, 124, 140)' : ''};
        return (
            <div id="CommonModal_layout" className={this.props.mood} style={CommonModal_style}>
                <div id="CommonModal_mask"></div>
                <div id="CommonModal_text">{this.props.text}
                    <br/><br/>
                    {
                        ( this.props.subText )
                        ?   <div><font className="bold" style={emphasys_style}>*</font><div id="CommonModal_subText">{this.props.subText}</div></div>
                            : ''
                    }

                </div>

                <div id="CommonModal_actionBtn_layout">
                    { ( this.props.mood === 'negative' || this.props.mood === 'positive' )
                        ? <div>
                            <div className="CommonModal_actionBtn cancel" onClick={this.CommonModal_close}>취소</div>
                            <div className={"CommonModal_actionBtn confirm "+this.props.mood} onClick={this.CommonModal_confirm} >확인</div>
                          </div>
                        :
                        <div className="CommonModal_actionBtn nomal" onClick={this.CommonModal_close}>확인</div>
                    }
                </div>
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        displayStatus : state.commonModal.displayStatus,
        title: state.commonModal.title,
        text : state.commonModal.text,
        subText: state.commonModal.subText,
        mood : state.commonModal.mood,
        resultSign: state.commonModal.resultSign,
    };
};

let mapDispatchToProps = (dispatch) => {
    return {
        modalClose : ()=> dispatch(commonModal_close()),
        modalConfirm : ()=> dispatch(commonModal_action()),
        maskClose : ()=> dispatch(mask_close()),
    }
};

CommonModal = connect(mapStateToProps, mapDispatchToProps)(CommonModal);

CommonModal.defaultProps = {
    displayStatus: 'none',
    title: '',
    text: '',
    subText: '',
    mood: '',
    resultSign:'',
};

export default CommonModal;