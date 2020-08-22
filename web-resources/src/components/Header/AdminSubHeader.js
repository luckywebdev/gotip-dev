import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Constants from '../../Constants';
import main from '../../store/actions/main';
import { useHistory } from 'react-router';

import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled from 'styled-components';
import Img from '../UI/img';
import Text from '../UI/text';

const StyleHeader = styled.header`
  background-color: #2C2928;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 0 3%;
`
const badgeIcon = {
    position: "absolute",
    width: "15px",
    height: "15px",
    backgroundColor: "red",
    top: "15px",
    right: "10px",
    color: "#FFF",
    border: "1px solid #FFF",
    fontSize: "12px",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex"
  }


let dispatch;
export default (props) => {
    let applicationTemp = 0;
    let approvedTemp = 0;
    let holdTemp = 0;
    let history = useHistory();
    dispatch = useDispatch()
    const mainState = useSelector( state => state.main );
    const [agentLevel, setAgentLevel] = useState('0');
    const [applicationCount, setApplicationCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [holdCount, setHoldCount] = useState(0);
    useEffect(() => {
        if(typeof mainState.user !== 'undefined'){
            setAgentLevel(mainState.user.agentLevel);
        }
    }, [mainState.user])
    useEffect(() => {
        if(typeof mainState.agent !== 'undefined' && typeof mainState.user !== 'undefined'){
            mainState.agent.applications.result.map(item => {
                if(mainState.user.agent_id.toString() === '100000'){
                    if(item.parentAgentID === '100000'){
                        applicationTemp++;
                    }
                    else{
                        if(item.preApprovalStatus !== 0){
                            applicationTemp++;
                        }
                    }
                }
                else{
                    if(item.parentAgentID === mainState.user.agent_id){
                        applicationTemp++;
                    }
                }
                setApplicationCount(applicationTemp);
            })
            mainState.agent.approved.result.map(item => {
                approvedTemp++;
                setApprovedCount(approvedTemp);
            })
            mainState.agent.holds.result.map(item => {
                holdTemp++;
                setHoldCount(holdTemp);
            })

        }
    }, [mainState.agent])

    const SiteName = () => {
        let title = "";
        Constants.ADMIN_SIDE_MENU_LIST.map((item, index) => {
            if(item.child.length > 0) {
                item.child.map((subitem, subindex) => {
                    if(history.location.pathname.localeCompare(`${item.url}${subitem.url}`) === 0){
                        title = subitem.name;
                    }
                })
            }
            else{
                if(history.location.pathname.localeCompare(`${item.url}`) === 0){
                    title = item.name;
                }
            }
        })
        return title;
    }

    return (
        <StyleHeader uk-navbar>
            <Text  str={SiteName()} textAlign="right" color="#FFF" fontSize="1.5rem" fontWeight="900" margin="auto 0rem auto 0.5rem" />
            {Number(agentLevel) < 3 && (
                <span>
                    <span style={{position: "relative"}}>
                        <Img width="35px" height="35px" margin="auto 1rem auto 0" src={`${Constants.LOCAL_IMAGE_URL}application_icon.png`} />
                        {applicationCount > 0 && (
                            <span style={badgeIcon}>{applicationCount}</span>
                        )}
                    </span>
                    <span style={{position: "relative"}}>
                        <Img width="35px" height="35px" margin="auto 1rem auto 0" src={`${Constants.LOCAL_IMAGE_URL}compensation_icon.png`} />
                        {holdCount > 0 && (
                            <span style={badgeIcon}>{holdCount}</span>
                        )}
                    </span>
                    <span style={{position: "relative"}}>
                        <Img width="35px" height="35px" margin="auto 1rem auto 0" src={`${Constants.LOCAL_IMAGE_URL}approved_icon.png`} />
                        {approvedCount > 0 && (
                            <span style={badgeIcon}>{approvedCount}</span>
                        )}
                    </span>
                </span>
            )}
        </StyleHeader>
    );
}

