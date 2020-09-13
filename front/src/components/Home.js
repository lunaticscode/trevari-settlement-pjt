import React from 'react';
import "../styles/Home.scss";
export default class Home extends React.Component {
    render() {
        return (
            <div id="HomeLayout">
                <div id="welcomeContent">
                    <div id="welcomeText">
                    안녕하세요, <span id="userNameBox">USER사용자</span>님
                    </div>

                </div>
            </div>
        );
    }
}

