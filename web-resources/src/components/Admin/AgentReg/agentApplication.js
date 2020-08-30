import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import media from 'styled-media-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import agent from '../../../store/actions/agent';
import main from '../../../store/actions/main';
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
    margin-top: 2%;
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
  border: none;
  border-bottom: 1px solid #A3B5C1;
  background-color: #FFF;
  box-shadow: none;
  outline: none;
  height: 40px;

  &:focus {
    border-bottom: 1px solid #A3B5C1;
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

export default (props) => {
  let dispatch = useDispatch();
  let history = useHistory();
  const [agentListSource, setAgentListSource] = useState([])
  const [agentList, setAgentList] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [chargePersonName, setChargePersonName] = useState("");
  const [agentID, setAgentID] = useState("100000");
  const mainState = useSelector( state => state.main );
  const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
  useEffect(() => {
    if(typeof mainState.user !== 'undefined' && mainState.user.auth_level >= 3){
      setAgentID(mainState.user.agent_id);
    }
  }, [mainState.user])

  useEffect(() => {
    if(typeof mainState.agent !== 'undefined'){
      const applicationTemp = mainState.agent.applications.result;
      const holdsTemp = mainState.agent.holds.result;
      setAgentList([...applicationTemp, ...holdsTemp]);
      setAgentListSource([...applicationTemp, ...holdsTemp]);
    }
  }, [mainState.agent])
    
    const handleSearch = () => {
      console.log("agentListSource", agentListSource);
      let agetnListData = [];
      // dispatch(agent.trySearch({uid: agentID, name: name, address: address, bankName: bankName, chargePersonName: chargePersonName}));
      const agentListTemp = agentListSource.filter(item => ((item.name.nickname.includes(name)  || item.name.ruby.includes(name)) && item.address.value.includes(address) && item.delegate.name.includes(chargePersonName)));
        agetnListData = [...agetnListData, ...agentListTemp];
      setAgentList(agetnListData);

    }

    const handleApplication = (agentID, currentStatus) => {
        console.log("agentID", agentID);
        if(agentID !== null){
            dispatch(main.getOtherAgentAccountInfo(agentID));
            props.changeComponent(agentID, currentStatus);
            // history.push('/admin/agent/application');
        }
    }

    return (
    <MainContent>
        <BlockContent>
            <Div width="100%" height="80%" margin=".5rem .5rem 2% .5rem" backcolor="#FFF" direction="column" alignItems="center" justify="flex-start" >
              <Div width="90%" margin=".5rem .5rem 2% .5rem" padding="0" backcolor="transparent"  justify="space-around" >
                <div className="uk-inline" style={{width: '30%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}} >
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="name" placeholder={`${Constants.AGENT_NAME}/${Constants.ACCOUNT_NAME}`} onChange={ (e) => setName(e.target.value) } value={name} />
                </div>
                <div className="uk-inline" style={{width: '30%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}}>
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="address" placeholder={Constants.ADDRESS} onChange={ (e) => setAddress(e.target.value) } value={address} />
                </div>
                <div className="uk-inline" style={{width: '30%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}} >
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="chargePersonName" placeholder={`${Constants.CHARGE_PERSON_NAME}`} onChange={ (e) => setChargePersonName(e.target.value) } value={chargePersonName} />
                </div>
              </Div>
              <Div width="90%"margin="0 .5rem 2% .5rem" padding="0" backcolor="transparent"  justify="flex-end">
                <Btn width="20%" radius="3px" border={ `1px solid ${theme_color}` } backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1.5rem 0 0" text={Constants.SEARCH} onClick={() => handleSearch()} />
              </Div>
              <Div width="95%" margin=".5rem" padding="0" justify="center" backcolor="#FFF" >
                <table className="uk-table uk-table-middle uk-table-divider uk-table-hover">
                  <thead>
                      <tr>
                          <th className="uk-width-small">次</th>
                          <th>{Constants.AGENT_NAME}</th>
                          <th>{Constants.CHARGE_PERSON_TEL}</th>
                          <th>登録日</th>
                          <th className="uk-width-small">ステータス</th>
                      </tr>
                  </thead>
                  <tbody>
                    { (agentList && agentList.length > 0) ? agentList.map((item, index) => {
                      console.log("agentlist===>", agentList);
                      if(item.approval_status === 0 || item.approval_status === 2){
                        if(agentID.toString() === "100000"){
                          if(item.parentAgentID === "100000"){
                            return (
                              <tr key={index}>
                                <td>{`${item.agentLevel}次`}</td>
                                <td><a href="#" onClick={() => handleApplication(item.agent_id, item.approval_status)}>{item.name.nickname}</a></td>
                                <td>{item.delegate.tel}</td>
                                <td>{item.created_at ? Constants.convert_date(Number(item.created_at)) : Constants.convert_date(Number(item.updated_at))}</td>
                                <td><ApplicationStatus status={item.approval_status ? item.approval_status : 0} /></td>
                              </tr>
                            )
                          }
                          else{
                            if((item.approval_status === 0 && item.preApprovalStatus !== 0) || (item.approval_status === 0 && item.approval_status_p === 1) || (item.approval_status === 2 && item.approval_status_p === 1)){
                              return (
                                <tr key={index}>
                                  <td>{`${item.agentLevel}次`}</td>
                                  <td><a href="#" onClick={() => handleApplication(item.agent_id, item.approval_status)}>{item.name.nickname}</a></td>
                                  <td>{item.delegate.tel}</td>
                                  <td>{item.created_at ? Constants.convert_date(Number(item.created_at)) : Constants.convert_date(Number(item.updated_at))}</td>
                                  <td><ApplicationStatus status={item.approval_status ? item.approval_status : 0} /></td>
                                </tr>
                              )
                            }
                          }
                        }
                        else{
                          if((item.approval_status === 0 && item.preApprovalStatus === 0 && item.approval_status_p === 0) || (item.approval_status === 2 && item.approval_status_p === 0)){
                            return (
                              <tr key={index}>
                                <td>{`${item.agentLevel}次`}</td>
                                <td><a href="#" onClick={() => handleApplication(item.agent_id, item.approval_status)}>{item.name.nickname}</a></td>
                                <td>{item.delegate.tel}</td>
                                <td>{item.created_at ? Constants.convert_date(Number(item.created_at)) : Constants.convert_date(Number(item.updated_at))}</td>
                                <td><ApplicationStatus status={item.approval_status ? item.approval_status : 0} /></td>
                              </tr>
                            )
                          }
                        }
                      }
                    }) : (
                      <tr>
                        <td colSpan="5" style={{textAlign: "center"}}>
                          <Text str="検索結果がありません" width="80%" textAlign="center" color="#333" margin=".5rem" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table> 
              </Div>
            </Div>
        </BlockContent>
    </MainContent>
  );
}

