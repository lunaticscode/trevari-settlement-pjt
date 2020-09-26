import React from 'react';
import "../styles/SettleEdit.scss"
export default class SettleEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayStatus : 'none',
        }
    }

    componentDidUpdate(prevProps, prevState) {
        ( prevProps.editIndex !== this.props.editIndex ) ? this.setState({displayStatus: 'block'}) : '';
    }

    componentDidMount() {
        //console.log('SettleEdit-component,  Mount', this.props.editIndex);
    }

    render() {
        let modalMask_style = {
            display: this.state.displayStatus, height: window.innerHeight+'px',
        };
        return (
            <div id="SettleEditMask" style={modalMask_style}>
                <div id="SettleEditLayout">

                </div>
            </div>
        );
    }
}

SettleEdit.defaultProps = {
    editIndex : -1,
};

