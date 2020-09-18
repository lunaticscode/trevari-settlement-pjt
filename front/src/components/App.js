import React from 'react';
import '../styles/App.scss';
import Header from "./Header";
import Settle from "./Settle";
import History from "./History";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Home";
import LoginModal from "./LoginModal";
import JoinModal from "./JoinModal";
import Account from "./Account";
import AlertModal from './AlertModal';


export default class App extends React.Component {
    render() {
        return (
            <Router>
            <div id="AppLayout">
                <Header></Header>
                    <br/><br/><br/>
                    <Switch>
                        <Route exact={true} path="/" component={Home} />
                        <Route exact={true} path="/settle" component={Settle} />
                        <Route exact={true} path="/history" component={History} />
                        <Route exact={true} path="/account" component={Account} />
                        <Route exact={true} path="/login" component={LoginModal}/>
                        <Route exact={true} path="/join" component={JoinModal}/>
                    </Switch>
                    <AlertModal/>
            </div>
            </Router>
        );
    }
}




