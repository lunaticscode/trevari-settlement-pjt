
import React from 'react';
import '../styles/History.scss';
import Fetch from "../Fetch";
import Cookie from "../Cookie";
import {modal_close, modal_open} from "../actions";
import {connect} from "react-redux";
import Sleep from "../Sleep";

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginFlag : false, userName: '',
            settleInfoList: [],
            settleChild_detailList: [],
        };

        this.SettleChild_detailView = this.SettleChild_detailView.bind(this);
    }

    SettleChild_detailView(){
        if( !this.state.settleInfoList ) { return; }
        let now_settleInfoList = this.state.settleInfoList.sort( ( a, b ) => b[ 'id' ] - a[ 'id' ] );
        console.log(now_settleInfoList);
        let tmp_array = now_settleInfoList.map( ( elem, index ) => {
                let date_value = elem[ 'si_regdate' ].toString().substr( 0, 8 );
                date_value = date_value.substr(0, 4) + '.' + date_value.substr(4, 2) + '.' + date_value.substr(6, 2);
                let tmp_elem = {
                    title: elem[ 'si_title' ],
                    cnt: elem[ 'si_form_cnt' ],
                    date: date_value,
                    settleInfo: JSON.parse( elem[ 'si_form_info' ] ),
                    regdate: elem[ 'si_regdate' ],
                };
                return tmp_elem;
        });
        this.setState( { settleChild_detailList: tmp_array } );
        console.log( tmp_array );
    }

    componentDidMount() {
        console.log('asd');
        let now_path = window.location.pathname;
        let loginFlag = ( Cookie.get_cookie("UserName") && Cookie.get_cookie("AccessToken") ) ? true : false;
        this.setState({loginFlag: loginFlag});
        if( !loginFlag ){ return; }

        this.setState({userName: Cookie.get_cookie("UserName")});
        if(now_path === '/history'){
            //document.getElementById("AppLayout").style.height = "100%";
        }else{

        }
        let now_userName = Cookie.get_cookie("UserName");
        let submit_data = {user_name : now_userName,};
        Fetch.fetch_api("settleList", 'POST', submit_data)
            .then(res=> {
                if( res.toString().trim().indexOf('Error') !== -1){
                    console.log('server error');
                    let AlertText = '(!) 서버에 오류가 발생했습니다. 관리자에게 문의해주세요.';
                    let topPosition = window.innerHeight;
                    this.props.modalOpen( AlertText, ( topPosition-30 ) );
                    Sleep.sleep_func(2000).then(()=> this.props.modalClose());
                    return;
                }
                //console.log(res);
                this.setState({settleInfoList: res['settleInfo_List']});
        });
    }


    render() {
        let HistoryLayout_style = {height: ( !this.state.loginFlag ) ? '500px' : 'auto'};
        let settleAllCnt = 0;
        let settleAllPrice = 0;
        let settleChildAllCnt = 0;
        if( this.state.loginFlag && this.state.settleInfoList ){

            let settleInfoList = this.state.settleInfoList;
            settleAllCnt = settleInfoList.length;

            let settleChildInfo_array = [];
            settleInfoList.forEach(elem => {
                let settleChildInfo_obj = JSON.parse(elem['si_form_info']);
                for(let key in settleChildInfo_obj){
                    settleChildInfo_array.push( settleChildInfo_obj[key] );
                }
            });
            //console.log(settleChildInfo_array);

            settleAllPrice = settleChildInfo_array.reduce( (acc, cur) => {
                let sum_price = acc + cur['settleSum'];
                return sum_price;
            }, 0).toLocaleString();
        }
        
        return (
            <div id="HistoryLayout" style={HistoryLayout_style}>
                <div id="HistoryTitle">
                    {
                        ( this.state.loginFlag )
                            ? <div><div id="History_userName_box">{this.state.userName}</div> 님의 <font className="bold">정산 History</font></div>
                            : <div id="History_noUser_noti"><font className="bold">*</font> 로그인이 필요한 기능입니다.</div>
                    }
                </div>
                {

                    (this.state.loginFlag)
                        ?
                        <div id="HistoryContent_layout">
                            <div className="HistoryContent_line">
                                <div className="HistoryContent title">
                                    <font className="bold">*</font> 검색 기간
                                    <div className="HistoryContent value"></div>
                                </div>
                            </div>
                            <div className="HistoryContent_line">
                                <div className="HistoryContent title">
                                    <font className="bold">*</font> 정산 금액
                                    <div className="HistoryContent value">{settleAllPrice}</div>
                                    <div className="HistoryContent unit">원</div>
                                </div>

                            </div>
                            <div className="HistoryContent_line">
                                <div className="HistoryContent title">
                                    <font className="bold">*</font> 정산 횟수
                                    <div className="HistoryContent value">{settleAllCnt}</div>
                                    <div className="HistoryContent unit">회</div>
                                    <div className="HistoryContent_detail_btn" onClick={this.SettleChild_detailView}>상세보기</div>
                                    <div>
                                        {
                                          this.state.settleChild_detailList.map( (elem, index) => {
                                              let elem_settleSum = 0;
                                              let elem_detailInfo = elem['settleInfo'];
                                              for(let key in elem_detailInfo) {
                                                  elem_settleSum = elem_settleSum + elem_detailInfo[key]['settleSum'];
                                              }

                                              return <div className="HistorySettleChild" key={index}>
                                                            <div className="HistorySettleChild_Content date">
                                                                  {elem['date']}
                                                            </div>
                                                            <div className="HistorySettleChild_Content title">
                                                                <font className="bold">#</font> {elem['title']}
                                                            </div>
                                                            <div>
                                                                <div className="HistorySettleChild_Content cnt">
                                                                    <font className="bold">#</font> 총 모임차수&nbsp;&nbsp;{elem['cnt']}차
                                                                </div>
                                                            </div>
                                                            <div className="HistorySettleChild_Content sumPrice">
                                                                <font className="bold">#</font> 모임 총 비용&nbsp;&nbsp;{elem_settleSum.toLocaleString()+'원'}
                                                            </div>
                                                      </div>
                                          })
                                        }
                                    </div>
                                </div>

                            </div>


                            <br/><br/>
                        </div>


                        : ''
                }
                <br/>
            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        modalOpen: (text, topPosition) => dispatch(modal_open(text, topPosition)),
        modalClose: () => dispatch(modal_close())
    }
};

History = connect(undefined, mapDispatchToProps)(History);

export default History;