import React from 'react';
import { connect } from 'react-redux';
import "../styles/AlertModal.scss";
class AlertModal extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        //console.log(prevProps);
    }

    render() {
        let AlertModal_style = {
            display: this.props.displayStatus,
            top: this.props.topPosition - 70 + 'px',
        };

        return (
            <div id="AlertModal_layout" style={AlertModal_style} className={this.props.animationClass}>
                {this.props.text}
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    //console.log(state);
    return {
        displayStatus: state.modal.displayStatus,
        text: state.modal.text,
        topPosition: state.modal.topPosition,
        animationClass : state.modal.animationClass,
    };
};


AlertModal = connect(mapStateToProps)(AlertModal);
export default AlertModal;