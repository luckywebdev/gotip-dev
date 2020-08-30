import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import media from 'styled-media-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import Btn from '../../UI/btn';
import Img from '../../UI/img';
import Text from '../../UI/text';
import Div from '../../UI/div';
import Anchor from '../../UI/a';

const MainContent = styled.nav`
    width: 100%;
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
    margin-top: 2%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
`;

const Input = styled.input`
  border: 1px solid #A3B5C1;
  background-color: #FFF;
  box-shadow: none;
  outline: none;
  height: 40px;

  &:focus {
    border: 1px solid #707070;
  }
  ${media.lessThan("large")`
    height: 30px;
  `}
`;

const ErrorMsg = styled.div`
  color: red;
`;

const ApplicationStatus = (props) => {
    const statusImg = ["application_icon.png", "approved_icon.png", "hold_icon.png"];
    const StatusIcon = {
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        position: "relative",
        backgroundColor: "transparent"
    }
    const badgeIcon = {
      position: "absolute",
      width: "15px",
      height: "15px",
      backgroundColor: "red",
      top: "-2px",
      right: "-2px",
      color: "#FFF",
      fontSize: "12px",
      borderRadius: "50%",
      justifyContent: "center",
      alignItems: "center",
      display: props.badge ? "flex" : "none"
    }
    return (<div style={StatusIcon}><img src={`${Constants.LOCAL_IMAGE_URL}${statusImg[props.status]}`} /></div>);
}
  
const filterOptions = ["先月", "当月", "翌月"];

export default (props) => {
    let history = useHistory();
    const [applicationStatus, setApplicationStatus] = useState(1);
    const [filter, setFilter] = useState(0);
    const [agentListSource, setAgentListSource] = useState([])
    const [agentLevel, setAgentLevel] = useState('3');
    const [agentID, setAgentID] = useState("100000");
    const [agentList, setAgentList] = useState([]);
     const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
    useEffect(() => {
        if(typeof mainState.user !== 'undefined' && mainState.user.auth_level >= 3){
          setAgentID(mainState.user.agent_id);
          setAgentLevel(mainState.user.agentLevel);
        }
      }, [mainState.user])
    
      useEffect(() => {
        if(typeof mainState.agent !== 'undefined'){
          const applicationTemp = mainState.agent.applications.result;
          const approvedTemp = mainState.agent.approved.result;
          const holdsTemp = mainState.agent.holds.result;
          const refuseTemp = mainState.agent.refused.result;
          setAgentList([...applicationTemp, ...approvedTemp, ...holdsTemp, ...refuseTemp]);
          setAgentListSource([...applicationTemp, ...approvedTemp, ...holdsTemp, ...refuseTemp]);
        }
      }, [mainState.agent])
        
    
    return (
    <MainContent>
        <BlockContent>
            <Div width="100%" margin="0.8rem .5rem 0 .5rem" padding="0" backcolor="transparent"  justify="space-between" >
                <Div width="35%" margin="0" padding="0" backcolor="transparent"  justify="center" >
                    {
                        filterOptions.map((item, index) => (
                            <Btn width="20%" radius="0px"  backcolor={filter === index ? "#77ADC5" : "#B6D4E2"} color="#FFF" border="none" padding=".5rem .5rem" margin="0 .2rem" text={item} onClick={() => setFilter(index)} />
                        ))
                    }
                </Div>
                <Div width="35%" height="40px" margin="0" padding="0" backcolor="transparent" justify="space-around" >
                    <Btn width="30%" radius="5px"  backcolor="#3E3A39" color="#FFF" border="none" padding=".5rem 1rem" margin="0" text="代理店報酬" onClick={() => history.push('/admin/agent/compensation')} />
                </Div>
            </Div>

            <Div width="100%" height="80%" margin="0 .5rem 2% .5rem" backcolor="#FFF" direction="column" alignItems="center" justify="flex-start" >
                <Div width="80%" margin=".5rem" padding="0" justify="center" backcolor="#FFF" >
                    <table className="uk-table uk-table-middle uk-table-divider uk-table-hover">
                        <thead>
                            <tr>
                                <th className="uk-width-small">日付</th>
                                <th>売り上げ</th>
                                <th>代理店報酬</th>
                                <th>差し引き売上</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>40,000pt</td>
                                <td>20,000</td>
                                <td>20,000</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>40,000pt</td>
                                <td>20,000</td>
                                <td>20,000</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>60,000pt</td>
                                <td>30,000</td>
                                <td>30,000</td>
                            </tr>
                        </tbody>
                    </table> 
                </Div>
            </Div>
            <Div width="100%" height="80%" margin="0 .5rem 2% .5rem" backcolor="transparent" direction="row" alignItems="center" justify="center" >
                <Btn width="12%" radius="5px"  backcolor="#4E8338" color="#FFF" border="none" padding=".5rem 1rem" margin="1rem .2rem" text="Excel CSV" />
                <Btn width="12%" radius="5px"  backcolor="#9B8B68" color="#FFF" border="none" padding=".5rem 1rem" margin="1rem .2rem" text="全銀協フォーマット" />
            </Div>
        </BlockContent>
    </MainContent>
  );
}

