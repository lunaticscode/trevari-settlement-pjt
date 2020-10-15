import React from 'react';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Link } from "react-router-dom";
import Sleep from "../Sleep";

class PageStack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageStackArray : ( localStorage.getItem('PageStack') )
                ? localStorage.getItem("PageStack").split(',') : ['/', '/settle', '/history', '/account'],
            direction : this.props.direction,
        };

    }

    componentWillReceiveProps(props) {
        //console.log('PageStack(redux) - props: ',props);
        this.setState({direction: props.direction});
        let swipe_direction = props.direction;
        let tmpArray = this.state.pageStackArray.slice();
        if(swipe_direction === 'right') {
            let shiftElem = tmpArray.shift();
            tmpArray.push(shiftElem);
        }else if(swipe_direction === 'left') {
            let shiftElem = tmpArray.pop();
            tmpArray.unshift(shiftElem);
        }
        else if(swipe_direction === 'click') {
            //console.log('Props[direction] : click');
            if(tmpArray.indexOf( props.nowPage ) !== 0) {
                let beforeValue_tmpArray = tmpArray.slice(0, tmpArray.indexOf(props.nowPage));
                let afterValue_tmpArray = tmpArray.slice(tmpArray.indexOf(props.nowPage));
                tmpArray = afterValue_tmpArray.concat(beforeValue_tmpArray);
            }
        }
        localStorage.setItem('PageStack', tmpArray);
        this.setState({pageStackArray: tmpArray});
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.pageStackArray[0] !== this.state.pageStackArray[0]) {
            document.getElementById("PageStackBtn").click();
        }
    }
    componentDidMount(){ }

    render( ) {
        return (
            <div>
                <Link id="PageStackBtn" to={this.state.pageStackArray[0]}></Link>
            </div>
        );
    }

}

let mapStateToProps = (state) => {
    //console.log(state.pageChange);
    return {
        direction: state.pageChange.direction,
        nowPage : state.pageChange.nowPage,
    }
};

PageStack = connect(mapStateToProps)(PageStack);


export default PageStack;
