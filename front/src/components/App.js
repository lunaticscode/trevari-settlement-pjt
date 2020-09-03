import React from 'react';
import '../styles/App.scss';
import Header from "./Header";
class App extends React.Component {
    render() {
        return (
            <div id="AppLayout">
                <Header></Header>
            </div>
        );
    }
}

export default App;