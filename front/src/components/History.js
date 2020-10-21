
import React from 'react';
import '../styles/History.scss';
import Fetch from "../Fetch";
import Cookie from "../Cookie";
import {modal_close, modal_open, infomodal_open, mask_open, mask_close} from "../actions";
import {connect} from "react-redux";
import Sleep from "../Sleep";
import {Link} from "react-router-dom";
import crypto from "../CryptoInfo";
class History extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginFlag : false, userName: '',
            settleInfoList: [],
            settleChild_detailList: [],
            detailViewStatus: false,
            detailView_linkTo: '',

            settleContentAllCnt: 0,
            limitContentCnt: 5,
            limitPageCnt: 5,
            pageAllCnt: 0,
            nowPageIndex: 0,
            pagingBox_array: [],

            detailView_offsetY: null,
            detailView_scrollDirection: null,
        };
        this.SettleChild_detailView = this.SettleChild_detailView.bind(this);

        this.HistorySettleChild_detailView = this.HistorySettleChild_detailView.bind(this);
        this.detailView_selectListCnt_change = this.detailView_selectListCnt_change.bind(this);

        this.pagingBtnDirectionClick = this.pagingBtnDirectionClick.bind(this);
        this.pagingBtnClick= this.pagingBtnClick.bind(this);

        this.detailView_scroll = this.detailView_scroll.bind(this);
    }

    HistorySettleChild_detailView(e){
        let selected_settleInfo_id = e.target.getAttribute("value");
        let settleInfo_init_index = this.state.settleInfoList.findIndex(elem => {
            return elem['id'].toString() === selected_settleInfo_id;
        });
        let selected_settleInfo = JSON.parse( this.state.settleInfoList[settleInfo_init_index]['si_form_info'] );

        let save_nowPageIndex = this.state.nowPageIndex;
        Cookie.set_cookie("saved_historyDetailPageIndex", save_nowPageIndex+'&&'+this.state.limitContentCnt );

        //this.props.maskOpen();
        //console.log(selected_settleInfo);

        if( Cookie.get_cookie('UserName') && Cookie.get_cookie("AccessToken") ){
            let userName = Cookie.get_cookie("UserName");
            let detailView_siteParam = crypto.encrypt_account(userName+'&&'+selected_settleInfo_id);
            detailView_siteParam = crypto.base64_enc(detailView_siteParam);
            this.setState({detailView_linkTo : detailView_siteParam});
            Sleep.sleep_func(250).then(()=> {
                document.getElementById("SettleDetailView_link").click();
            });

        }
        //Sleep.sleep_func(250).then(() => this.props.infoModal_open( selected_settleInfo ));
    }


    detailView_scroll(e){
        let now_scrollingOffsetY = e.target.scrollTop;
        if( this.state.detailView_offsetY < now_scrollingOffsetY ){
            this.setState({detailView_scrollDirection: 'bottom'});
        }else if( this.state.detailView_offsetY > now_scrollingOffsetY ){
            this.setState({detailView_scrollDirection: 'top'});
        }

        Sleep.sleep_func(500).then(() => {
            if(now_scrollingOffsetY === this.state.detailView_offsetY){
                this.setState({detailView_scrollDirection: null});
            }
        });

        this.setState({detailView_offsetY: now_scrollingOffsetY});
    }

    SettleChild_detailView(e){
        if( !this.state.settleInfoList ) { return; }
        let now_pageIndex = this.state.nowPageIndex;
        let now_detailView_status = !this.state.detailViewStatus;
        this.setState({detailViewStatus: now_detailView_status, nowPageIndex: now_pageIndex});
    }

    detailView_selectListCnt_change(e){
        let selected_optionValue = e.target.children[e.target.selectedIndex].getAttribute('value');
        this.setState({limitContentCnt: parseInt(selected_optionValue)});
    }

    pagingBtnDirectionClick(e){
        let now_clickedBtnValue = parseInt( e.target.getAttribute('value') );
        let now_PageIndex = this.state.nowPageIndex;

        let pageResult_value = now_clickedBtnValue + now_PageIndex;

        if( pageResult_value < 0 || pageResult_value === this.state.pageAllCnt ) { return; }
        else{ this.setState( {nowPageIndex : pageResult_value} ); }
    }

    pagingBtnClick(e){
        this.setState({nowPageIndex: parseInt( e.target.getAttribute('value') )})
    }

    componentDidMount() {
        //console.log('asd');
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

                //* 정산 내역이 하나도 없는 회원 유저인 경우,
                if( res['result'] === 'fail' ){
                    this.setState({
                        settleInfoList: res['settleInfo_List'],
                        //settleContentAllCnt: ( res['settleInfo_List'].length > 0) ? res['settleInfo_List'].length : null,
                    });
                    return;
                }

                //* 회원유저 정산 내역 정보 가공.
                this.setState({
                    settleInfoList: res['settleInfo_List'],
                    settleContentAllCnt: ( res['settleInfo_List'].length > 0) ? res['settleInfo_List'].length : null,
                });

                let settleContentPage_allCnt = Math.ceil( this.state.settleContentAllCnt / this.state.limitContentCnt );
                this.setState({pageAllCnt: settleContentPage_allCnt,});

                let pagingBox_array = [];
                let now_pageIndex = this.state.nowPageIndex;
                let limitPageCnt = this.state.limitPageCnt;
                let limitContentCnt = this.state.limitContentCnt;

                //* 히스토리 초기 페이지, 페이징박스 버튼 어레이 지정 생성.
                let start_num = Math.floor(( now_pageIndex ) / limitPageCnt) * limitPageCnt;
                let last_num = ( start_num + limitPageCnt >= this.state.pageAllCnt ) ? this.state.pageAllCnt : start_num + limitPageCnt;
                for(let i = start_num; i<last_num; i++){ pagingBox_array[i] = i; }
                this.setState({
                    pagingBox_array: pagingBox_array,
                });

                //-----------------------------------//
                let now_settleInfoList = this.state.settleInfoList.sort( ( a, b ) => b[ 'id' ] - a[ 'id' ] );
                //console.log(now_settleInfoList);

                let tmp_array = now_settleInfoList.map( ( elem, index ) => {
                    let date_value = elem['si_regdate'].toString().substr( 0, 8 );
                    date_value = date_value.substr(0, 4) + '.' + date_value.substr(4, 2) + '.' + date_value.substr(6, 2);
                    let tmp_elem = {
                        title: elem['si_title'],
                        cnt: elem['si_form_cnt'],
                        id: elem['id'],
                        date: date_value,
                        settleInfo: JSON.parse( elem['si_form_info'] ),
                        regdate: elem['si_regdate'],
                    };
                    return tmp_elem;
                });
                this.setState( { settleChild_detailList_slice: tmp_array } );
                this.setState( { settleChild_detailList: tmp_array.slice(0, limitContentCnt) } );
                //console.log( tmp_array );
                //-----------------------------------//
                if(Cookie.get_cookie("saved_historyDetailPageIndex")){
                    Sleep.sleep_func(500).then(()=> {
                        let saved_infoArray = Cookie.get_cookie("saved_historyDetailPageIndex").toString().split('&&');
                        this.setState({ nowPageIndex: parseInt( saved_infoArray[0] ) });
                        this.setState({ limitContentCnt: parseInt( saved_infoArray[1] ) });
                        let selectListCnt_options = document.getElementById("detailView_selectListCnt").children;

                        ( saved_infoArray[1] === '5' ) ? selectListCnt_options[0].setAttribute('selected', '')
                                                       : selectListCnt_options[1].setAttribute('selected', '');
                        this.setState({detailViewStatus: true});
                        Cookie.delete_cookie("saved_historyDetailPageIndex");
                    });
                }
            });

    }

    componentDidUpdate(prevProps, prevState) {
        //* 실행조건: [ 페이지 넘버 ] 혹은 [ 페이지 당 리스트 개수 ] 변화 시,
        if(prevState.nowPageIndex !== this.state.nowPageIndex || prevState.limitContentCnt !== this.state.limitContentCnt){
            //* 1라인당 페이지박스 최대개수 5개.
            let limitPageCnt = this.state.limitPageCnt;
            let now_pageIndex = this.state.nowPageIndex;

            //* [페이지 당 리스트 개수] 변화 시, 현재 보고 있는 페이지 인덱스 0번으로 넘기기.
            if(prevState.limitContentCnt !== this.state.limitContentCnt){

                //* 바로 직전 페이지가 [상세보기] 페이징일 경우,
                //* 이전 페이지 지정은 이미 componentDidMount 에서 진행한 값으로.
                if(Cookie.get_cookie('saved_historyDetailPageIndex')){
                    now_pageIndex = this.state.nowPageIndex;
                }
                //* 히스토리 페이지 정보 쿠키 값이 없는 상태에서 [ 페이지 당 리스트 개수 ] 조정 변화시,
                else{
                    now_pageIndex = 0; this.setState({nowPageIndex: 0});
                }
            }
            else{ now_pageIndex = this.state.nowPageIndex; }

            let settleContentPage_allCnt = Math.ceil( this.state.settleContentAllCnt / this.state.limitContentCnt );
            this.setState({pageAllCnt: settleContentPage_allCnt,});

            console.log( 'now page index', now_pageIndex );
                let change_pagingBox_array = [];
                let start_num = Math.floor(( now_pageIndex ) / limitPageCnt ) * limitPageCnt;
                //let last_num = ( start_num + limitPageCnt >= this.state.pageAllCnt ) ? this.state.pageAllCnt : start_num + limitPageCnt;
                let last_num = ( start_num + limitPageCnt >= settleContentPage_allCnt ) ? settleContentPage_allCnt : start_num + limitPageCnt;

            for(let i = start_num; i<last_num; i++){
                    change_pagingBox_array.push(i);
                }
                this.setState({ pagingBox_array: change_pagingBox_array });
                //console.log(change_pagingBox_array);
                let change_settleChild_detailList = this.state.settleChild_detailList_slice.slice();
                change_settleChild_detailList
                    = change_settleChild_detailList
                        .slice( ( now_pageIndex * this.state.limitContentCnt ) , ( now_pageIndex * this.state.limitContentCnt + this.state.limitContentCnt ) );
                //console.log(change_settleChild_detailList);
                this.setState({settleChild_detailList: change_settleChild_detailList});
        }
    }

    render() {
        let HistoryLayout_style = { height: ( !this.state.loginFlag ) ? '500px' : 'auto' };
        let settleAllCnt = 0;
        let settleAllPrice = 0;
        let settleChildAllCnt = 0;
        if( this.state.loginFlag && this.state.settleInfoList ){

            let settleInfoList = this.state.settleInfoList;
            settleAllCnt = settleInfoList.length;

            let settleChildInfo_array = [];
            settleInfoList.forEach( elem => {
                let settleChildInfo_obj = JSON.parse(elem['si_form_info']);
                for(let key in settleChildInfo_obj){
                    settleChildInfo_array.push( settleChildInfo_obj[ key ] );
                }
            });
            //console.log(settleChildInfo_array);

            settleAllPrice = settleChildInfo_array.reduce( (acc, cur) => {
                let sum_price = acc + cur['settleSum'];
                return sum_price;
            }, 0).toLocaleString();
        }

        let HistoryContent_style = (this.state.detailViewStatus)
            ? {height:'auto', maxHeight:'400px' ,width:'98%',  position:'relative', top:'15px', marginBottom:'15px', overflowY: 'auto', whiteSpace: 'nowrap'}
            : {display: 'none'};
        let detailView_pagingLayout_style = {display: (this.state.detailViewStatus) ? 'block' : 'none', };
        let selectListCnt_style = { display: (this.state.detailViewStatus) ? 'inline-block' : 'none',
                                    padding: "10px 0px", marginLeft: '10px', color:'gray' };
        //let sliderBox_style = {display: (this.state.detailViewStatus) ? 'block' : 'none',};
        return (
            <div id="HistoryLayout" style={HistoryLayout_style}>
                <Link id="SettleDetailView_link" to={"settleResult/"+this.state.detailView_linkTo}/>
                <div id="HistoryTitle">
                    {
                        ( this.state.loginFlag )
                            ? ''
                            : <div id="History_noUser_noti"><font className="bold">*</font> 로그인이 필요한 기능입니다.</div>
                    }
                </div>
                {
                    (this.state.loginFlag)
                        ?
                        <div id="HistoryContent_layout" onScroll={this.detailView_scroll}>
                            <div className="HistoryContent_line">
                                <div className="HistoryContent title" >
                                    <font className="bold">*</font> 정산 횟수
                                    <div className="HistoryContent value">{settleAllCnt}</div>
                                    <div className="HistoryContent unit">회</div>
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
                                <div className="HistoryContent title" >
                                    <font className="bold">*</font> 상세 내역
                                    <div className="HistoryContent_detail_btn" onClick={this.SettleChild_detailView}>
                                        {
                                            ( !this.state.settleInfoList )
                                            ? ''
                                            :
                                                <img src="/img/down-arrow2.png"
                                                     className={ ( this.state.detailViewStatus ) ? "listDown" : "listUp" } />
                                        }
                                    </div>
                                    {
                                        ( !this.state.settleInfoList )
                                            ?
                                            <div><br/>&nbsp;&nbsp;&nbsp;&nbsp;현재 정산기록이 없습니다.</div>
                                            :
                                            <div id="detailView_sliderBox" >

                                                <div className={( this.state.detailView_scrollDirection === 'top' ) ? 'active' : '' }
                                                     id="detailView_scrollNoti_top">
                                                </div>
                                                <div style={selectListCnt_style}>
                                                    페이지 당 리스트 개수
                                                    <select id="detailView_selectListCnt"
                                                            onChange={this.detailView_selectListCnt_change}>
                                                        <option value="5">5개</option>
                                                        <option value="10">10개</option>
                                                    </select>
                                                </div>

                                            <div style={ HistoryContent_style } >

                                                {
                                                    this.state.settleChild_detailList.map( (elem, index) => {
                                                        let elem_settleSum = 0;
                                                        let elem_detailInfo = elem['settleInfo'];
                                                        for(let key in elem_detailInfo) {
                                                            elem_settleSum = elem_settleSum + elem_detailInfo[key]['settleSum'];
                                                        }

                                                        return    <div className="HistorySettleChild" key={index}>
                                                            <div className="HistorySettleChild_Content date">
                                                                {elem['date']}
                                                            </div>
                                                            <div className="HistorySettleChild_Content title">
                                                                <font className="bold">#</font> {elem['title']}
                                                            </div>
                                                            <div>
                                                                <div className="HistorySettleChild_Content cnt">
                                                                    &nbsp;&nbsp;&nbsp; -&nbsp;&nbsp;총 모임차수&nbsp;&nbsp;{elem['cnt']}차
                                                                </div>
                                                            </div>
                                                            <div className="HistorySettleChild_Content sumPrice">
                                                                &nbsp;&nbsp;&nbsp; -&nbsp;&nbsp;모임 총 비용&nbsp;&nbsp;{elem_settleSum.toLocaleString()+'원'}
                                                                <div value={JSON.stringify(elem['id'])}
                                                                     onClick={this.HistorySettleChild_detailView}
                                                                     className="HistorySettleChild_detailViewBtn">상세내역</div>
                                                            </div>
                                                        </div>

                                                    })
                                                }
                                            </div>
                                                <div id="detailView_pagingLayout" style={detailView_pagingLayout_style}>
                                                    <div onClick={this.pagingBtnDirectionClick} className="pagingDirectionBtn prev" value="-1">
                                                        <img src="/img/paging_prev_btn.png" value="-1"/>
                                                    </div>
                                                    {
                                                        this.state.pagingBox_array.map( (elem, index) => {
                                                            return <div
                                                                    key={parseInt( elem )}
                                                                    onClick={this.pagingBtnClick}
                                                                    className={ (this.state.nowPageIndex === ( parseInt( elem ) ) )
                                                                                ? "pagingBox_btn active"
                                                                                : "pagingBox_btn"
                                                                                }
                                                                    value={parseInt( elem )} >
                                                                        {parseInt( elem )+1}
                                                                    </div>
                                                        })
                                                    }
                                                    <div onClick={this.pagingBtnDirectionClick} className="pagingDirectionBtn next" value="1">
                                                        <img src="/img/paging_next_btn.png" value="1"/>
                                                    </div>
                                                </div>
                                                <div className={ ( this.state.detailView_scrollDirection === 'bottom' ) ? 'active' : '' }
                                                     id="detailView_scrollNoti_bottom">
                                                </div>
                                            </div>

                                    }

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
        modalClose: () => dispatch(modal_close()),
        infoModal_open: (info) => dispatch(infomodal_open(info)),
        maskOpen: ()=> dispatch(mask_open()),
        maskClose: ()=> dispatch(mask_close())
    }
};

History = connect(undefined, mapDispatchToProps)(History);

export default History;