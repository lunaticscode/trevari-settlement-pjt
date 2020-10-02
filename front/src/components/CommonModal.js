import React from 'react';
import '../styles/CommonModal.scss';
import {mask_close, commonModal_close} from "../actions";
import {connect} from "react-redux";


class CommonModal extends React.Component {
    constructor(props){
        super(props);

        this.state={ };

        this.CommonModal_close = this.CommonModal_close.bind(this);
    }

    CommonModal_close() {
        this.props.modalClose();
        this.props.maskClose();
    }

    render() {
        let CommonModal_style = {display: this.props.displayStatus, };
        return (
            <div id="CommonModal_layout" className={this.props.mood} style={CommonModal_style}>
                <div id="CommonModal_mask"></div>
                <div id="CommonModal_text">{this.props.text}</div>

                <div id="CommonModal_actionBtn_layout">
                    { ( this.props.mood === 'negative' || this.props.mood === 'positive' )
                        ? <div>
                            <div className="CommonModal_actionBtn cancel" onClick={this.CommonModal_close}>취소</div>
                            <div className={"CommonModal_actionBtn confirm "+this.props.mood}>확인</div>
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
        text : state.commonModal.text,
        mood : state.commonModal.mood,
    };
};

let mapDispatchToProps = (dispatch) => {
    return {
        modalClose : ()=> dispatch(commonModal_close()),
        maskClose : ()=> dispatch(mask_close()),
    }
};

CommonModal = connect(mapStateToProps, mapDispatchToProps)(CommonModal);

CommonModal.defaultProps = {
    displayStatus: 'none',
    text: '',
    mood: '',
};

export default CommonModal;