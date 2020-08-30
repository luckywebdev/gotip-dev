import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import media from 'styled-media-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSortAlphaUp, faSortAlphaDown } from '@fortawesome/free-solid-svg-icons'
import agent from '../../../store/actions/agent';
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
  const [sortDirection, setSortDirection] = useState("asc");
  const [agentListSource, setAgentListSource] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [name, setName] = useState("");
  const [agentLevel, setAgentLevel] = useState('3');
  const [address, setAddress] = useState("");
  const [bankName, setBankName] = useState("");
  const [chargePersonName, setChargePersonName] = useState("");
  const [agentID, setAgentID] = useState("100000");
  const [prevMonth, setPrevMonth] = useState("");
  const [curretnMonth, setCurretnMonth] = useState("");
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
    
    const handleSearch = () => {
      console.log("agentListSource", agentListSource);
      let agetnListData = [];
      // dispatch(agent.trySearch({uid: agentID, name: name, address: address, bankName: bankName, chargePersonName: chargePersonName}));
      const agentListTemp = agentListSource.filter(item => ((item.name.nickname.includes(name)  || item.name.ruby.includes(name)) && item.address.value.includes(address) && item.bank_name.includes(bankName) && item.delegate.name.includes(chargePersonName)));
        agetnListData = [...agetnListData, ...agentListTemp];
      setAgentList(agetnListData);

    }

    const handleSort = (sortField, subSortField = null) => {
      if(sortDirection === "asc"){
        setSortDirection('desc');
      }
      else{
        setSortDirection('asc');
      }
      const agentListTemp = agentList.sort(Constants.compareValues(sortField, sortDirection, subSortField));
      setAgentList(agentListTemp);
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
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}}>
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="bankName" placeholder={Constants.BANK_NAME} onChange={ (e) => setBankName(e.target.value) } value={bankName} />
                </div>
              </Div>
              <Div width="90%" margin="0 .5rem 2% .5rem" padding="0" backcolor="transparent" justify="space-around" >
                <div className="uk-inline" style={{width: '30%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}} >
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="chargePersonName" placeholder={`${Constants.CHARGE_PERSON_NAME}`} onChange={ (e) => setChargePersonName(e.target.value) } value={chargePersonName} />
                </div>
                <div className="uk-inline" style={{width: '30%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}} >
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <span className="uk-form-icon uk-form-icon-flip" href="#" >
                      以上
                    </span>
                    <Input className="uk-input" type="text" name="prevMonth" placeholder="先月売り上げ" 以上 onChange={ (e) => setPrevMonth(e.target.value) } value={prevMonth} />
                </div>
                <div className="uk-inline" style={{width: '30%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}} >
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <span className="uk-form-icon uk-form-icon-flip" href="#" >
                      以上
                    </span>
                    <Input className="uk-input" type="text" name="curretnMonth" placeholder="今月売り上げ" onChange={ (e) => setCurretnMonth(e.target.value) } value={curretnMonth} />
                </div>
              </Div>
              <Div width="90%"margin="0 .5rem 2% .5rem" padding="0" backcolor="transparent"  justify="flex-end">
                <Btn width="20%" radius="3px" border={ `1px solid ${theme_color}` } backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1.5rem 0 0" text={Constants.SEARCH} onClick={() => handleSearch()} />
              </Div>
              <Div width="95%" margin=".5rem" padding="0" justify="center" backcolor="#FFF" >
                <table className="uk-table uk-table-middle uk-table-divider uk-table-hover">
                  <thead>
                      <tr>
                          <th className="uk-width-small" onClick={() => handleSort('agentLevel')} style={{cursor: "pointer"}} >次<FontAwesomeIcon icon={ sortDirection === 'asc' ? faSortAlphaUp : faSortAlphaDown } color="#787C7F"/></th>
                          <th className="uk-width-small" onClick={() => handleSort('parentAgentName')} style={{cursor: "pointer"}} >所属<FontAwesomeIcon icon={ sortDirection === 'asc' ? faSortAlphaUp : faSortAlphaDown } color="#787C7F"/></th>
                          <th onClick={() => handleSort('name', 'nickname')} style={{cursor: "pointer"}} >{Constants.AGENT_NAME}<FontAwesomeIcon icon={ sortDirection === 'asc' ? faSortAlphaUp : faSortAlphaDown } color="#787C7F"/></th>
                          <th>{Constants.CHARGE_PERSON_TEL}</th>
                          <th>前月売上</th>
                          <th onClick={() => handleSort('created_at')} style={{cursor: "pointer"}}>登録日<FontAwesomeIcon icon={ sortDirection === 'asc' ? faSortAlphaUp : faSortAlphaDown } color="#787C7F"/></th>
                          <th className="uk-width-small">ステータス</th>
                          <th>今月売上</th>
                      </tr>
                  </thead>
                  <tbody>
                    { (agentList && agentList.length > 0) ? agentList.map((item, index) => {
                      console.log("agentlist===>", item.created_at);
                      return (
                        <tr key={index}>
                          <td>{`${item.agentLevel}次`}</td>
                          <td>{item.parentAgentName}</td>
                          <td>{item.name.nickname}</td>
                          <td>{item.delegate.tel}</td>
                          <td></td>
                          <td>{item.created_at ? Constants.convert_date(Number(item.created_at)) : Constants.convert_date(Number(item.updated_at))}</td>
                          <td>{item.approval_status !== 3 && (<ApplicationStatus status={item.approval_status ? item.approval_status : 0} />) }</td>
                          <td></td>
                        </tr>
                      )
                    }) : (
                      <tr>
                        <td colSpan="7" style={{textAlign: "center"}}>
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

