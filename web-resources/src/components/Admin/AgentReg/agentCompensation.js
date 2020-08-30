import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import Datetime from "react-datetime";
import moment from "moment";
import 'moment/locale/ja';
import styled from 'styled-components';
import media from 'styled-media-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Btn from '../../UI/btn';
import Img from '../../UI/img';
import Text from '../../UI/text';
import Div from '../../UI/div';
import Anchor from '../../UI/a';

// import "react-datepicker/dist/react-datepicker.css";
import 'react-datetime/css/react-datetime.css'

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
    const [applicationStatus, setApplicationStatus] = useState(1);
    const [filter, setFilter] = useState(0);
    const [agentListSource, setAgentListSource] = useState([])
    const [agentLevel, setAgentLevel] = useState('3');
    const [agentID, setAgentID] = useState("100000");
    const [agentList, setAgentList] = useState([]);
    const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
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

    // const [startDate, setStartDate] = useState(new Date());
    const handleDateTimePicker = (moment, name) => {
        console.log(name, moment.format("YYYY-MM-DD"), "name");
        if(name === 'startDate')
            setStartDate(moment.format("YYYY-MM-DD"));
        else
            setEndDate(moment.format("YYYY-MM-DD"));
    };

    
    return (
    <MainContent>
        <BlockContent>
            <Div width="100%" margin="0.5rem .5rem 0 .5rem" padding="0" backcolor="transparent"  justify="space-between" >
                <Div width="25%" margin="0" padding="0" backcolor="transparent"  justify="space-between" >
                    <Datetime
                        type="startDate"
                        timeFormat={false}
                        inputProps={{ placeholder: "Select Date" }}
                        required={true}
                        name="startDate"
                        value={startDate}
                        defaultValue={startDate}
                        dateFormat="YYYY-MM-DD"
                        locale="jp"
                        closeOnSelect
                        onChange={(moment) =>
                            handleDateTimePicker(moment, "startDate")
                        }
                    />
                    <span>-</span>
                    <Datetime
                        type="endDate"
                        timeFormat={false}
                        inputProps={{ placeholder: "Select Date" }}
                        required={true}
                        name="endDate"
                        value={endDate}
                        defaultValue={endDate}
                        dateFormat="YYYY-MM-DD"
                        locale="jp"
                        closeOnSelect
                        onChange={(moment) =>
                            handleDateTimePicker(moment, "endDate")
                        }
                    />     
                </Div>
                <Div width="25%" height="40px" margin="0" padding="0" backcolor="transparent" justify="flex-start" style={{borderBottom: "1px solid #EAEAEA"}} >
                    <span>売上 ００００００円</span>
                </Div>
            </Div>
            <Div width="100%" margin="0.8rem .5rem 0 .5rem" padding="0" backcolor="transparent"  justify="space-between" >
                <Div width="35%" margin="0" padding="0" backcolor="transparent"  justify="center" >
                    {
                        filterOptions.map((item, index) => (
                            <Btn key={index} width="20%" radius="0px"  backcolor={filter === index ? "#77ADC5" : "#B6D4E2"} color="#FFF" border="none" padding=".5rem .5rem" margin="0 .2rem" text={item} onClick={() => setFilter(index)} />
                        ))
                    }
                </Div>
                <Div width="25%" height="40px" margin="0" padding="0" backcolor="transparent" justify="flex-start" style={{borderBottom: "1px solid #EAEAEA"}} >
                    <span>支払合計額 ００００００円</span>
                </Div>
            </Div>

            <Div width="100%" height="80%" margin="0 .5rem 2% .5rem" backcolor="#FFF" direction="column" alignItems="center" justify="flex-start" >
                <Div width="95%" margin=".5rem" padding="0" justify="center" backcolor="#FFF" >
                    <table className="uk-table uk-table-middle uk-table-divider uk-table-hover">
                        <thead>
                            <tr>
                                <th className="uk-width-small">階級</th>
                                <th>{Constants.AGENT_NAME}</th>
                                <th>売り上げ</th>
                                <th>支払い</th>
                                <th>差引報酬金額</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2次</td>
                                <td>TMAGO</td>
                                <td>40,000</td>
                                <td>20,000</td>
                                <td>20,000</td>
                            </tr>
                            <tr>
                                <td>2次</td>
                                <td>NIWATORI</td>
                                <td>40,000</td>
                                <td>20,000</td>
                                <td>20,000</td>
                            </tr>
                            <tr>
                                <td>3次</td>
                                <td>HIYOKO</td>
                                <td>60,000</td>
                                <td>30,000</td>
                                <td>30,000</td>
                            </tr>
                        </tbody>
                    </table> 
                </Div>
            </Div>
            <Div width="100%" height="80%" margin="0 .5rem 2% .5rem" backcolor="transparent" direction="row" alignItems="center" justify="center" >
                <Input className="uk-input" type="text" name="address" placeholder="" value={"合計"} />
                <Input className="uk-input" type="text" name="address" placeholder="" value={"合計"} />
                <Input className="uk-input" type="text" name="address" placeholder="" value={"合計"} />
            </Div>
            <Div width="100%" height="80%" margin="0 .5rem 2% .5rem" backcolor="transparent" direction="row" alignItems="center" justify="center" >
                <Btn width="12%" radius="5px"  backcolor="#4E8338" color="#FFF" border="none" padding=".5rem 1rem" margin="1rem .2rem" text="Excel CSV" />
                <Btn width="12%" radius="5px"  backcolor="#9B8B68" color="#FFF" border="none" padding=".5rem 1rem" margin="1rem .2rem" text="全銀協フォーマット" />
            </Div>

        </BlockContent>
    </MainContent>
  );
}

