import React, {useState, useEffect} from 'react';
import AcconutCardHistory from "./AccountCardHistory";
import {useDispatch, useSelector} from "react-redux";

function AccountCardHistoryContainer(props) {

    useEffect( () => {

    }, [props.settleInfo_byAccount_obj]);

    const ChangedCardIndex = useSelector( store => {
        return store.updateCardSliderIndex.index;
    }, []);

    const cardHistoryInfo = props.settleInfo_byAccount_obj[ Object.keys(props.settleInfo_byAccount_obj)[ChangedCardIndex] ];

    let cardHistoryDetailinfo = [];
    if(cardHistoryInfo !== undefined){
        cardHistoryDetailinfo = cardHistoryInfo.reduce((acc, cur, index) => {
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
    }


    return(
        <div>
            <AcconutCardHistory
                nowCardSliderIndex={ChangedCardIndex}
                nowCardHistoryInfo={cardHistoryInfo}
                detailHistoryInfo={cardHistoryDetailinfo}
            />
        </div>

    )
}

export default React.memo(AccountCardHistoryContainer);