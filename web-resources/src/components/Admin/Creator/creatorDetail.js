import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import agent from '../../../store/actions/agent';
import main from '../../../store/actions/main';
import admin from '../../../store/actions/admin';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import media from 'styled-media-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import InputMask from 'react-input-mask';

import Btn from '../../UI/btn';
import Img from '../../UI/img';
import Text from '../../UI/text';
import Div from '../../UI/div';
import Anchor from '../../UI/a';
import LoadingCover from '../../UI/loadingCover';

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
    width: 50%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
`;

const BirthDaySelect = styled.select`
  width: auto;
`
const RightMarginLabel = styled.label`
  margin-right: 1em;
`

const Input = styled.input`
  border: 1px solid #A3B5C1;
  background-color: #FFF;
  box-shadow: none;
  outline: none;
  height: 30px;
  padding: 0rem 1rem;
  box-sizing: border-box;
  border-radius: 5px;
  &:focus {
    border: 1px solid #707070;
  }
  &:disabled {
      border: none;
      background: #FFF;
  }
  ${media.lessThan("large")`
    height: 40px;
  `}
`;

const InputMaskStyle = {
    backgroundColor: "#FFF",
    border: "1px solid #A3B5C1",
    padding: "0rem 1rem",
    height: '30px',
    margin: '0px',
    width: '40%',
    boxShadow: 'none',
    outline: 'none',
    borderRadius: '5px',
    boxSizing: 'border-box'
  }

const ErrorMsg = styled.div`
  color: red;
