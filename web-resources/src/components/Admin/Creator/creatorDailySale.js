import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as Constants from '../../../Constants';
import admin from '../../../store/actions/admin';
import main from '../../../store/actions/main';
import UIkit from 'uikit';
import styled from 'styled-components';
import media from 'styled-media-query';
import Btn from '../../UI/btn';
import Text from '../../UI/text';
import Div from '../../UI/div';
import Anchor from '../../UI/a';

// import "react-datepicker/dist/react-datepicker.css";
import 'react-datetime/css/react-datetime.css'
import { useHistory, useParams } from 'react-router';

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
    .rdt {
        input[type="text"] {
            padding: .5rem !important;
            border-color: -internal-light-dark(rgb(138, 118, 118), rgb(195, 195, 195));
        }
    }
`;

const Input = styled.input`
    border: none;
    border-bottom: 1px solid #A3B5C1;
    background-color: transparent;
    box-shadow: none;
    outline: none;
    height: 40px;
    width: 20%;
    margin: .3rem;
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
        background: #E4EFF4;
        color: #423E3D;
        font-weight: 600;
    }
`;

const filterOptions = ["先月", "当月", "翌月"];

export default (props) => {
    let dispatch = useDispatch();
    let history = useHistory();
    let params = useParams();
    const timestamp = params.timestamp;
    const [filter, setFilter] = useState(0);
    const [creatorListSource, setCreatorListSource] = useState([])
    const [creatorList, setCreatorList] = useState([]);
    const [agentLevel, setAgentLevel] = useState('3');
    const [agentID, setAgentID] = useState("100000");
    const mainState = useSelector( state => state.main );
    const adminState = useSelector( state => state.admin );

    useEffect(() => {
        if(typeof mainState.user !== 'undefined' && mainState.user.auth_level >= 3){
          setAgentID(mainState.user.agent_id);
          setAgentLevel(mainState.user.agentLevel);
          dispatch(admin.tryCreatorSearch(mainState.user.agent_id));
        }
      }, [mainState.user])
    
    useEffect(() => {
        if(typeof adminState.creatorList !== 'undefined'){
            setCreatorList(adminState.creatorList);
            setCreatorListSource(adminState.creatorList);
        }
    }, [adminState.creatorList])

    const handlePersonalData = (uid) => {
        dispatch(main.getOtherAgentAccountInfo(uid));
        history.push(`/admin/creator/personalSale/${uid}_${timestamp}`);
    }

    return (
    <MainContent>
        <BlockContent>
            <Div width="100%" margin="0.8rem .5rem 0 .5rem" padding="0" backcolor="transparent"  justify="space-between" >
                <Div width="35%" margin="0" padding="0" backcolor="transparent"  justify="center" >
                    {
                        filterOptions.map((item, index) => (
                            <Btn key={index} width="20%" radius="0px"  backcolor={filter === index ? "#77ADC5" : "#B6D4E2"} color="#FFF" border="none" padding=".5rem .5rem" margin="0 .2rem" text={item} onClick={() => setFilter(index)} />
                        ))
                    }
                </Div>
                <Div width="25%" height="40px" margin="0" padding="0" backcolor="transparent" justify="flex-start" style={{borderBottom: "1px solid #EAEAEA"}} >
                </Div>
            </Div>

            <Div width="100%" height="80%" margin="0 .5rem 2% .5rem" backcolor="#FFF" direction="column" alignItems="center" justify="flex-start" >
                <Div width="95%" margin=".5rem" padding="0" justify="center" backcolor="#FFF" >
                    <BorderTable className="uk-table uk-table-middle uk-table-divider uk-table-hover">
                        <thead>
                            <tr>
                                <th>{Constants.CREATOR}名</th>
                                <th>{Constants.SALES}</th>
                                <th>{Constants.PAID_AMOUNT}</th>
                                <th>{Constants.COMPENSATION}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                creatorList.length > 0 && creatorList.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><a href="#" onClick={() => handlePersonalData(item.userID)} >{item.name.nickname}</a></td>
                                            <td>40,000</td>
                                            <td>20,000</td>
                                            <td>20,000</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </BorderTable> 
                </Div>
            </Div>
            <Div width="100%" height="80%" margin="0 .5rem 2% .5rem" backcolor="transparent" direction="row" alignItems="center" justify="center" >
                <Input className="uk-input" type="text" name="address" placeholder="" value={"合計"} />
                <Input className="uk-input" type="text" name="address" placeholder="" value={"合計"} />
                <Input className="uk-input" type="text" name="address" placeholder="" value={"合計"} />
            </Div>
            <Div width="100%" height="80%" margin="0 .5rem 2% .5rem" backcolor="transparent" direction="row" alignItems="center" justify="center" >
                <Btn width="12%" radius="5px"  backcolor="#4E8338" color="#FFF" border="none" padding=".5rem 1rem" margin="1rem .2rem" text="Excel CSV" />
                {/* <Btn width="12%" radius="5px"  backcolor="#9B8B68" color="#FFF" border="none" padding=".5rem 1rem" margin="1rem .2rem" text="全銀協フォーマット" /> */}
            </Div>

        </BlockContent>
    </MainContent>
  );
}

