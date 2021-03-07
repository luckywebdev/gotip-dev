import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import media from 'styled-media-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSortAlphaUp, faSortAlphaDown } from '@fortawesome/free-solid-svg-icons'

import Datetime from "react-datetime";
import moment from "moment";
import 'moment/locale/ja';

import agent from '../../../store/actions/agent';
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
    .rdt {
      width: 30%;
      input[type="text"] {
          width: 95%;
          padding: .5rem 0 .5rem .5rem !important;
          box-sizing: border-box;
          border-color: -internal-light-dark(rgb(138, 118, 118), rgb(195, 195, 195));
      }
  }
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
  const [allchecked, setAllchecked] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [creatorChk, setCreatorChk] = useState(false);
  const [fanChk, setFanChk] = useState(false);
  const [deletedChk, setDeletedChk] = useState(false);
  const [nickname, setNickname] = useState("")
  const [name, setName] = useState("");
  const [agentName, setAgentName] = useState('');
  const [userID, setUserID] = useState("");
  const [agentID, setAgentID] = useState("");
  const [userList, setUserList] = useState([]);
  const adminState = useSelector( state => state.admin );
  const mainState = useSelector( state => state.main );
  const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
  const gender = {'male': '男', 'female': '女', 'other': ''}

  useEffect(() => {
    if(typeof adminState.userList !== 'undefined' && typeof adminState.userList.name !== 'undefined'){
      const userListTemp = adminState.userList.map((item, index) => {
        item.checked = false;
        return item;
      })
      setUserList(userListTemp);
    }
  }, [adminState.userList])
    
  const handleSearch = () => {
    const filterData = {startDate, endDate, nickname, name, agentName, userID, agentID, creatorChk, fanChk, deletedChk};
    dispatch(admin.tryUserSearch(filterData));
  }

  const handleDateTimePicker = (moment, name) => {
    console.log(name, moment.format("YYYY-MM-DD"), "name");
    if(name === 'startDate')
      setStartDate(moment.format("YYYY-MM-DD"));
    else
      setEndDate(moment.format("YYYY-MM-DD"));
  };

  const setAllChk = () => {
    if(allchecked){
      setAllchecked(false);
      const userListTemp = userList.map(item => {
        item.checked = false;
        return item;
      })
      setUserList(userListTemp);
    }
    else {
      setAllchecked(true);
      const userListTemp = userList.map(item => {
        item.checked = true;
        return item;
      })
      setUserList(userListTemp);
    }

  }


  const setCheckedChange = (e) => {
    const userListTemp = userList;
    setUserList([]);
    console.log(e.target.value, e.target.checked);
    userListTemp.forEach(item => {
       if (item.userID === e.target.value)
          item.checked = !item.checked
    })
    setTimeout(()=>{
      setUserList(userListTemp);
    }, 5)
  }

  const handleDelete = (userID) => {
    const sendData = [userID];
    const filterData = {startDate, endDate, nickname, name, agentName, userID, agentID, creatorChk, fanChk, deletedChk};

    dispatch(admin.tryUserDelete(sendData, filterData))
  }

  const handleMultiDelete = () => {
    const res = [];
    for(const item of userList) {
      if(item.checked === true){
        res.push(item.userID);
      }
    }
    const filterData = {startDate, endDate, nickname, name, agentName, userID, agentID, creatorChk, fanChk, deletedChk};
    dispatch(admin.tryUserDelete(res, filterData))

  }

  const handleSort = (sortField, subSortField = null) => {
    if(sortDirection === "asc"){
      setSortDirection('desc');
    }
    else{
      setSortDirection('asc');
    }
    const userListTemp = userList.sort(Constants.compareValues(sortField, sortDirection, subSortField));
    setUserList(userListTemp);
  }

  return (
    <MainContent>
        <BlockContent>
            <Div width="100%" height="80%" margin=".5rem .5rem 0 .5rem" backcolor="#FFF" direction="column" alignItems="center" justify="flex-start" >
              <Div width="90%" margin=".5rem .5rem 0.8rem .5rem" padding="0" backcolor="transparent"  justify="space-around" >
                <Div width="30%" margin="0" padding="0" backcolor="transparent"  justify="flex-start" >
                  <span style={{marginRight: ".5rem"}}>登録日</span>
                  <Datetime
                        type="startDate"
                        timeFormat={false}
                        inputProps={{ placeholder: "Select Date" }}
                        required={true}
                        name="startDate"
                        value={startDate}
                        dateFormat="YYYY-MM-DD"
                        locale="jp"
                        closeOnSelect
                        onChange={(moment) =>
                            handleDateTimePicker(moment, "startDate")
                        }
                    />
                    <span style={{margin: ".5rem"}}>-</span>
                    <Datetime
                        type="endDate"
                        timeFormat={false}
                        inputProps={{ placeholder: "Select Date" }}
                        required={true}
                        name="endDate"
                        value={endDate}
                        dateFormat="YYYY-MM-DD"
                        locale="jp"
                        closeOnSelect
                        onChange={(moment) =>
                            handleDateTimePicker(moment, "endDate")
                        }
                    />     
                </Div>
                <div className="uk-inline" style={{width: '30%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}}>
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="nickname" placeholder={Constants.SIGNUP_1_NICKNAME} onChange={ (e) => setNickname(e.target.value) } value={nickname} />
                </div>
                <div className="uk-inline" style={{width: '30%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}}>
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="bankName" placeholder={Constants.NAME} onChange={ (e) => setName(e.target.value) } value={name} />
                </div>
              </Div>
              <Div width="90%" margin="0 .5rem 0.5rem .5rem" padding="0" backcolor="transparent" justify="space-around" >
                <div className="uk-inline" style={{width: '30%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}} >
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="agentName" placeholder={`${Constants.AGENT_NAME}`} onChange={ (e) => setAgentName(e.target.value) } value={agentName} />
                </div>
                <div className="uk-inline" style={{width: '30%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}} >
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="userID" placeholder="USERID" onChange={ (e) => setUserID(e.target.value) } value={userID} />
                </div>
                <div className="uk-inline" style={{width: '30%'}}>
                    <span className="uk-form-icon" href="#" style={{borderRadius: "50%", background: "#D74A74", color: "#FFF", width: "30px", height: "30px", top: "50%", transform: "translateY(-50%)"}} >
                        <FontAwesomeIcon icon={ faSearch } color="#FFF"/>
                    </span>
                    <Input className="uk-input" type="text" name="agentID" placeholder={`${Constants.AGENTID}`} onChange={ (e) => setAgentID(e.target.value) } value={agentID} />
                </div>
              </Div>
              <Div width="90%" margin=".5rem .5rem 0.5rem .5rem" padding="0" backcolor="transparent"  justify="space-around" >
                <div className="uk-inline" style={{width: '30%', borderBottom: "1px solid #A3B5C1"}}>
                  <label style={{width: "100%"}}><input className="uk-checkbox" type="checkbox" name="terms_agree" onChange={ (e) => setCreatorChk(!creatorChk) } checked={ creatorChk === true } style={{marginRight: "2%"}} />{Constants.CREATOR}</label>
                </div>
                <div className="uk-inline" style={{width: '30%', borderBottom: "1px solid #A3B5C1"}}>
                  <label style={{width: "100%"}}><input className="uk-checkbox" type="checkbox" name="terms_agree" onChange={ (e) => setFanChk(!fanChk) } checked={ fanChk === true } style={{marginRight: "2%"}} />{Constants.FAN}</label>
                </div>
                <div className="uk-inline" style={{width: '30%', borderBottom: "1px solid #A3B5C1"}}>
                  <label style={{width: "100%"}}><input className="uk-checkbox" type="checkbox" name="terms_agree" onChange={ (e) => setDeletedChk(!deletedChk) } checked={ deletedChk === true } style={{marginRight: "2%"}} />{Constants.DELETED}</label>
                </div>
              </Div>
              <Div width="90%"margin="0 .5rem 2% .5rem" padding="0" backcolor="transparent"  justify="flex-end">
                <Btn width="20%" radius="3px" border={ `1px solid ${theme_color}` } backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1.5rem 0 0" text={Constants.SEARCH} onClick={() => handleSearch()} />
              </Div>
              <Div width="95%" margin=".5rem" padding="0" justify="center" alignItems="flex-start" backcolor="#FFF" height="400px" style={{overflowY: "auto"}}  >
                <table className="uk-table uk-table-middle uk-table-divider uk-table-hover">
                  <thead>
                      <tr>
                          <th className="uk-width-small"><input className="uk-checkbox" type="checkbox" name="terms_agree" onChange={ () => setAllChk() } checked={allchecked || false} /></th>
                          <th className="uk-width-small" onClick={() => handleSort('userID')} style={{cursor: "pointer"}}>USERID<FontAwesomeIcon icon={ sortDirection === 'asc' ? faSortAlphaUp : faSortAlphaDown } color="#787C7F"/></th>
                          <th onClick={() => handleSort('name', 'nickname')} style={{cursor: "pointer"}}>{Constants.SIGNUP_1_NICKNAME}<FontAwesomeIcon icon={ sortDirection === 'asc' ? faSortAlphaUp : faSortAlphaDown } color="#787C7F"/></th>
                          <th onClick={() => handleSort('created_at')} style={{cursor: "pointer"}}>登録日<FontAwesomeIcon icon={ sortDirection === 'asc' ? faSortAlphaUp : faSortAlphaDown } color="#787C7F"/></th>
                          <th className="uk-width-small" onClick={() => handleSort('sex')} style={{cursor: "pointer"}}>{Constants.SIGNUP_2_GENDER}<FontAwesomeIcon icon={ sortDirection === 'asc' ? faSortAlphaUp : faSortAlphaDown } color="#787C7F"/></th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                    { (userList && userList.length > 0) ? userList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td><input className="uk-checkbox" type="checkbox" value={item.userID} checked={item.checked} onChange={(e) => setCheckedChange(e)} /></td>
                          <td>{item.userID}</td>
                          <td>{item.name.nickname}</td>
                          <td>{item.created_at ? Constants.convert_fulldate(Number(item.created_at)) : Constants.convert_fulldate(Number(item.updated_at))}</td>
                          <td>{gender[item.sex]}</td>
                          <td>
                            <Btn width="80%" radius="20px" border={ `1px solid ${theme_color}` } backcolor={theme_color} color="#FFF" padding=".2rem 2rem" margin="0 1.5rem 0 0" text={Constants.DELETE} onClick={() => handleDelete(item.userID)} />
                          </td>
                        </tr>
                      )
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
              <Div width="90%"margin="0.5rem .5rem 0 .5rem" padding="0" backcolor="transparent"  justify="flex-end">
                <Btn width="20%" radius="3px" border={ `1px solid ${theme_color}` } backcolor={theme_color} color="#FFF" padding=".3rem 2rem" margin="0 1.5rem 0 0" text="選択一括削除" onClick={() => handleMultiDelete()} />
              </Div>

            </Div>
        </BlockContent>
    </MainContent>
  );
}

