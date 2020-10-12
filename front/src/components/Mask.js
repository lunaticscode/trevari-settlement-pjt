import React from 'react';
import "../styles/Mask.scss";
import { connect } from 'react-redux';

class Mask extends React.Component {
    constructor(props){
        super(props);
        this.state = {modalHeight_value : 0};
    }
    componentDidMount() {
        console.log(document.getElementById("Mask_layout").style.height, window.innerHeight);
        this.setState({modalHeight_value : window.innerHeight});
    }
    render() {
        console.log(window.pageYOffset);
        let MaskLayout_style = {display: this.props.maskStatus, height: this.state.modalHeight_value + window.pageYOffset };
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