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
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
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
    const [content, setContent] = useState("備考欄： メールが送信されます");
    const [agentID, setAgentID] = useState("");
    const [agentLevel, setAgentLevel] = useState(1);
    const [agentName, setAgentName] = useState("");
    const [agentNameKana, setAgentNameKana] = useState("");
    const [corporateName, setCorporateName] = useState("");
    const [accountName, setAccountName] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [chargePersonName, setChargePersonName] = useState("");
    const [chargePersonNameKana, setChargePersonNameKana] = useState("");
    const [chargePersonTel, setChargePersonTel] = useState("");
    const [email, setEmail] = useState("");
    const [reEmail, setReEmail] = useState("");
    const [bankName, setBankName] = useState("");
    const [branchName, setBranchName] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [ordinary, setOrdinary] = useState("");
    const [bankAccountName, setBankAccountName] = useState("");
    const [errors, setErrors] = useState({email: "", reEmail: ""});
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
    console.log("otherUser", mainState.otherUser);
    useEffect(() => {
        if(typeof mainState.otherUser !== "undefined" && typeof mainState.otherUser.name !== "undefined"){
            setAgentID(mainState.otherUser.agent_id);
            setAgentName(mainState.otherUser.name.nickname);
            setAgentNameKana(mainState.otherUser.name.agentNameKana);
            setCorporateName(mainState.otherUser.name.ruby);
            setAccountName(mainState.otherUser.name.value);
            setPostalCode(mainState.otherUser.address.postal_code);
            setAddress(mainState.otherUser.address.value);
            setPhoneNumber(String(mainState.otherUser.tel).replace(/^\+81/, ''));
            setChargePersonName(mainState.otherUser.delegate.name);
            setChargePersonNameKana(mainState.otherUser.delegate.nameKana);
            setChargePersonTel(mainState.otherUser.delegate.tel);
            setEmail(mainState.otherUser.email);
            setReEmail(mainState.otherUser.email);
            setAgentLevel(mainState.otherUser.agentLevel);
        }
        if(typeof mainState.otherUserBank !== 'undefined'){
            setBankName(mainState.otherUserBank.bank_name);
            setBranchName(mainState.otherUserBank.branch_name);
            setBankAccountNumber(mainState.otherUserBank.account_number);
            setOrdinary(mainState.otherUserBank.ordinary);
            setBankAccountName(mainState.otherUserBank.account_holder);
        }
    }, [mainState.otherUser]);

    
    const handleApprove = (statusCode) => {
        dispatch(agent.tryApprove({agentID: agentID, approveStatus: statusCode, currentStatus: props.currentStatus, content: content}));
        dispatch(main.getChildAgent({uid: localStorage.getItem('uid'), type: types}))
        props.changeComponent(agentID, props.currentStatus);
    }

    return (
    <MainContent>
        {/* <Div width="80%" padding="1% 0 0 0" margin="0" backcolor="transparent" justify="center" >
            <Text  str={Constants.BANK_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" /> 
        </Div> */}
        {/* {
            typeof mainState.otherUser !== 'undefined' && typeof mainState.otherUser.agent_id !== 'undefined' ? ( */}
                <>
                    <BlockContent>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.AGENT_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="agentName" disabled placeholder="" onChange={ (e) => setAgentName(e.target.value) } value={agentName} />
                                <ErrorMsg>{errors.agentName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.AGENT_NAME_KANA} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="agentNameKana" disabled placeholder="" onChange={ (e) => setAgentNameKana(e.target.value) } value={agentNameKana} />
                                <ErrorMsg>{errors.agentNameKana}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.CORPORATE_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="corporateName" disabled placeholder="" onChange={ (e) => setCorporateName(e.target.value) } value={corporateName} />
                                <ErrorMsg>{errors.corporateName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.ACCOUNT_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="accountName" disabled placeholder="" onChange={ (e) => setAccountName(e.target.value) } value={accountName} />
                                <ErrorMsg>{errors.accountName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.POSTAL_CODE} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="postalCode" disabled placeholder="" onChange={ (e) => setPostalCode(e.target.value) } value={postalCode} />
                                <ErrorMsg>{errors.postalCode}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.ADDRESS} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="address" disabled placeholder="" onChange={ (e) => setAddress(e.target.value) } value={address} />
                                <ErrorMsg>{errors.address}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.PHONE_NUMBER} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="phoneNumber" disabled placeholder="" onChange={ (e) => setPhoneNumber(e.target.value) } value={phoneNumber} />
                                <ErrorMsg>{errors.phoneNumber}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.CHARGE_PERSON_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="chargePersonName" disabled placeholder="" onChange={ (e) => setChargePersonName(e.target.value) } value={chargePersonName} />
                                <ErrorMsg>{errors.chargePersonName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.CHARGE_PERSON_NAME_KANA} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="chargePersonNameKana" disabled placeholder="" onChange={ (e) => setChargePersonNameKana(e.target.value) } value={chargePersonNameKana} />
                                <ErrorMsg>{errors.chargePersonNameKana}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.CHARGE_PERSON_TEL} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="chargePersonTel" disabled placeholder="" onChange={ (e) => setChargePersonTel(e.target.value) } value={chargePersonTel} />
                                <ErrorMsg>{errors.chargePersonTel}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str="e-mail" textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="email" placeholder="" disabled onChange={ (e) => setEmail(e.target.value) } value={email} />
                                <ErrorMsg>{errors.email}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str="e-mail(確認)" textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="reEmail" disabled placeholder="" onChange={ (e) => setReEmail(e.target.value) } value={reEmail} />
                                <ErrorMsg>{errors.reEmail}</ErrorMsg>
                            </Div>
                        </Div>
                    </BlockContent>
                    <BlockContent>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.BANK_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="bankName" disabled placeholder="" onChange={ (e) => setBankName(e.target.value) } value={bankName} />
                                <ErrorMsg>{errors.bankName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.BRANCH_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="branchName" disabled placeholder="" onChange={ (e) => setBranchName(e.target.value) } value={branchName} />
                                <ErrorMsg>{errors.branchName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.BANK_ACCOUNT_NUMBER} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="bankAccountNumber" disabled placeholder="" onChange={ (e) => setBankAccountNumber(e.target.value) } value={bankAccountNumber} />
                                <ErrorMsg>{errors.bankAccountNumber}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.ORDINARY} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="ordinary" placeholder="" disabled onChange={ (e) => setOrdinary(e.target.value) } value={ordinary} />
                                <ErrorMsg>{errors.ordinary}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.BANK_ACCOUNT_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" >
                                <Input className="uk-input" type="text" name="bankAccountName" disabled placeholder="" onChange={ (e) => setBankAccountName(e.target.value) } value={bankAccountName} />
                                <ErrorMsg>{errors.bankAccountName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0 0 0 5%" justify="flex-end" alignItems="flex-start" >
                            <textarea defaultValue={content} style={{textAlign: "left", fontSize: "1rem", margin: "0 .3rem", resize: "none", width: "90%", border: "none", padding: ".5rem"}} rows="3" onChange={(e) => setContent(e.target.value) } ></textarea>
                        </Div>
                        <Div width="100%" margin=".5rem" padding="5% 0 0 15%" justify="flex-start" >
                            <Text  str={`この情報で ${corporateName} を${agentLevel}次代理店として許可する`} textAlign="left" color="#999" fontSize="1rem" margin="0 .3rem" />
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0 0 0 15%" justify="flex-start" >
                            <Btn width="20%" radius="3px" border={ `1px solid ${theme_color}` } backcolor={theme_color} color="#FFF" padding=".3rem 1rem" margin="0 1.5rem 0 0" text={Constants.APPROVE} onClick={() => handleApprove(1)} />
                            <Btn width="20%" radius="3px" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding=".3rem 1rem" margin="0 1.5rem 0 0" text={Constants.HOLD} onClick={() => handleApprove(2)} />
                            <Btn width="20%" radius="3px" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding=".3rem 1rem" margin="0 1.5rem 0 0" text={Constants.APPLY_STOP} onClick={() => handleApprove(3)} />
                            <Text  str="許可を押してから 最大48時間で申請が受理されます" textAlign="left" color="red" fontSize=".7rem" margin="0 .3rem" />
                        </Div>
                    </BlockContent>
                </>
            {/* ) : 
            (
                <LoadingCover  text="データロード中" />
            )
        } */}

    </MainContent>
  );
}

