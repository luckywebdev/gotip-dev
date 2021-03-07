import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import main from '../../../store/actions/main';
import registration from '../../../store/actions/registration';

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

const MainContent = styled.nav`
    width: 90%;
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
  border-radius: 5px;

  &:focus {
    border: 1px solid #707070;
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
    width: '100%',
    boxShadow: 'none',
    outline: 'none',
    borderRadius: '5px',
    boxSizing: 'border-box'
  }
  

const RightMarginLabel = styled.label`
  margin-right: 1em;
`

const ErrorMsg = styled.div`
  color: red;
`;

let dispatch;

export default (props) => {
    let history = useHistory();
    dispatch = useDispatch();
    const registerSuccess = "GOTIP代理店申請を受け付けました。登録内容に問題が無い場合申請が許可され最大48時間で代理店カウントが発行されます。登録内容に不備がある場合は申請は保留中となり再度申請のお手続きをするようリンクが再送されます。"
    const [termsAgree, setTermsAgree] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState(0);
    const [approvalStatusP, setApprovalStatusP] = useState(0);
    const [parentAgentID, setParentAgentID] = useState("");
    const [allParentID, setAllParentID] = useState("");
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
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [bankCode, setBankCode] = useState("");
    const [branchCode, setBranchCode] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [bankAccountType, setBankAccountType] = useState("ordinary");
    const [bankAccountName, setBankAccountName] = useState("");
    const [errors, setErrors] = useState({email: "", reEmail: ""});
    const mainState = useSelector( state => state.main );
    const registrationState = useSelector( state => state.registration );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
    let inputField = {};

    useEffect(() => {
        let parentAgentIdArr = history.location.pathname.split('/');
        let parentsAgentId = parentAgentIdArr.slice(-1)[0];
        setAllParentID(parentsAgentId);
        var idArr = parentsAgentId.match(/.{1,6}/g);
        setAgentLevel(idArr[2]);
        setParentAgentID(idArr[0]);
        setAgentID(idArr[1]);
        dispatch(main.getOtherAgentAccountInfo(idArr[1]));
    }, []);

    useEffect(() => {
        if(typeof mainState.otherUser !== "undefined" && typeof mainState.otherUser.name !== "undefined"){
            setApprovalStatus(mainState.otherUser.approval_status);
            setApprovalStatusP(mainState.otherUser.approval_status_p);
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
            setBankCode(mainState.otherUserBank.bank_code);
            setBranchCode(mainState.otherUserBank.branch_code);
            setBankAccountNumber(mainState.otherUserBank.account_number);
            setBankAccountType(mainState.otherUserBank.account_type);
            setBankAccountName(mainState.otherUserBank.account_holder);
        }
    }, [mainState.otherUser]);
  
    const checkValuesSet = () => {
        try {
            let errors = {};
            let isValid = true;
            const regex = /^0/g;
            inputField = {"agentName": agentName, "agentNameKana": agentNameKana, "corporateName": corporateName, "accountName": accountName, "postalCode": postalCode, "address": address, "phoneNumber": phoneNumber, "chargePersonName": chargePersonName, "chargePersonNameKana": chargePersonNameKana, "chargePersonTel": chargePersonTel, "email": email, "reEmail": reEmail, "password": password, "rePassword": rePassword, "bankCode": bankCode, "branchCode": branchCode, "bankAccountNumber": bankAccountNumber, "bankAccountType": bankAccountType, "bankAccountName": bankAccountName}

            for(var key in inputField)
            {
                if(inputField[key] === ""){
                    errors[key] = "*有効な値を入れてください！";
                    isValid = false;
                }
            }
            if(!termsAgree){
                errors.termsAgree = "*有効な値を入れてください！";
                isValid = false;
            }
            if (!email || email.indexOf('@') === -1){
              errors.email = "*有効なメールアドレスを入力してください。";
              isValid = false;
            }
            if (!reEmail || reEmail.indexOf('@') === -1){
                errors.reEmail = "*有効なメールアドレスを入力してください。";
                isValid = false;
              }
  
            if(email !== reEmail){
                errors.email = "*メールが一致しません。入力した電子メールを再度確認してください。";
                errors.reEmail = "*メールが一致しません。入力した電子メールを再度確認してください。";
                isValid = false;
            }
            if(password !== rePassword){
                errors.password = "*パスワードが一致しません。パスワードを再確認してください。";
                errors.rePassword = "*パスワードが一致しません。パスワードを再確認してください。";
                isValid = false;
            }
            if (!phoneNumber || (!phoneNumber.match(/^\d{9}$/) && !phoneNumber.match(/^\d{10}$/))) {
                errors.phoneNumber = "*有効な電話番号を入力してください。 電話番号は先頭の0を除いた9または10桁となります。";
                isValid = false;
            }
            if (phoneNumber && regex.exec(phoneNumber) !== null) {
                errors.phoneNumber = "*有効な電話番号を入力してください。 電話番号は先頭の0を除いた9または10桁となります。";
                isValid = false;
            }
            if (!chargePersonTel && !chargePersonTel.match(/^\d{9}$/) && !chargePersonTel.match(/^\d{10}$/)) {
                errors.chargePersonTel = "*有効な電話番号を入力してください。 電話番号は先頭の0を除いた10桁となります。";
                isValid = false;
            }
            if (chargePersonTel && regex.exec(chargePersonTel) !== null) {
                errors.chargePersonTel = "*有効な電話番号を入力してください。 電話番号は先頭の0を除いた10桁となります。";
                isValid = false;
            }

            if (accountName && bankAccountName && accountName !== bankAccountName){
                errors.accountName = "*口座名義人名が一致していません。";
                errors.bankAccountName = "*口座名義人名が一致していません。";
                isValid = false;
            }

            setErrors(errors);
            return isValid;
        } catch (err) {
            console.log('Registration values check error.', err)
            return false;
        }
    }

    const handleSubmit = () => {
        const checkValidate = checkValuesSet();
        if(checkValidate){
            if(approvalStatus !== 1 && approvalStatus !== 3){
                inputField.parentAgentID = parentAgentID;
                inputField.agentLevel = agentLevel;
                inputField.agentID = agentID;
                inputField.allIDs = allParentID;
                inputField.approvalStatusP = approvalStatusP;
                dispatch(registration.tryRegisterAgent(inputField));
            }
            else{
                alert("既に処理済みの代理店です");
            }
        }
        

    }
    

    return (
    <MainContent>
        {/* <Div width="80%" padding="1% 0 0 0" margin="0" backcolor="transparent" justify="center" >
            <Text  str={Constants.BANK_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" /> 
        </Div> */}
        {
            registrationState.all_register ? (
                <BlockContent>
                    <Div width="95%" margin=".5rem" padding="0" justify="center" >
                        <Text str={registerSuccess} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                    </Div>
                </BlockContent>
            ) : (
                <>
                    <BlockContent>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text str={Constants.AGENT_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="text" name="agentName" placeholder="" onChange={ (e) => setAgentName(e.target.value) } value={agentName} />
                                <ErrorMsg>{errors.agentName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.AGENT_NAME_KANA} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="text" name="agentNameKana" placeholder="" onChange={ (e) => setAgentNameKana(e.target.value) } value={agentNameKana} />
                                <ErrorMsg>{errors.agentNameKana}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.CORPORATE_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="text" name="corporateName" placeholder="" onChange={ (e) => setCorporateName(e.target.value) } value={corporateName} />
                                <ErrorMsg>{errors.corporateName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.ACCOUNT_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="text" name="accountName" placeholder="" onChange={ (e) => setAccountName(e.target.value) } value={accountName} />
                                <ErrorMsg>{errors.accountName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.POSTAL_CODE} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="text" name="postalCode" placeholder="" onChange={ (e) => setPostalCode(e.target.value) } value={postalCode} />
                                <ErrorMsg>{errors.postalCode}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.ADDRESS} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="text" name="address" placeholder="" onChange={ (e) => setAddress(e.target.value) } value={address} />
                                <ErrorMsg>{errors.address}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.PHONE_NUMBER} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="number" name="phoneNumber" max="9999999999" min="100000000" placeholder="" onChange={ (e) => setPhoneNumber(e.target.value) } value={phoneNumber} />
                                <ErrorMsg>{errors.phoneNumber}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.CHARGE_PERSON_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="text" name="chargePersonName" placeholder="" onChange={ (e) => setChargePersonName(e.target.value) } value={chargePersonName} />
                                <ErrorMsg>{errors.chargePersonName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.CHARGE_PERSON_NAME_KANA} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="text" name="chargePersonNameKana" placeholder="" onChange={ (e) => setChargePersonNameKana(e.target.value) } value={chargePersonNameKana} />
                                <ErrorMsg>{errors.chargePersonNameKana}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.CHARGE_PERSON_TEL} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="number" name="chargePersonTel" placeholder="" onChange={ (e) => setChargePersonTel(e.target.value) } value={chargePersonTel} />
                                <ErrorMsg>{errors.chargePersonTel}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str="e-mail" textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="email" name="email" placeholder="" onChange={ (e) => setEmail(e.target.value) } value={email} />
                                <ErrorMsg>{errors.email}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str="e-mail(確認)" textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="email" name="reEmail" placeholder="" onChange={ (e) => setReEmail(e.target.value) } value={reEmail} />
                                <ErrorMsg>{errors.reEmail}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.LOGIN_PASSWORD} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="password" name="password" placeholder="" onChange={ (e) => setPassword(e.target.value) } value={password} />
                                <ErrorMsg>{errors.password}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="35%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.LOGIN_REPASSWORD} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="password" name="rePassword" placeholder="" onChange={ (e) => setRePassword(e.target.value) } value={rePassword} />
                                <ErrorMsg>{errors.rePassword}</ErrorMsg>
                            </Div>
                        </Div>
                    </BlockContent>
                    <BlockContent>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.SIGNUP_4_BANK_CODE} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <InputMask mask="9999" maskChar=" "  name="bankCode" style={InputMaskStyle} placeholder="0000"  onChange={ (e) => setBankCode(e.target.value) } value={bankCode}  />
                                <ErrorMsg>{errors.bankCode}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.SIGNUP_4_BRANCH_CODE} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0"  direction="column" alignItems="flex-start">
                                <InputMask mask="999" maskChar=""  name="branchCode" style={InputMaskStyle} placeholder="000"   onChange={ (e) => setBranchCode(e.target.value) } value={branchCode} />
                                <ErrorMsg>{errors.branchCode}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.BANK_ACCOUNT_NUMBER} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <InputMask mask="9999999" maskChar=""  name="bankAccountNumber" style={InputMaskStyle} placeholder="0000000"  onChange={ (e) => setBankAccountNumber(e.target.value) } value={bankAccountNumber} />
                               {/* <Input className="uk-input" type="text" name="bankAccountNumber" placeholder="" onChange={ (e) => setBankAccountNumber(e.target.value) } value={bankAccountNumber} /> */}
                                <ErrorMsg>{errors.bankAccountNumber}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.BANK_ACCOUNT_TYPE} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" alignItems="center" justify="flex-start" >
                                <RightMarginLabel><input className="uk-radio" type="radio" name="accountType" value="ordinary" onChange={ () => setBankAccountType('ordinary') } checked={ bankAccountType === 'ordinary' } />{Constants.ORDINARY}</RightMarginLabel>
                                <RightMarginLabel><input className="uk-radio" type="radio" name="accountType" value="current" onChange={ () => setBankAccountType('current') }  checked={ bankAccountType === 'current' } />{Constants.CURRENT_ACCOUNT}</RightMarginLabel>
                                <ErrorMsg>{errors.bankAccountType}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0" justify="center" >
                            <Div width="30%" margin="0" padding="0" justify="flex-end" >
                                <Text  str={Constants.BANK_ACCOUNT_NAME} textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                            </Div>
                            <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                                <Input className="uk-input" type="text" name="bankAccountName" placeholder="" onChange={ (e) => setBankAccountName(e.target.value) } value={bankAccountName} />
                                <ErrorMsg>{errors.bankAccountName}</ErrorMsg>
                            </Div>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0 0 0 10%" justify="center" >
                            <Text  str={Constants.AGENT_REG_INSTRUCTION} textAlign="center" color="red" fontSize="1rem" margin="0 .3rem" />
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0 0 0 15%" justify="flex-start" >
                            <FontAwesomeIcon icon={ faDownload } color="#95A8B5"/>
                            <Text  str={Constants.TERMS_LABEL} textAlign="left" color="#999" fontSize=".8rem" margin="0 .3rem" />
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0 0 0 15%" justify="flex-start" direction="column" alignItems="flex-start" >
                            <label style={{width: "100%"}}><input className="uk-checkbox" type="checkbox" name="terms_agree" onChange={ (e) => setTermsAgree(!termsAgree) } checked={ termsAgree === true } style={{marginRight: "2%"}} />{Constants.TERMS_AGREE}</label>
                            <ErrorMsg>{errors.termsAgree}</ErrorMsg>
                        </Div>
                        <Div width="95%" margin=".5rem" padding="0 0 0 15%" justify="flex-start" >
                            <Btn width="40%" radius="3px" border={ `1px solid ${theme_color}` } backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1.5rem 0 0" text={Constants.PUT} onClick={() => handleSubmit()} />
                        </Div>
                    </BlockContent>
                </>
            )
        }

    </MainContent>
  );
}

