import React, {useState, useEffect} from 'react';
import Cookie from "../Cookie";
import AccountCardSlider from "./AccountCardSlider";
import {useDispatch} from "react-redux";
import {updateCardSliderIndex} from "../actions";

function AccountCardSliderContainer(props) {
    const dispatch = useDispatch();
    const [now_lookingCardInfo_array, setNow_lookingCardInfo_array] = useState([]);
    const [slider_offsetX, setNow_slider_offsetX] = useState(0);
    const [now_lookingCardIndex, setNow_lookingCardIndex] = useState(0);

    const loginFlag = props.loginFlag;
    const AccountLayout_style = {height: ( !loginFlag ) ? '500px' : window.innerHeight - 250};
    const CardSlider_style = {display: ( props.cardSliding_availFlag ) ? 'block': 'none' };
    const now_userName = ( loginFlag ) ? Cookie.get_cookie('UserName') : '';

    const AcconutCardSlider_touchStartMove = (e) => {
        Cookie.set_cookie("mac_slider_Scrolling", 'true');
    };
    const AcconutCardSlider_touchEnd = (e) => {
        setTimeout(() => { Cookie.set_cookie('mac_slider_Scrolling', 'false'); }, 1000);
    };

    const AccountCardSliding = (e) => {
        if(props.cardSliding_availFlag){
            const cardWidth = document.getElementById("myAccountCard_0").offsetWidth;
            const now_slider_offsetX = ( e.target.scrollLeft == 0 ) ? 1 : e.target.scrollLeft;
            setNow_slider_offsetX(now_slider_offsetX);
            const passing_index = Math.floor( now_slider_offsetX / cardWidth );

            if(now_lookingCardIndex !== passing_index){
                dispatch(updateCardSliderIndex(passing_index));
                setNow_lookingCardIndex(passing_index);
            }

            const now_accountNum = (props.myAccountList[passing_index] ) ? props.myAccountList[passing_index]['bank_num'] : null;

            if( props.settleInfo_byAccount_obj || !now_accountNum  ){
                setNow_lookingCardInfo_array(null);
            }
            else{
                try{
                    let now_accountSettleInfo = ( now_accountNum ) ? props.settleInfo_byAccount_obj[now_accountNum] : null;
                    if(Object.keys(props.settleInfo_byAccount_obj).indexOf(now_accountNum) == -1){
                        //this.setState({now_lookingCardInfo_array: []});
                        setNow_lookingCardInfo_array([]);
                        return;
                    }
                    if(now_accountNum && props.settleInfo_byAccount_obj[now_accountNum].length > 0) {
                        let tmp_accountSettleInfo_Array = now_accountSettleInfo.sort( (a, b) => b['date'] - a['date'] );
                        //this.setState({now_lookingCardInfo_array: tmp_accountSettleInfo_Array});
                        setNow_lookingCardInfo_array(tmp_accountSettleInfo_Array);
                    }

                }catch(e){
                    console.log(e.toString());
                }
            }
        }
    };

    useEffect( () => {

    }, []);

    return (
        <AccountCardSlider
            loginFlag={props.loginFlag}
            cardSliding_availFlag={props.cardSliding_availFlag}
            AcconutCardSlider_touchStartMove={AcconutCardSlider_touchStartMove}
            AcconutCardSlider_touchEnd={AcconutCardSlider_touchEnd}
            AccountCardSliding={AccountCardSliding}
            slideAccountList={props.slideAccountList}
            myAccountList={props.myAccountList}
            now_userName={now_userName}
            now_lookingCardIndex={now_lookingCardIndex}
        />
    )
}

export default React.memo(AccountCardSliderContainer);