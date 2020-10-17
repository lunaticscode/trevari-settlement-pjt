import React from 'react';
import '../styles/AccountTimeline.scss';

class AccountTimeline extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            nowAccountInfo: this.props.accountInfo,
            detailAccountInfo: {},
        }
    }
    componentDidUpdate( prevProps, prevState ) {
        if(prevProps.accountInfo !== this.props.accountInfo) {
            console.log('init receive props ---> state ',this.props.accountInfo);
            this.setState({nowAccountInfo: this.props.accountInfo});
            let receive_info_array = this.props.accountInfo;

            let processing_info_obj =  receive_info_array.reduce((acc, cur) => {
                let tmp_arrayElem = [ {sumprice: cur['sumprice'],
                                       title: cur['title'],
                                       date: cur['date'].toString().substr(0, 4)+'.'+cur['date'].toString().substr(4, 2)+'.'+cur['date'].toString().substr(6, 2),
                                       meetcnt: Object.keys(cur['info']).length } ];
                let date_value = cur['date'].toString().substr(0, 6);
                let curValue = ( Object.keys(acc).indexOf(date_value) !== -1 ) ? acc[date_value].concat(tmp_arrayElem) : tmp_arrayElem;
                acc[date_value] = curValue;
                return acc;
            }, {});
            console.log(processing_info_obj);
            this.setState({detailAccountInfo: processing_info_obj})
        }
    }

    componentDidMount() { }

    render() {
        return (
            <div id="AccountTimeline_layout">

                {
                    Object.keys( this.state.detailAccountInfo ).sort( ( a, b ) => b - a ).map( ( k_elem, k_index ) => {
                        let date = k_elem.toString().substr(0, 4) + '.' + k_elem.toString().substr(4, 2);

                        return <div className="AccountTimeline_dateBorder" key={k_index} >
                                    <div className="AccountTimeline_dateBorder date_value">{date}</div>
                                    <br/>
                                    {
                                        Object.values(this.state.detailAccountInfo)[k_index].map((v_elem, v_index) => {
                                            return <div className="AccountTimeline_content box" key={v_index} >
                                                        <div>
                                                            <div className="AccountTimeline_content date_value">
                                                                {v_elem['date']}
                                                            </div>
                                                            <div className="AccountTimeline_content title_value">
                                                                {v_elem['title']} <font className="bold">({v_elem['meetcnt']})</font>
                                                            </div>
                                                        </div>
                                                            <div className="AccountTimeline_content sum_value">
                                                                {v_elem['sumprice'].toLocaleString() + "원"}
                                                            </div>
                                            </div>
                                        })
                                    }
                        </div>
                    })

                }
            </div>
        );
    }
}

AccountTimeline.defaultProps={
    accountInfo: [],
};
export default AccountTimeline;