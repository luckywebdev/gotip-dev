import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import main from '../../store/actions/main';

import * as Constants from '../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import Btn from '../UI/btn';
import Anchor from '../UI/a';
import { useHistory } from 'react-router';

const StyleSideMenu = styled.nav`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-right: 1%;
    padding-top: 2%;
    background: #343130;
`
const linkStyle = {
    borderBottom: '2px solid #343130',
    padding: '3% 4%',
    position: 'relative'
}

const subUlStyle = {
    backgroundColor: "#2C2928",
    marginBottom: "2%",
    borderBottom: '1px solid #343130',
}

const badgeIcon = {
    // position: "absolute",
    width: "15px",
    height: "15px",
    backgroundColor: "red",
    // top: "-2px",
    // right: "-2px",
    color: "#FFF",
    border: "1px solid #FFF",
    fontSize: "12px",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginLeft: "5px",
    marginTop: "2px"
  }

let dispatch;
export default (props) => {
    let applicationTemp = 0;
    let history = useHistory();
    dispatch = useDispatch();
    const types = ['approved', 'applications', 'holds', 'refused'];
    const [applicationCount, setApplicationCount] = useState(0);
    const [agentLevel, setAgentLevel] = useState('0');
    const mainState = useSelector( state => state.main );
    useEffect(() => {
        if(localStorage.getItem('uid')){
            dispatch(main.getChildAgent({uid: localStorage.getItem('uid'), type: types}))
        }
    }, [])

    useEffect(() => {
        if(typeof mainState.user !== 'undefined'){
            setAgentLevel(mainState.user.agentLevel);
        }
    }, [mainState.user])
    useEffect(() => {
        if(typeof mainState.agent !== 'undefined' && typeof mainState.user !== 'undefined' && Number(mainState.user.agentLevel) < 3){
            mainState.agent.applications.result.map(item => {
                if(item.approval_status === 0){
                    if(mainState.user.agent_id.toString() === '100000'){
                        if(item.parentAgentID === '100000'){
                            applicationTemp++;
                        }
                        else{
                            if(item.preApprovalStatus !== 0 || item.approval_status_p === 1){
                                applicationTemp++;
                            }
                        }
                    }
                    else{
                        if(item.parentAgentID === mainState.user.agent_id && item.preApprovalStatus === 0 && item.approval_status_p === 0){
                            applicationTemp++;
                        }
                    }
                    setApplicationCount(applicationTemp);
                }
            })

        }
    }, [mainState.agent])
    return (
        <StyleSideMenu>
            <div className="uk-width">
                <ul className="uk-nav-default uk-nav-parent-icon" uk-nav="false">
                    {
                        Constants.ADMIN_SIDE_MENU_LIST.map((item, index) => {
                            const open_class = history.location.pathname.includes(item.url) ? "uk-open" : "";
                            const parent_class = item.child.length > 0 ? "uk-parent" : "";
                            let agent_badge = "";
                            if(item.url === '/admin/agent' && applicationCount > 0){
                                agent_badge = (<span style={badgeIcon}>{applicationCount}</span>)
                            }
                            return (
                                <>
                                { Number(agentLevel) <= Number(item.allowdLevel) && (
                                        <li className={`${open_class} ${parent_class}`} key={index} style={{marginBottom: "2%", borderLeft: history.location.pathname.includes(item.url) ? "2px solid #FF5285" : "none"}}>
                                        {
                                            item.child.length > 0 ? (
                                                <a href="#" style={{...linkStyle, color: history.location.pathname.includes(item.url) ? "#D74A74" : "#FFF", borderLeft: history.location.pathname.includes(item.url) ? "2px solid #FF5285" : "none" }}><span style={{display: "inline-flex"}}>{item.name}{agent_badge}</span></a>
                                            ) : (
                                                <a href="#" style={{...linkStyle, color: history.location.pathname.localeCompare(`${item.url}`) === 0 ? "#D74A74" : "#FFF", borderLeft: history.location.pathname.includes(item.url) ? "2px solid #FF5285" : "none" }} onClick={item.url !== '' ? () => history.push(`${item.url}`) : null}><span style={{display: "inline-flex"}}>{item.name}{agent_badge}</span></a>
                                            )
                                        }
                                        {item.child.length > 0 && (
                                            <ul className="uk-nav-sub" style={subUlStyle}>
                                            {
                                                item.child.map((subitem, subindex) => {
                                                    let agent_child_badge = "";
                                                    if(subitem.url === '/application' && applicationCount > 0){
                                                        agent_child_badge = (<span style={badgeIcon}>{applicationCount}</span>)
                                                    }
                                                    return (
                                                        <div key={subindex}>
                                                            {Number(agentLevel) <= Number(subitem.allowdLevel) && (
                                                                <li key={subindex}>
                                                                    <a href="#" style={{...linkStyle, lineHeight: "1.5", color: history.location.pathname.localeCompare(`${item.url}${subitem.url}`) === 0 ? "#D74A74" : "#FFF" }} onClick={subitem.url !== '' ? () => history.push(`${item.url}${subitem.url}`) : null}><span style={{display: "inline-flex"}}>{`>  ${subitem.name}`}{agent_child_badge}</span></a>
                                                                </li>
                                                            )}
                                                        </div>
                                                    )
                                                })                                              
                                            }
                                            </ul>
                                        )}
                                        </li>
                                    )     
                                }
                                </>
                            )
                        })
                    }
                    <li style={{ marginBottom: "2%" }}>
                        <a href="#" style={{...linkStyle, color: "#FFF" }} onClick={() => dispatch(main.executeLogout())} ><span style={{display: "inline-flex"}}>ログアウト</span></a>
                    </li>
                </ul>
            </div>
        </StyleSideMenu>
    );
}

