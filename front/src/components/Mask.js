import React from 'react';
import "../styles/Mask.scss";
import { connect } from 'react-redux';

class Mask extends React.Component {
    render() {
        let MaskLayout_style = {display: this.props.maskStatus}
        return (
            <div id="Mask_layout" style={MaskLayout_style}></div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        maskStatus : state.mask.maskStatus,
    };
};



Mask = connect(mapStateToProps)(Mask);
export default Mask;