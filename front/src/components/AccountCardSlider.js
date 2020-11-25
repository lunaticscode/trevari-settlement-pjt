import React, {useState, useEffect} from 'react';

function AccountCardSlider(props) {
    useEffect(() => {
        console.log('asd');
    }, [props.now_lookingCardIndex, props.nowAccountInfo]);

    let AccountLayout_style = {height: ( !props.loginFlag ) ? '500px' : window.innerHeight - 250};
    let CardSlider_style = {display: ( props.cardSliding_availFlag ) ? 'block': 'none' };

    return(
            <div>

                <div id="AccountCard_slider"
                 style={CardSlider_style}
                 onTouchStart={props.AcconutCardSlider_touchStartMove}
                 onTouchMove={props.AcconutCardSlider_touchStartMove}
                 onTouchEnd={props.AcconutCardSlider_touchEnd}
                 onScroll={props.AccountCardSliding} >
                {
                    props.slideAccountList.map( ( elem, index ) => {

                        return <div className={ (props.now_lookingCardIndex === index) ? "myAccountCard_layout active" : "myAccountCard_layout"}
                                    onTouchStart={props.AcconutCardSlider_touchStartMove}
                                    onTouchMove={props.AcconutCardSlider_touchStartMove}
                                    onTouchEnd={props.AcconutCardSlider_touchEnd}
                                    id={"myAccountCard_"+index} key={index} >
                            {
                                ( props.myAccountList.length !== 5 && ( index ) === props.myAccountList.length )
                                    ?  ''
                                    : <div className="mac_deleteBtn" onClick={props.deleteMyAccount} value={index} >
                                        <img src="/img/delete_icon.png" value={index}/>
                                    </div>
                            }


                            <div className="mac owner_name">{props.now_userName}</div>
                            <div className="mac bank_name">{
                                ( elem['bank_name'] )
                                    ? ( elem['bank_name'] )
                                    : <img id="plusAccount_icon" onClick={props.addMyAccount} src="/img/plus_account.png"/>
                            }</div>
                            <div className="mac bank_num">{elem['bank_num']}</div>
                            <div className="mac chipIcon_layout">
                                {
                                    ( elem['bank_name'] )
                                        ? <img className="mac chip_icon" src="/img/sim-card.png" />
                                        : ''
                                }
                            </div>
                        </div>
                    })
                }
                </div>

                <div id="mac_slider_counter_layout">
                    {
                        props.myAccountList.map( (elem, index) => {
                            return <span className={ (props.now_lookingCardIndex === index ) ? "mac_slide_counter active" : 'mac_slide_counter ' }
                                         key={index} id={"mac_slide_cnt_"+index}></span>
                        })
                    }
                </div>
            </div>
    )
}


export default React.memo(AccountCardSlider);