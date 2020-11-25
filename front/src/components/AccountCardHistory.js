import React, {useState, useEffect} from 'react';
import AccountTimeline from "./AccountTimeline";

function AcconutCardHistory(props) {
    useEffect(() => {
    console.log(props);
    }, [ props.nowCardHistoryInfo ] );

    return (
            <div id="mac_info_infoLayout">
                {
                    ( props.nowCardHistoryInfo !== undefined )
                        ?
                        <div id="mac_info_box_layout">
                            <div id="mac_info_settleCnt_box">
                                <div className="mac_info title">정산 횟수</div>
                                <div className="mac_info value">
                                    { props.nowCardHistoryInfo.length + " 회"}
                                </div>
                            </div>

                            <div id="mac_info_settleSumPrice_box">
                                <div className="mac_info title">정산 금액</div>
                                <div className="mac_info value">
                                    {
                                        props.nowCardHistoryInfo.reduce( ( acc, cur ) => {
                                            return acc + cur['sumprice'];
                                        }, 0).toLocaleString()+" 원"
                                    }
                                </div>
                            </div>
                            <div>
                            </div>

                            <div id="AccountTimeline_layout" >

                                {
                                    (props.detailHistoryInfo)
                                        ?
                                    props.detailHistoryInfo.map( (elem, index) => {
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
                                        :""
                                }
                            </div>
                        </div>
                        // this.state.nowEdit_addMyAccount
                        :  ( false )
                        ?
                        <div>
                            {/*<div id="addMyAccount_layout">*/}
                            {/*    <select id="addMyAccount_bankName_select" onChange={this.addMyAccount_selectBank}>*/}
                            {/*        {*/}
                            {/*            Object.values( this.state.bankInfo_obj ).map( (elem, index) => {*/}
                            {/*                return <option key={index} value={elem['code']}*/}
                            {/*                               className="addMyAccount_bankName_option">*/}
                            {/*                    {elem['name']}*/}
                            {/*                </option>*/}
                            {/*            })*/}
                            {/*        }*/}
                            {/*    </select>*/}
                            {/*    <div>*/}
                            {/*        <input id="addMyAccount_input_accountNum" type="number"*/}
                            {/*               className={*/}
                            {/*                   ( this.state.nowEdit_bankInfo['num']*/}
                            {/*                       && ( this.state.nowEdit_bankInfo['num'] ).toString().length > 0 )*/}
                            {/*                       ? "active" : ''*/}
                            {/*               }*/}
                            {/*               onChange={this.addMyAccount_inputNumber}*/}
                            {/*               placeholder="계좌번호 입력" />*/}

                            {/*        <div id="addMyAccount_authBtn"*/}
                            {/*             onClick={this.addMyAccount_authBtnClick}*/}
                            {/*             className={*/}
                            {/*                 ( Object.values(this.state.nowEdit_bankInfo).every(elem => elem !== null && elem.toString().length>0 ) )*/}
                            {/*                     ? "grant" : ""*/}
                            {/*             }*/}
                            {/*        >계좌인증*/}
                            {/*        </div>*/}
                            {/*        <div id="addMyAccount_realName_layout"*/}
                            {/*             className={*/}
                            {/*                 (this.state.accountGrant_flag)*/}
                            {/*                     ? 'active' : ''*/}
                            {/*             }>*/}
                            {/*            예금주*/}
                            {/*            <div id="addMyAccount_realName"></div>*/}
                            {/*        </div>*/}
                            {/*        <div id="addMyAccount_registBtn"*/}
                            {/*             onClick={this.addMyAccount_registBtnClick}*/}
                            {/*             className={*/}
                            {/*                 (this.state.accountGrant_flag )*/}
                            {/*                     ? 'grant' : ''*/}
                            {/*             }>*/}
                            {/*            계좌 등록</div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                        : ''
                }

            </div>



    )
}

export default React.memo(AcconutCardHistory);