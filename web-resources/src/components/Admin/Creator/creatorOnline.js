import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import media from 'styled-media-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSortAlphaUp, faSortAlphaDown } from '@fortawesome/free-solid-svg-icons'
import main from '../../../store/actions/main';
import admin from '../../../store/actions/admin';

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


export default (props) => {
  let dispatch = useDispatch();
  const [sortDirection, setSortDirection] = useState("asc");
  const [creatorListSource, setCreatorListSource] = useState([])
  const [creatorList, setCreatorList] = useState([]);
  const [name, setName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentID, setAgentID] = useState("100000");
  const adminState = useSelector( state => state.admin );
  const mainState = useSelector( state => state.main );
  const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
  useEffect(() => {
    if(typeof mainState.user !== 'undefined' && mainState.user.auth_level >= 3){
      setAgentID(mainState.user.agent_id);
      dispatch(admin.tryCreatorSearch(mainState.user.agent_id));
    }
  }, [mainState.user])

  useEffect(() => {
    if(typeof adminState.creatorList !== 'undefined'){
      setCreatorList(adminState.creatorList);
      setCreatorListSource(adminState.creatorList);
    }
  }, [adminState.creatorList])
    
    const handleSearch = () => {
      console.log("creatorListSource", creatorListSource);
      let creatorListData = [];
      // dispatch(agent.trySearch({uid: agentID, name: name, address: address, bankName: bankName, chargePersonName: chargePersonName}));
      const creatorListTemp = creatorListSource.filter(item => ((item.name.nickname.includes(name)  || item.userID.includes(name) || item.name.value.includes(name)) && item.agentName.includes(agentName)));
        creatorListData = [...creatorListData, ...creatorListTemp];
      setCreatorList(creatorListData);

    }

    const handleDetail = (userID) => {
      if(userID !== null){
        dispatch(main.getOtherAgentAccountInfo(userID));
        props.changeComponent(userID);
        // history.push('/admin/agent/application');
    }
  }

  const handleSort = (sortField, subSortField = null) => {
    if(sortDirection === "asc"){
      setSortDirection('desc');
    }
    else{
      setSortDirection('asc');
    }
    const creatorListTemp = creatorList.sort(Constants.compareValues(sortField, sortDirection, subSortField));
    setCreatorList(creatorListTemp);
  }

  return (
    <MainContent>
        <BlockContent>
            <Div width="100%" height="80%" margin=".5rem .5rem 2% .5rem" backcolor="#FFF" direction="column" alignItems="center" justify="flex-start" >
              <Div width="90%" margin=".5rem .5rem 2% .5rem" padding="0" backcolor="transparent"  justify="center" >
                <div className="uk-inline" style={{width: '85%', borderBottom: '1px solid #999', textAlign: "center"}}>
                    <Text  str={`オンラインー覧`} textAlign="right" color="#333" fontSize="1.1rem" fontWeight="900" margin="0 .5rem" />
                    <Text  str={`${Constants.SEARCH_ITEM}`} textAlign="left" color="#333" fontSize="1.1rem" fontWeight="900" margin="0 .5rem" />
                  </div>
              </Div>
              <Div width="90%" margin=".5rem .5rem 2% .5rem" padding="0" backcolor="transparent"  justify="space-around" >
                <div className="uk-inline" style={{width: '35%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}} >
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="name" placeholder={`ID/${Constants.SIGNUP_1_NICKNAME}/${Constants.NAME}`} onChange={ (e) => setName(e.target.value) } value={name} />
                </div>
                <div className="uk-inline" style={{width: '35%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}}>
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="agentName" placeholder={Constants.AGENT_NAME} onChange={ (e) => setAgentName(e.target.value) } value={agentName} />
                </div>
              </Div>
              <Div width="90%"margin="0 .5rem 2% .5rem" padding="0" backcolor="transparent"  justify="center">
                <Btn width="15%" radius="20px" border="none" backcolor="#AC1E1C" color="#FFF" padding=".5rem 2rem" margin="0 1.5rem 0 0" text={Constants.SEARCH} onClick={() => handleSearch()} />
              </Div>
              <Div width="95%" margin=".5rem" padding="0" justify="center" backcolor="#FFF" >
                <table className="uk-table uk-table-middle uk-table-divider uk-table-hover">
                  <thead>
                      <tr>
                          <th className="uk-width-small" onClick={() => handleSort('agentName')} style={{cursor: "pointer"}} >所属<FontAwesomeIcon icon={ sortDirection === 'asc' ? faSortAlphaUp : faSortAlphaDown } color="#787C7F"/></th>
                          <th className="uk-width-small" onClick={() => handleSort('userID')} style={{cursor: "pointer"}}>ID<FontAwesomeIcon icon={ sortDirection === 'asc' ? faSortAlphaUp : faSortAlphaDown } color="#787C7F"/></th>
                          <th onClick={() => handleSort('name', 'nickname')} style={{cursor: "pointer"}}>{Constants.SIGNUP_1_NICKNAME}<FontAwesomeIcon icon={ sortDirection === 'asc' ? faSortAlphaUp : faSortAlphaDown } color="#787C7F"/></th>
                          <th>接続機種</th>
                          <th>{Constants.POINT}</th>
                      </tr>
                  </thead>
                  <tbody>
                    { (creatorList && creatorList.length > 0) ? creatorList.map((item, index) => {
                      if(item.loggedin){
                        console.log("agentlist===>", item.created_at);
                        return (
                          <tr key={index}>
                            <td>{`${item.agentName}`}</td>
                            <td>{item.userID}</td>
                            <td><a href="#" onClick={() => handleDetail(item.userID)} >{item.name.nickname}</a></td>
                            <td></td>
                            <td></td>
                          </tr>
                        )
                      }
                    }) : (
                      <tr>
                        <td colSpan="6" style={{textAlign: "center"}}>
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

