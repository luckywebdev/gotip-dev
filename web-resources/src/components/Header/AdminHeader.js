import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import * as Constants from '../../Constants';
import main from '../../store/actions/main';
import agent from '../../store/actions/agent';

import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled from 'styled-components';
import Img from '../UI/img';
import Text from '../UI/text';

const StyleHeader = styled.header`
  background-color: ${ props => `${ props.backColor ? props.backColor : '#EA4179' }` };
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
`
const HeaderContent = styled.div`
  max-width: 90%;
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
let dispatch;
export default (props) => {
  let history = useHistory();
  dispatch = useDispatch()
  const [parentAgentID, setParentAgentID] = useState("");
  const [agentID, setAgentID] = useState("");

  const mainState = useSelector( state => state.main );

  useEffect(() => {
    if(localStorage.getItem('uid')){
        dispatch(main.getAccountInfo(localStorage.getItem('uid')))
        dispatch(agent.tryCheckAgent());
    }
  }, [])

  useEffect(() => {
    if(typeof mainState.user !== 'undefined'){
      if(mainState.user.agent_id){
        setAgentID(mainState.user.agent_id);
      }
      if(mainState.user.parentAgentID && mainState.user.agentLevel > 1){
        setParentAgentID(mainState.user.parentAgentID);
      }
    }
}, [mainState.user]);

  return (
    <StyleHeader uk-navbar backColor='#EA4179'>
        <HeaderContent>
            <Img margin="auto .5rem auto 0" src="/static/img/header_logo.png" clicked={() => props.history.push('/land')} />
            <span>
              {parentAgentID !== "" && (
                <Text  str={`親代理店ID： ${parentAgentID}`} textAlign="right" color="#FFF" margin="auto 0rem auto 0.5rem" />
              )}
              {agentID !== "" && (
                <Text  str={`代理店ID： ${agentID}`} textAlign="right" color="#FFF" margin="auto 0rem auto 0.5rem" />
              )}
            </span>
        </HeaderContent>
    </StyleHeader>
  );
}

