import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import agent from '../../../store/actions/agent';
import main from '../../../store/actions/main';
import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import media from 'styled-media-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons'

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

const Input = styled.input`
  border: 1px solid #A3B5C1;
  background-color: #FFF;
  box-shadow: none;
  outline: none;
  height: 30px;

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


const ErrorMsg = styled.div`
  color: red;
`;

export default (props) => {
    let dispatch = useDispatch();
    const types = ['approved', 'applications', 'holds', 'refused'];
    const agentState = useSelector(state => state.agent);
    const [agentID, setAgentID] = useState("");
    const [directFlag, setDirectFlag] = useState(false);
    const [creatorData, setCreatorData] = useState({});
    const [creatorBankData, setCreatorBankData] = useState({});
    const mainState = useSelector( state => state.main );
    console.log("otherUser", mainState.otherUser);
    useEffect(() => {
        if(typeof mainState.otherUser !== "undefined" && typeof mainState.otherUser.name !== "undefined"){
            setCreatorData(mainState.otherUser)
        }
        if(typeof mainState.otherUserBank !== 'undefined'){
            setCreatorBankData(mainState.otherUserBank);
        }
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
    
    const handleApprove = (statusCode) => {
        dispatch(agent.tryApprove({agentID: agentID, approveStatus: statusCode, currentStatus: props.currentStatus, content: content}));
        dispatch(main.getChildAgent({uid: localStorage.getItem('uid'), type: types}))
        props.changeComponent(agentID, props.currentStatus);
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
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.SIGNUP_1_PASSWORD} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str="" textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                                </Div>
                                            </Div>
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
                
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.PHONE_NUMBER} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={creatorData.tel} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                                </Div>
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.ADDRESS} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={`${creatorData.address.value} ${creatorData.address.county}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                                </Div>
                                            </Div>
                                        </BlockContent>
                                        <BlockContent>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str="ID" textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={`${creatorData.userid}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
                                                </Div>
                                            </Div>
                                            <Div width="95%" margin=".5rem" padding="0" justify="center" style={{borderBottom: "1px solid #EAEAEA"}} >
                                                <Div width="30%" margin="0" padding="0" justify="flex-start" >
                                                    <Text  str={Constants.SIGNUP_1_NICKNAME} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                                                </Div>
                                                <Div width="65%" margin="0" padding="0" justify="flex-start">
                                                    <Text  str={`${creatorData.name.nickname}`} textAlign="left" color="#999" fontSize=".8rem" margin="0 .5rem" />
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