`;

const GenerateBirthDaySelect = (props) => {
    console.log("birthdate", props);
    let thisYear = new Date().getFullYear()
    if (!thisYear) thisYear = 2020
    const yearArray = [<option key={ 0 }>----</option>]
    for (let year = 1900; year < thisYear + 1; year++) {
      yearArray.push(<option key={ year }>{ year }</option>)
    }
  
    const monthArray = [<option key={ 0 }>--</option>]
    for (let month = 1; month < 13; month++) {
      monthArray.push(<option key={ month }>{ month }</option>)
    }
  
    const dayArray = [<option key={ 0 }>--</option>]
    for (let day = 1; day < 32; day++) {
      dayArray.push(<option key={ day }>{ day }</option>)
    }
    
    return (
      <React.Fragment>
          <BirthDaySelect className="uk-select" name="year" value={ props.birthdate.year } onChange={ (e) => props.handleSelectChange(e) }>
            { yearArray }
          </BirthDaySelect>
          <span>年</span>
          <BirthDaySelect className="uk-select" name="month" value={ props.birthdate.month } onChange={ (e) => props.handleSelectChange(e) }>
            { monthArray }
          </BirthDaySelect>
          <span>月</span>
          <BirthDaySelect className="uk-select" name="day" value={ props.birthdate.day } onChange={ (e) => props.handleSelectChange(e) }>
            { dayArray }
          </BirthDaySelect>
          <span>日</span>
      </React.Fragment>
    )
  }
  
export default (props) => {
    let dispatch = useDispatch();
    const types = ['approved', 'applications', 'holds', 'refused'];
    const agentState = useSelector(state => state.agent);
    const [agentID, setAgentID] = useState("");
    const [directFlag, setDirectFlag] = useState(false);
    const [inputVal, setInputVal] = useState({});
    const [creatorData, setCreatorData] = useState({});
    const [creatorBankData, setCreatorBankData] = useState({});
    const mainState = useSelector( state => state.main );
    console.log("otherUser", mainState.otherUser);
    useEffect(() => {
        let otherData = {};
        if(typeof mainState.otherUser !== "undefined" && typeof mainState.otherUser.name !== "undefined"){
            setCreatorData(mainState.otherUser);
            otherData = {...otherData, ...mainState.otherUser};
            otherData.ruby = mainState.otherUser.name.ruby;
            otherData.nickname = mainState.otherUser.name.nickname;
            otherData.name = mainState.otherUser.name.value;            
            otherData.tel = String(mainState.otherUser.tel).replace(/^\+81/, '');
            // setInputVal(otherData);
        }
        if(typeof mainState.otherUserBank !== 'undefined'){

            setCreatorBankData(mainState.otherUserBank);
            console.log("otherUser-inputVal", otherData);
            otherData = {...otherData, ...mainState.otherUserBank};
        }
        setInputVal(otherData);
    }, [mainState.otherUser]);

    useEffect(() => {
        if(typeof mainState.user !== 'undefined'){
            setAgentID(mainState.user.agent_id.toString());
        }
    }, [mainState.user]);

    useEffect(() => {
        if(agentID !== "" && typeof creatorData.agent_id !== 'undefined'){
            if(agentID === creatorData.agent_id){
                setDirectFlag(true);
            }
        }
    }, [agentID, creatorData]);

    const handleSelectChange = (e) => {
        const birthdate = { ...inputVal.birthdate, [e.target.name]: e.target.value };
        setInputVal({
          ...inputVal, birthdate
        });
    }
    
    const changeValue = (e) => {
        const inputvalue = {
            [e.target.name]: e.target.value
        }
        setInputVal({...inputVal, ...inputvalue});
    }

    const handleRadioChange = (e) => {
        setInputVal({...inputVal, sex: e.target.value});
    }

    const handleSubmit = () => {
        dispatch(admin.updateOtherUser(inputVal));
    }

    const handleClose = () => {
        props.changeComponent(null);
    }

    return (
        <>
            {
                typeof directFlag !== 'undefined' && directFlag ? (
                    <MainContent>
                        {
                            typeof creatorData !== 'undefined' && typeof creatorData.name !== 'undefined' ? (
                                <Div width="100%" padding="1rem" backcolor="#FFF" direction="column" alignItems="center">
                                    <Div width="90%" margin=".5rem .5rem 2% .5rem" padding="0" backcolor="transparent"  justify="center" >
                                        <div className="uk-inline" style={{width: '85%', borderBottom: '1px solid #EAEAEA', textAlign: "center"}}>
                                            <Text  str={`${Constants.CREATOR}名: `} textAlign="right" color="#77ADC5" fontSize="1.2rem" fontWeight="900" margin="0 .5rem" />
                                            <Text  str={`${creatorData.name.nickname}`} textAlign="left" color="#77ADC5" fontSize="1.2rem" fontWeight="900" margin="0 .5rem" />
                                        </div>
                                    </Div>
                                    <Div width="100%" padding=".5rem" backcolor="transparent" alignItems="flex-start">
                                        <BlockContent>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str="e-mail" textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={creatorData.email} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                                </Div>
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" >
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.NAME} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <Input type="text" name="name" value={inputVal.name} onChange={(e) => changeValue(e) } />
                                                    {/* <Text  str={creatorData.name.value} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" /> */}
                                                </Div>
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str="カナ" textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <Input type="text" name="ruby" value={inputVal.ruby} onChange={(e) => changeValue(e)  } />
                                                   {/* <Text  str={creatorData.name.ruby} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" /> */}
                                                </Div>
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.SIGNUP_2_BIRTHDAY} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <GenerateBirthDaySelect birthdate={inputVal.birthdate} handleSelectChange={(e) => handleSelectChange(e) } />
                                                    {/* <Text  str={`${creatorData.birthdate.year}${Constants.SIGNUP_2_YEAR} ${creatorData.birthdate.month}${Constants.SIGNUP_2_MONTH} ${creatorData.birthdate.day}${Constants.SIGNUP_2_DAY}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" /> */}
                                                </Div>
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.SIGNUP_2_GENDER} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <RightMarginLabel><input className="uk-radio" type="radio" name="sex" value="male" onChange={ (e) => handleRadioChange(e) } checked={ inputVal.sex === 'male' } />男性</RightMarginLabel>
                                                    <RightMarginLabel><input className="uk-radio" type="radio" name="sex" value="female" onChange={ (e) => handleRadioChange(e) }  checked={ inputVal.sex === 'female' } />女性</RightMarginLabel>
                                                    {/* <Text  str={Constants.GENDER_LIST[creatorData.sex]} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" /> */}
                                                </Div>
                                            </Div>
                
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.PHONE_NUMBER} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <Input type="text" name="tel" value={inputVal.tel} onChange={(e) => changeValue(e)  } />
                                                    {/* <Text  str={creatorData.tel} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" /> */}
                                                </Div>
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                   <Text  str={Constants.ADDRESS} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    {/* <Input type="text" name="address" value={inputVal.address.value} onChange={(e) => changeValue(e)  } /> */}
                                                   <Text  str={`${creatorData.address.value} ${creatorData.address.county}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                                </Div>
                                            </Div>
                                        </BlockContent>
                                        <BlockContent>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str="ID" textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="space-between" >
                                                    <Input type="text" name="uid" value={inputVal.uid} onChange={(e) => changeValue(e)  } />
                                                    <div>
                                                        <Btn width="15%" radius="20px" backcolor="#EA4179" color="#FFF" padding=".3rem 1rem" margin="0 1.5rem 0 0" text={Constants.SAVE} onClick={() => handleSubmit()} />
                                                        <Btn width="15%" radius="20px" backcolor="#FFF" border="1px solid #EA4179" color="#EA4179" padding=".3rem 1rem" margin="0 1.5rem 0 0" text={Constants.CLOSE} onClick={() => handleClose()} />
                                                    </div>

                                                   {/* <Text  str={`${creatorData.userid}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" /> */}
                                                </Div>
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.SIGNUP_1_NICKNAME} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start">
                                                    <Input type="text" name="nickname" value={inputVal.nickname} onChange={(e) => changeValue(e)  } />
                                                   {/* <Text  str={`${creatorData.name.nickname}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" /> */}
                                                </Div>
                                            </Div>
                                            <Div width="95%"  margin=".5rem" padding="0" justify="center" >
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str="銀行口座" textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0"justify="flex-start" >
                                                </Div>
                                            </Div>
                
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.FINANCIAL_CODE} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start">
                                                    <InputMask mask="9999" maskChar=""  name="bank_code" style={InputMaskStyle} placeholder="0000" value={inputVal.bank_code} onChange={ (e) => changeValue(e)  } />
                                                   {/* <Text  str={`${creatorBankData.bank_code}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" /> */}
                                                </Div>
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.SIGNUP_4_BRANCH_CODE} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <InputMask mask="999" maskChar=""  name="branch_code" style={InputMaskStyle} placeholder="000"   onChange={ (e) => changeValue(e) } value={inputVal.branch_code} />
                                                    {/* <Text  str={`${creatorBankData.branch_code}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" /> */}
                                                </Div>
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.SIGNUP_4_ACCOUNT_NUMBER} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <InputMask mask="9999999" maskChar=""  name="account_number" style={InputMaskStyle} placeholder="000"   onChange={ (e) => changeValue(e) } value={inputVal.account_number} />
                                                   {/* <Text  str={`${creatorBankData.account_number}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" /> */}
                                                </Div>
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.SIGNUP_4_ACCOUNT_HOLDER} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <Input type="text" name="account_holder" value={inputVal.account_holder} onChange={(e) => changeValue(e)  } />
                                                    {/* <Text  str={`${creatorBankData.account_holder}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" /> */}
                                                </Div>
                                            </Div>
                                        </BlockContent>
                                    </Div>
                                </Div>
                            ) : 
                            (
                                <LoadingCover  text="データロード中" />
                            )
                        }
                        <Div width="95%" margin=".5rem" padding="0 0 0 15%" justify="flex-start" >
                            <Text  str={`本人確認書類 `} textAlign="right" color="#3F3C3B" fontSize="1rem" fontWeight="600" margin="0 .5rem" />
                            <Btn width="15%" radius="20px" backcolor="#3E3A39" color="#FFF" padding=".3rem 1rem" margin="0 1.5rem 0 0" text={`削 除`} />
                            <Btn width="15%" radius="20px" border={ `1px solid #3E3A39` } backcolor="transparent" color="#3E3A39" padding=".3rem 1rem" margin="0 1.5rem 0 0" text={`アカウントー時停止`} />
                            <Btn width="15%" radius="20px" border={ `1px solid #3E3A39` } backcolor="transparent" color="#3E3A39" padding=".3rem 1rem" margin="0 1.5rem 0 0" text={`トー時停止解除`} />
                            <Btn width="15%" radius="20px" border={ `1px solid #3E3A39` } backcolor="transparent" color="#3E3A39" padding=".3rem 1rem" margin="0 1.5rem 0 0" text={`アカウント削除申請`} />
                        </Div>
                    </MainContent>
                ) : (
                <MainContent>
                    {
                        typeof creatorData !== 'undefined' && typeof creatorData.name !== 'undefined' ? (
                            <Div width="100%" padding="1rem" backcolor="#FFF" direction="column" alignItems="center">
                                <Div width="90%" margin=".5rem .5rem 2% .5rem" padding="0" backcolor="transparent"  justify="center" >
                                    <div className="uk-inline" style={{width: '85%', borderBottom: '1px solid #EAEAEA', textAlign: "center"}}>
                                        <Text  str={`${Constants.CREATOR}名: `} textAlign="right" color="#77ADC5" fontSize="1.2rem" fontWeight="900" margin="0 .5rem" />
                                        <Text  str={`${creatorData.name.nickname}`} textAlign="left" color="#77ADC5" fontSize="1.2rem" fontWeight="900" margin="0 .5rem" />
                                    </div>
                                </Div>
                                <Div width="100%" padding=".5rem" backcolor="transparent" alignItems="flex-start">
                                    <BlockContent>
                                        <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                            <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={Constants.NAME} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                            </Div>
                                            <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={creatorData.name.value} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                            </Div>
                                        </Div>
                                        <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                            <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str="カナ" textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                            </Div>
                                            <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={creatorData.name.ruby} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                            </Div>
                                        </Div>
                                        <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                            <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={Constants.SIGNUP_2_BIRTHDAY} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                            </Div>
                                            <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={`${creatorData.birthdate.year}${Constants.SIGNUP_2_YEAR} ${creatorData.birthdate.month}${Constants.SIGNUP_2_MONTH} ${creatorData.birthdate.day}${Constants.SIGNUP_2_DAY}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                            </Div>
                                        </Div>
                                        <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                            <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={Constants.SIGNUP_2_GENDER} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                            </Div>
                                            <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={Constants.GENDER_LIST[creatorData.sex]} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                            </Div>
                                        </Div>
                                    </BlockContent>
                                    <BlockContent>
                                        <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                            <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str="銀行口座" textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                            </Div>
                                            <Div width="65%" margin="0" padding="0"justify="flex-start" >
                                            </Div>
                                        </Div>
            
                                        <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                            <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={Constants.FINANCIAL_CODE} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                            </Div>
                                            <Div width="65%" margin="0" padding="0" justify="flex-start">
                                                <Text  str={`${creatorBankData.bank_code}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                            </Div>
                                        </Div>
                                        <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                            <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={Constants.SIGNUP_4_BRANCH_CODE} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                            </Div>
                                            <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={`${creatorBankData.branch_code}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                            </Div>
                                        </Div>
                                        <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                            <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={Constants.SIGNUP_4_ACCOUNT_NUMBER} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                            </Div>
                                            <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={`${creatorBankData.account_number}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                            </Div>
                                        </Div>
                                        <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                            <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={Constants.SIGNUP_4_ACCOUNT_HOLDER} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                            </Div>
                                            <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                <Text  str={`${creatorBankData.account_holder}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                            </Div>
                                        </Div>
                                    </BlockContent>
                                </Div>
                            </Div>
                        ) : 
                        (
                            <LoadingCover  text="データロード中" />
                        )
                    }
                </MainContent>
            )}
        </>
  );
}


// const handleSelectChange = (e) => {
//     dispatch(actions.changedBirthDate(e.target.name, e.target.value))
// }
  