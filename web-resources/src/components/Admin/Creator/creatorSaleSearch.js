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

const BorderTable = styled.table`
    border-radius: 5px;
    th, td {
        border: 1px solid #B6D4E2;
        text-align: center;
    }
    th {
        background: #F4F2F2;
        color: #423E3D;
        font-weight: 600;
    }
    tr:first-child th {
        background: #E4EFF4;
    }
`;
  
const filterOptions = ["先月", "当月", "翌月"];

export default (props) => {
    let history = useHistory();
    const [filter, setFilter] = useState(0);
    const [creatorListSource, setCreatorListSource] = useState([])
    const [creatorList, setCreatorList] = useState([]);
    const [agentID, setAgentID] = useState("100000");
    const [agentLevel, setAgentLevel] = useState('3');
     const mainState = useSelector( state => state.main );
     const adminState = useSelector( state => state.admin );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
    useEffect(() => {
        if(typeof mainState.user !== 'undefined' && mainState.user.auth_level >= 3){
          setAgentID(mainState.user.agent_id);
          setAgentLevel(mainState.user.agentLevel);
        }
    }, [mainState.user])

    useEffect(() => {
        if(typeof adminState.creatorList !== 'undefined'){
            setCreatorList(adminState.creatorList);
            setCreatorListSource(adminState.creatorList);
        }
    }, [adminState.creatorList])
        
    return (
    <MainContent>
        <BlockContent>
            <Div width="100%" margin="0.8rem .5rem 0 .5rem" padding="0" backcolor="transparent"  justify="space-between" >
                <Div width="35%" margin="0" padding="0" backcolor="transparent"  justify="center" >
                    {
                        filterOptions.map((item, index) => (
                            <Btn width="20%" radius="0px" key={index} backcolor={filter === index ? "#77ADC5" : "#B6D4E2"} color="#FFF" border="none" padding=".5rem .5rem" margin="0 .2rem" text={item} onClick={() => setFilter(index)} />
                        ))
                    }
                </Div>
                <Div width="35%" height="40px" margin="0" padding="0" backcolor="transparent" justify="space-around" >
                    <Btn width="30%" radius="5px"  backcolor="#3E3A39" color="#FFF" border="none" padding=".5rem 1rem" margin="0" text="クリエイター報酬" onClick={() => history.push('/admin/creator/compensation')} />
                </Div>
            </Div>

            <Div width="100%" height="80%" margin="0 .5rem 2% .5rem" backcolor="#FFF" direction="column" alignItems="center" justify="flex-start" >
                <Div width="80%" margin=".5rem" padding="0" justify="center" backcolor="#FFF" >
                    <BorderTable className="uk-table uk-table-middle uk-table-divider uk-table-border uk-table-hover">
                        <thead>
                            <tr>
                                <th className="uk-width-small">{Constants.DATE}</th>
                                <th colSpan="2">{Constants.SALES}</th>
                                <th colSpan="2">{Constants.CREATOR_COMPENSATION}</th>
                                <th colSpan="2">{Constants.NET_SALES}</th>
                                <th colSpan="2">{Constants.PAID_COMPENSATION} </th>
                            </tr>
                            <tr>
                                <th className="uk-width-small"></th>
                                <th>{Constants.NORMAL}</th>
                                <th>{Constants.SUBSCRIBE}</th>
                                <th>{Constants.NORMAL}</th>
                                <th>{Constants.SUBSCRIBE}</th>
                                <th>{Constants.NORMAL}</th>
                                <th>{Constants.SUBSCRIBE}</th>
                                <th>{Constants.NORMAL}</th>
                                <th>{Constants.SUBSCRIBE}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><a href="#" onClick={() => history.push(`/admin/creator/dailySale/${new Date().getTime()}`)} >{Constants.convert_fulldate(new Date().getTime())}</a></td>
                                <td>40,000pt</td>
                                <td>20,000</td>
                                <td>20,000</td>
                                <td>40,000pt</td>
                                <td>20,000</td>
                                <td>20,000</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><a href="#" onClick={() => history.push(`/admin/creator/dailySale/${new Date().getTime()}`)} >{Constants.convert_fulldate(new Date().getTime())}</a></td>
                                <td>40,000pt</td>
                                <td>20,000</td>
                                <td>40,000pt</td>
                                <td>20,000</td>
                                <td>40,000pt</td>
                                <td>20,000</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><a href="#" onClick={() => history.push(`/admin/creator/dailySale/${new Date().getTime()}`)} >{Constants.convert_fulldate(new Date().getTime())}</a></td>
                                <td>60,000pt</td>
                                <td>30,000</td>
                                <td>40,000pt</td>
                                <td>20,000</td>
                                <td>40,000pt</td>
                                <td>20,000</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </BorderTable> 
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

