import React from 'react';
import '../styles/AccountTimeline.scss';

class AccountTimeline extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            nowAccountInfo: this.props.accountInfo,
        }
    }
    componentDidUpdate( prevProps, prevState ) {
        if(prevProps.accountInfo !== this.props.accountInfo) {
            console.log(this.props.accountInfo);
            this.setState({nowAccountInfo: this.props.accountInfo});
        }
    }

    componentDidMount() { }

    render() {
        return (
            <div id="AccountTimeline_layout">
                Account - Timeline{this.state.nowAccountInfo.length}
            </div>
        );
    }
}

AccountTimeline.defaultProps={
    accountInfo: [],
};
export default AccountTimeline;