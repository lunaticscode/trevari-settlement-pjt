import React from 'react';
import "../styles/Home.scss";
import Cookie from "../Cookie";
import {Link} from "react-router-dom";
export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
                loginFlag: false,
                login_userName: null,
        };
    }

    Settle_directBtnClick(){
        document.getElementById("tab_1").click();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.loginFlag !== this.state.loginFlag){
            console.log('Login Status: ', this.state.loginFlag, ' / UserName: ', this.state.login_userName );
        }
    }

    componentDidMount() {
        let userName = ( Cookie.get_cookie("UserName") && Cookie.get_cookie("AccessToken") ) ? Cookie.get_cookie("UserName") : null;
        if ( userName ) {
            this.setState({loginFlag: true, login_userName : userName} );
        }

    }

    render() {
        let HomeLayout_style = {height: window.innerHeight+'px'};
        //console.log(this.props.userName);

        let userName = this.state.login_userName;
        let nouserDirectBtn_style = {top: window.innerHeight - 65,};
        return (
            <div id="HomeLayout" style={HomeLayout_style}>
                {

                    (!userName)
                        ? <div id="Home_nouserContentLayout">

                            <div className="nouser_welcomeMent">쉽고 <font className="bold">,</font></div>
                            <div className="nouser_welcomeMent">빠르고 <font className="bold">,</font></div>
                            <div className="nouser_welcomeMent">정확하게 <font className="bold">.</font></div>
                            <div className="nouser_welcomeMent title"><img src="/img/app-logo-color.png"/> 모두의정산</div>

                                <div id="Settle_directGoBtn" onClick={this.Settle_directBtnClick} style={nouserDirectBtn_style}>
                                    정산 바로가기
                                    <img src="/img/arrow_icon.png"/>
                                </div>

                        </div>

                        :
                        <div id="Home_loginUserLayout">

                        </div>

                }
            </div>
        );
    }
}

Home.defaultProps = {
    userName : null,
};
