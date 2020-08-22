import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

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
    const statusColors = ["#7ED957", "#FFDE59", "#3BA6A7"];
    const StatusIcon = {
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        backgroundColor: statusColors[props.status]
    }
    return (<div style={StatusIcon}></div>);
}

const filterOptions = ["先月", "当月", "翌月"];

export default (props) => {
    const [applicationStatus, setApplicationStatus] = useState(1);
    const [filter, setFilter] = useState(0);
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
    
    return (
    <MainContent>
        <BlockContent>
            <Div width="80%" padding="1% 0 0 0" margin="0" backcolor="transparent" justify="space-between" >
              <Text  str="代理店検索" textAlign="right" color="#333" fontSize="25px" fontWeight="900" margin="0 .3rem" />
              <Text  str="代理店ID：" textAlign="right" color="#999" margin="0 .3rem" />
            </Div>
            <Div width="100%" margin="0.8rem .5rem 0 .5rem" padding="0" backcolor="transparent"  justify="space-between" >
                <Div width="35%" margin="0" padding="0" backcolor="transparent"  justify="center" >
                    {
                        filterOptions.map((item, index) => (
                            <Btn width="30%" radius="0px"  backcolor={filter === index ? theme_color : "transparent"} color={filter === index ? "#FFF" : theme_color} border={ `1px solid ${theme_color}` } padding=".5rem 2rem" margin="0" text={item} onClick={() => setFilter(index)} />
                        ))
                    }
                </Div>
                <Div width="35%" height="40px" margin="0" padding="0" backcolor="#D5EEEF" justify="space-around" >
                    <span>代理別報酬</span>
                </Div>
            </Div>

            <Div width="100%" height="80%" margin="0 .5rem 2% .5rem" backcolor="#F3F3F3" direction="column" alignItems="center" justify="flex-start" >
                <Div width="95%" margin=".5rem" padding="0" justify="center" backcolor="#FFF" >
                    <table className="uk-table uk-table-middle uk-table-divider uk-table-hover">
                    <thead>
                        <tr>
                            <th className="uk-width-small">次</th>
                            <th>{Constants.AGENT_NAME}</th>
                            <th>{Constants.CHARGE_PERSON_TEL}</th>
                            <th>前月売上</th>
                            <th>登録日</th>
                            <th className="uk-width-small">ステータス</th>
                            <th>今月売上</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2次</td>
                            <td>TAMAGO</td>
                            <td>090-3219-8347</td>
                            <td>TAMAGO</td>
                            <td>1,000,000</td>
                            <td><ApplicationStatus status={applicationStatus} /></td>
                            <td>2,000,000</td>
                        </tr>
                        <tr>
                            <td>3次</td>
                            <td>HIYOKO</td>
                            <td>090-3219-8347</td>
                            <td>TAMAGO</td>
                            <td>700,000</td>
                            <td><ApplicationStatus status={applicationStatus} /></td>
                            <td>1,000,000</td>
                        </tr>
                    </tbody>
                    </table> 
                </Div>
            </Div>
        </BlockContent>
    </MainContent>
  );
}

