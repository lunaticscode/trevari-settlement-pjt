import React from 'react';
import { connect } from 'react-redux';

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
        this.setState({direction: props.direction});
        let swipe_direction = props.direction;
        let tmpArray = this.state.pageStackArray.slice();
        if(swipe_direction === 'right') {

            let shiftElem = tmpArray.shift();
            tmpArray.push(shiftElem);
            //location.href = this.state.pageStackArray[0];

        }else if(swipe_direction === 'left') {
            let shiftElem = tmpArray.pop();
            tmpArray.unshift(shiftElem);
        }
        else if(swipe_direction === 'click') {
            if(tmpArray.indexOf( props.nowPage ) !== 0) {
                console.log('split and concat stackArray... ');
            }
        }

        localStorage.setItem('PageStack', tmpArray);
        this.setState({pageStackArray: tmpArray});

        return Object.assign({}, this.props, {
            direction: null,
        });
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.pageStackArray[0] !== this.state.pageStackArray[0]) {
            location.href = this.state.pageStackArray[0];
        }
    }


    render() {
        ( this.props.direction === 'right' ) ? console.log('right swipe') : console.log('left swipe');

        return (
            <div> </div>
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
