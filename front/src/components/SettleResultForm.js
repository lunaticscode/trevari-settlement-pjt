import React from 'react';
import '../styles/SettleResultForm.scss';
import Sleep from "../Sleep";
import ClipboardButton from "react-clipboard.js";

class SettleResultForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            now_slideFormIndex: 0,
            init_settleFormOffsetArray: [],
            slideBtn_offsetY: 0,
        };
        this.slideBtnClick = this.slideBtnClick.bind(this);
        this.sliderScrolling = this.sliderScrolling.bind(this);
        this.copySuccess = this.copySuccess.bind(this);
    }

    slideBtnClick(e){
        let formCnt = Object.keys( this.props.settleFormInfo ).length;
        let direction = e.target.getAttribute("id").split('_')[0];
        let now_slideFormIndex = this.state.now_slideFormIndex;
        let target_slideIndex = ( direction === 'next' ) ? now_slideFormIndex + 1 : now_slideFormIndex - 1;

        if( target_slideIndex >= 0 && target_slideIndex < formCnt ){
            this.setState({now_slideFormIndex: target_slideIndex});
            let target_slideForm = document.getElementById("srf_settleForm_"+ target_slideIndex);
            let target_slideForm_offsetX = target_slideForm.offsetLeft;
            document.getElementById("srf_sliderLayout").scrollLeft = (target_slideForm_offsetX - 20);
        }
    }

    //* 하단 정산폼, 사용자가 직접 스크롤하는 이벤트.
    sliderScrolling(e){
        let now_scrollOffsetX = e.target.scrollLeft;
        let settleFormOffsetArray = this.state.init_settleFormOffsetArray;
        let passing_formIndex = 0;

        //console.log(now_scrollOffsetX);
        if(parseInt( now_scrollOffsetX ) === 0 ) {
            this.setState({now_slideFormIndex: 0});
            return;
        }

        let passing_point = settleFormOffsetArray.some( (elem, index) => {
            passing_formIndex = index;
            return  elem - 10  <= parseInt(now_scrollOffsetX) && elem + 10 >= parseInt(now_scrollOffsetX);
        });

        if(passing_point){
            this.setState({now_slideFormIndex: passing_formIndex});
        }
    }

    //* 현재페이지 링크 복사 버튼, 클릭 이벤트 성공 시.
    copySuccess() {
            document.getElementById("LinkCopySuccess_alertModal").style.display = 'block';
            Sleep.sleep_func(1000).then( () => {
                document.getElementById("LinkCopySuccess_alertModal").style.display = 'none';
            });
    }


    componentDidUpdate(prevProps, prevState) {
        if(prevProps.settleFormInfo !== this.props.settleFormInfo){
            let now_settleFormInfo = this.props.settleFormInfo;
            //console.log(now_settleFormInfo);

            //* 사용자가 직접 스크롤하는 이벤트에 대응하기 위해, 각 정산폼의 초기 위치 state로 저장.
            let settleForm_elems = document.getElementById("srf_sliderLayout").children;
            let tmp_offset_array = [];
            for(let i = 0; i<settleForm_elems.length; i++){
                if(i === settleForm_elems.length - 1){
                    //* 마지막 폼은 스크린 넓이의 90%로 설정해서, x좌표 첫 통과지점 기준도 동일하게 90% 지점으로.
                    tmp_offset_array.push(settleForm_elems[i].offsetLeft * 0.9);
                }else{
                    tmp_offset_array.push(settleForm_elems[i].offsetLeft);
                }
            }
            this.setState({init_settleFormOffsetArray: tmp_offset_array});

            //* 슬라이드 버튼 위치 조정을 위한, 슬라이더 레이아웃 위치 값 획득.
            let slideForm_layout_offsetY = document.getElementById("srf_sliderLayout").offsetTop;
            //console.log('slideForm_offsetY ', slideForm_layout_offsetY);
            this.setState({slideBtn_offsetY: slideForm_layout_offsetY + 160});

        }
    }
    componentDidMount() {
        console.log(document.images[0].src);
        ////<![CDATA[
        window.Kakao.init('43b8c6cdeb67e860c94b30ba2385b42c');
        console.log(window.Kakao);
        window.Kakao.Link.createDefaultButton({
            container: '#kakao-link',
            objectType: 'feed',
            content: {
                title: '모두의정산',
                description: '정산결과 공유',
                imageUrl:
                    document.images[0].src,
                link: {
                    mobileWebUrl: window.location.href,
                    androidExecParams: 'test',
                },
            },
            buttons: [
                {
                    title: '웹으로 이동',
                    link: {
                        mobileWebUrl: window.location.href,
                    },
                },
                {
                    title: '앱으로 이동',
                    link: {
                        mobileWebUrl: window.location.href,
                    },
                },
            ]
        });
    }
    render() {

        let slideBtn_offsetY = 0;
        let personSettle_resultLayout = document.getElementById("selectedPerson_settleInfoLayout");
        let settleFormCnt = Object.keys( this.props.settleFormInfo ).length;
        let next_formBtn_style = { display:  ( this.state.now_slideFormIndex + 1 ) === settleFormCnt ? 'none' : 'inline-block',
                                   top: (this.props.selectedPersonName.length > 0) ? this.state.slideBtn_offsetY + 70 : this.state.slideBtn_offsetY, };
        let prev_formBtn_style = { display: ( this.state.now_slideFormIndex === 0 ) ? 'none' : 'inline-block',
                                   top: (this.props.selectedPersonName.length > 0) ? this.state.slideBtn_offsetY + 70 : this.state.slideBtn_offsetY, };
        return (
            <div id="SettleResultForm_layout">
                <div id="next_form_btn_layout" onClick={this.slideBtnClick} style={next_formBtn_style}>
                    <img id="next_form_btn_icon" src="/img/next_stage_icon.png"/>
                </div>
                <div id="prev_form_btn_layout" onClick={this.slideBtnClick} style={prev_formBtn_style}>
                    <img id="prev_form_btn_icon" src="/img/next_stage_icon.png"/>
                </div>
                <div id="srf_sliderLayout" onScroll={this.sliderScrolling}>
                    {Object.values(this.props.settleFormInfo).map( (elem, index) => {
                        return <div className="srf_sliderForm" id={"srf_settleForm_"+index} key={index}>
                                    <div className="srf_sliderForm_content title"><font className="bold">#</font>{elem['title']}</div>
                                        <div className="srf_sliderForm_border">
                                            <div className="srf_sliderForm_content subtitle">모임 장소</div>
                                            <div className="srf_sliderForm_content value">{elem['settleLocation']}</div>
                                        </div>
                                        <div className="srf_sliderForm_border">
                                            <div className="srf_sliderForm_content subtitle">모임 비용</div>
                                            <div className="srf_sliderForm_content value">{elem['settleSum'].toLocaleString()}원</div>
                                        </div>
                                        <div className="srf_sliderForm_border">
                                            <div className="srf_sliderForm_content subtitle">인원별 정산 내역</div>
                                            <br/>
                                            <div className="srf_sliderForm_content settle_detail">
                                                {
                                                    Object.keys(elem['settleValueInfo']).map( (inner_elem, inner_index) => {
                                                        return <div key={inner_index} className="settle_detail_box">
                                                                    <div className={
                                                                        ( this.props.selectedPersonName === inner_elem )
                                                                        ? "settle_detail_box name active"
                                                                        : "settle_detail_box name"
                                                                        }>
                                                                        {inner_elem}
                                                                    </div>
                                                                    <div className="settle_detail_box value">
                                                                        {Object.values(elem['settleValueInfo'])[inner_index].toLocaleString()+' 원'}
                                                                    </div>
                                                               </div>
                                                    })
                                                }
                                            </div>
                                        </div>
                               </div>
                    })}
                </div>

                <div id="SettleResultForm_linkCopyBtn_layout">
                    <ClipboardButton id="SettleResultForm_linkCopyBtn" data-clipboard-text={window.location.href}
                                     onSuccess={this.copySuccess} >
                        정산결과 링크복사
                    </ClipboardButton>
                </div>
                <div id="SettleResultForm_kakaoLinkBtn">
                    <a id="kakao-link"><img id="kakaoLinkIcon" src="/img/kakao-talk-link-icon.png" />카카오톡 공유</a>
                </div>
                <div id="LinkCopySuccess_alertModal">링크복사 완료</div>


            </div>
        );
    }
}

SettleResultForm.defaultProps = {
    settleFormInfo: {},
    selectedPersonName: '',
};
export default SettleResultForm;