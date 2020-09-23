import React from 'react';
import "../styles/Home.scss";
import Cookie from "../Cookie";
export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentDidMount() {
        //console.log('HOME - component Mounted');
    }
    render() {
        let HomeLayout_style = {height: window.innerHeight+'px'};
        //console.log(this.props.userName);
        return (
            <div id="HomeLayout" style={HomeLayout_style}>
                <div id="welcomeContent">
                    <div id="welcomeText">
                    안녕하세요, <span id="userNameBox">{ ( this.props.userName ) ? this.props.userName : "사용자" } </span>님
                    </div>
                </div>

            </div>
        );
    }
}

Home.defaultProps = {
    userName : null,

}
