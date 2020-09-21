import React from 'react';
import { connect } from 'react-redux';
import "../styles/AlertModal.scss";
class AlertModal extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        console.log(prevProps);

        // let animationClass_status = document.getElementById("AlertModal_layout").classList;
        // if(animationClass_status.value == 'slide-from-left'){
        //     setTimeout(function() {
        //             animationClass_status.remove('slide-from-left');
        //             animationClass_status.add('fadeout');
        //     }, 1000);
        // }else{
        //     console.log('asd');
        //     animationClass_status.remove('fadeout');
        //     animationClass_status.add('slide-from-left');
        // }
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
    console.log(state);
    return {
        displayStatus: state.modal.displayStatus,
        text: state.modal.text,
        topPosition: state.modal.topPosition,
        animationClass : state.modal.animationClass,
    };
};


AlertModal = connect(mapStateToProps)(AlertModal);
export default AlertModal;