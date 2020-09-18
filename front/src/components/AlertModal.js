import React from 'react';
import { connect } from 'react-redux';
import "../styles/AlertModal.scss";
class AlertModal extends React.Component {
    render() {
        let AlertModal_style = {
            display: this.props.displayStatus,
            top: this.props.topPosition - 70 + 'px',
        };
        return (
            <div id="AlertModal_layout" style={AlertModal_style} className="slide-from-left">
                {this.props.text}
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        displayStatus: state.modal.displayStatus,
        text: state.modal.text,
        topPosition: state.modal.topPosition,
    };
};


AlertModal = connect(mapStateToProps)(AlertModal);
export default AlertModal;