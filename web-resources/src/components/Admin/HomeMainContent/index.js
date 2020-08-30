import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import main from '../../../store/actions/main';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import Btn from '../../UI/btn';
import Img from '../../UI/img';
import Text from '../../UI/text';
import Div from '../../UI/div';
import Anchor from '../../UI/a';

const MainContent = styled.nav`
    width: 65%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-right: 1%;
    margin-left: 1%;
`

const BlockContent = styled.div`
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
`;

export default (props) => {
    let history = useHistory();
    let dispatch = useDispatch();

    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
    const handleApplication = (agentID) => {
        console.log("agentID", agentID);
        if(agentID !== null){
            dispatch(main.getOtherAgentAccountInfo(agentID));
            history.push('/admin/agent/application');
        }
    }
    return (
    <MainContent>
        {
            typeof mainState.agent !== 'undefined' && mainState.agent.applications.result.map((item, index) => {
                if(item.approval_status === 0 && typeof mainState.user !== 'undefined'){
                    if(mainState.user.agent_id.toString() === '100000'){
                        if(item.parentAgentID === '100000'){
                            return (
                                <BlockContent style={{backgroundColor: theme_color}} key={index}>
                                    <Div width="95%" padding=".8% 0 0 0" margin="0" backcolor="transparent" justify="flex-start" >
                                        <Text str={item.created_at ? Constants.convert_fulldate(Number(item.created_at)) : Constants.convert_fulldate(Number(item.updated_at))} width="80%" textAlign="left" color="#FFF" margin=".5rem" />
                                        {/* <Anchor href="#" decoration="underline" color="#FFF" text={Constants.EDIT} id="editBtn" /> */}
                                    </Div>
                                    <Div width="100%" backcolor="#FFF" margin="0rem 0 .5rem 0">
                                        <a href="#" onClick={() => handleApplication(item.agent_id)}>
                                            <Text str={`${item.name.nickname}が販売代理店の登録を申請しています。`} width="80%" textAlign="left" color="#333" margin=".5rem" />
                                        </a>
                                    </Div>
                                </BlockContent>
                            )
                        }
                        else{
                            if(item.preApprovalStatus !== 0 || item.approval_status_p === 1){
                                return (
                                    <BlockContent style={{backgroundColor: theme_color}} key={index}>
                                        <Div width="95%" padding=".8% 0 0 0" margin="0" backcolor="transparent" justify="flex-start" >
                                            <Text str={item.created_at ? Constants.convert_fulldate(Number(item.created_at)) : Constants.convert_fulldate(Number(item.updated_at))} width="80%" textAlign="left" color="#FFF" margin=".5rem" />
                                            {/* <Anchor href="#" decoration="underline" color="#FFF" text={Constants.EDIT} id="editBtn" /> */}
                                        </Div>
                                        <Div width="100%" backcolor="#FFF" margin="0rem 0 .5rem 0">
                                            <a href="#" onClick={() => handleApplication(item.agent_id)}>
                                                <Text str={`${item.name.nickname}が販売代理店の登録を申請しています。`} width="80%" textAlign="left" color="#333" margin=".5rem" />
                                            </a>
                                        </Div>
                                    </BlockContent>
                                )
                            }
                        }
                    }
                    else{
                        if(item.parentAgentID === mainState.user.agent_id && item.preApprovalStatus === 0 && item.approval_status_p === 0){
                            return (
                                <BlockContent style={{backgroundColor: theme_color}} key={index}>
                                    <Div width="95%" padding=".8% 0 0 0" margin="0" backcolor="transparent" justify="flex-start" >
                                        <Text str={item.created_at ? Constants.convert_fulldate(Number(item.created_at)) : Constants.convert_fulldate(Number(item.updated_at))} width="80%" textAlign="left" color="#FFF" margin=".5rem" />
                                        {/* <Anchor href="#" decoration="underline" color="#FFF" text={Constants.EDIT} id="editBtn" /> */}
                                    </Div>
                                    <Div width="100%" backcolor="#FFF" margin="0rem 0 .5rem 0">
                                        <a href="#" onClick={() => handleApplication(item.agent_id)}>
                                            <Text str={`${item.name.nickname}が販売代理店の登録を申請しています。`} width="80%" textAlign="left" color="#333" margin=".5rem" />
                                        </a>
                                    </Div>
                                </BlockContent>
                            )
                        }
                    }
                }
            })
        }
    </MainContent>
  );
}

