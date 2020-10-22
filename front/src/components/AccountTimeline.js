import React from 'react';
import '../styles/AccountTimeline.scss';
import Sleep from "../Sleep";

class AccountTimeline extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            nowAccountInfo: this.props.accountInfo,
            detailAccountInfo: {},
            contentLimitCnt: 10,
            contentPage: 1,
            contentMaxPage: 1,
            detailAccountInfo2:[],
        };
        this.accountTimeline_moreView = this.accountTimeline_moreView.bind(this);
    }

    accountTimeline_moreView(e){
        let now_contentPage = this.state.contentPage;
            if( now_contentPage >= this.state.contentMaxPage ){
                return;
            }else{
                let contentAllCnt = this.props.accountInfo.length;
                let next_contentCnt =  ( now_contentPage + 1 ) * this.state.contentLimitCnt;
                if( next_contentCnt >= contentAllCnt ){
                    next_contentCnt = contentAllCnt;
                }
                this.setState({contentPage: now_contentPage + 1});
            }
    }

    componentDidUpdate( prevProps, prevState ) {
        if(prevProps !== this.props) {
        if (prevProps.accountInfo !== this.props.accountInfo || prevProps.passingCardIndex !== this.props.passingCardIndex || prevProps.accountInfo == this.props.accountInfo) {
            let receive_info_array = this.props.accountInfo;
            this.setState({nowAccountInfo: this.props.accountInfo});
            let processing_info_obj = receive_info_array.reduce((acc, cur) => {
                let tmp_arrayElem = [{
                    sumprice: cur['sumprice'],
                    title: cur['title'],
                    date: cur['date'].toString().substr(0, 4) + '.' + cur['date'].toString().substr(4, 2) + '.' + cur['date'].toString().substr(6, 2),
                    meetcnt: Object.keys(cur['info']).length
                }];
                let date_value = cur['date'].toString().substr(0, 6);
                let curValue = (Object.keys(acc).indexOf(date_value) !== -1) ? acc[date_value].concat(tmp_arrayElem) : tmp_arrayElem;
                acc[date_value] = curValue;
                return acc;
            }, {});

            this.setState({detailAccountInfo: processing_info_obj});
            let test_sliceArray = receive_info_array.slice(0, this.state.contentLimitCnt);
            let test_info_array = test_sliceArray.reduce((acc, cur, index) => {
                let tmp_arrayElem = {
                    date: cur['date'],
                    sumprice: cur['sumprice'],
                    meetcnt: Object.keys(cur['info']).length,
                    title: cur['title'],
                    borderFlag: null,
                };
                let borderFlag = (index > 0 && acc[index - 1]['date'].substr(0, 8) !== cur['date'].substr(0, 8)) ? true : null;
                tmp_arrayElem['borderFlag'] = borderFlag;
                acc[index] = tmp_arrayElem;
                return acc;
            }, []);

            this.setState({detailAccountInfo2: test_info_array});

            let init_infoCnt = this.props.accountInfo.length;

            let pageMaxCnt = Math.ceil(init_infoCnt / 10);
            this.setState({contentPage: 1, contentMaxPage: pageMaxCnt});
        }
    }

        //* 더보기 버튼
        if( prevState.contentPage !== this.state.contentPage ){

            let contentAllCnt = this.props.accountInfo.length;
            let nextContentCnt = ( ( this.state.contentPage ) * this.state.contentLimitCnt >= contentAllCnt )
                ? contentAllCnt : ( this.state.contentPage ) * this.state.contentLimitCnt;

            let receive_info_array = this.props.accountInfo;
            let test_sliceArray = receive_info_array.slice(0, nextContentCnt);

            let test_info_array = test_sliceArray.reduce( (acc, cur, index) => {
                let tmp_arrayElem = {
                    date: cur['date'],
                    sumprice: cur['sumprice'],
                    meetcnt: Object.keys(cur['info']).length,
                    title: cur['title'],
                    borderFlag: null,
                };
                let borderFlag = ( index > 0 && acc[index-1]['date'].substr(0, 8) !== cur['date'].substr(0, 8) ) ? true : null;
                tmp_arrayElem['borderFlag'] = borderFlag;
                acc[index] = tmp_arrayElem;
                return acc;
            }, []);
            this.setState({ detailAccountInfo2: test_info_array });
        }

    }

    componentDidMount() {

    }

    render() {
        return (
            <div id="AccountTimeline_layout">

                {
                    this.state.detailAccountInfo2.map( (elem, index) => {
                            let tmp_date = elem['date'].toString().substr(0, 4) + '.' + elem['date'].toString().substr(4, 2) + '.' + elem['date'].toString().substr(6, 2);
                            return <div className="AccountTimeline_dateBorder" key={index}>
                                            <div className="AccountTimeline_content box" >
                                                <div>
                                                    <div className="AccountTimeline_content date_value">
                                                        {tmp_date}
                                                    </div>
                                                    <div className="AccountTimeline_content title_value">
                                                        {elem['title']}
                                                        {
                                                            ( parseInt( elem['meetcnt'] ) > 1 )
                                                                ?   <font> (총 {elem['meetcnt']}차)</font>
                                                                : ''
                                                        }
                                                    </div>
                                                </div>
                                                <div className="AccountTimeline_content sum_value">
                                                    {elem['sumprice'].toLocaleString() + "원"}
                                                </div>
                                            </div>
                                    </div>
                    })

                    // Object.keys( this.state.detailAccountInfo ).sort( ( a, b ) => b - a ).map( ( k_elem, k_index ) => {
                    //     return <div className="AccountTimeline_dateBorder" key={k_index} >
                    //
                    //                 {
                    //                     Object.values(this.state.detailAccountInfo)[k_index].map((v_elem, v_index) => {
                    //                         return <div className="AccountTimeline_content box" key={v_index} >
                    //                                     <div>
                    //                                         <div className="AccountTimeline_content date_value">
                    //                                             {v_elem['date']}
                    //                                         </div>
                    //                                         <div className="AccountTimeline_content title_value">
                    //                                             {v_elem['title']}
                    //                                             {
                    //                                                 ( parseInt( v_elem['meetcnt'] ) > 1 )
                    //                                                 ?   <font> (총 {v_elem['meetcnt']}차)</font>
                    //                                                     : ''
                    //                                             }
                    //
                    //                                         </div>
                    //                                     </div>
                    //                                         <div className="AccountTimeline_content sum_value">
                    //                                             {v_elem['sumprice'].toLocaleString() + "원"}
                    //                                         </div>
                    //                         </div>
                    //                     })
                    //                 }
                    //     </div>
                    // })
                }
                {
                    ( this.props.accountInfo.length > 0  )
                    ? <div id="AccountTimeline_moreViewBtn"
                           className={ ( this.state.contentPage !== this.state.contentMaxPage ) ? "active" : "" }
                           onClick={this.accountTimeline_moreView}>
                            더보기<font> ( {this.state.contentPage + ' / ' + this.state.contentMaxPage} )</font>
                        </div>
                        : <div id="noneInfo_notify"><font className="bold">* </font>해당계좌의 정산정보가 없습니다.</div>
                }


            </div>
        );
    }
}

AccountTimeline.defaultProps={
    accountInfo: [],
    passingCardIndex: 0,
    nowEmptyCardFlag: null,

};
export default AccountTimeline;