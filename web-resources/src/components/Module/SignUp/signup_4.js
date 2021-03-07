import React, {Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons';
UIkit.use(UIkitIcons)

import styled from 'styled-components';
import InputMask from 'react-input-mask';

import registration from '../../../store/actions/registration';
import * as Constants from '../../../Constants';
import RowDiv from '../../UI/div';
import Btn from '../../UI/btn';
import Sheet from '../../Sheet';
import Input from '../../UI/input';

const SignupForm = styled.div`
    width: 90%;
    height: auto;
    padding: 10px 0px;
    margin: 20px auto;
    background-color: #FFF;
`;

const StyledLegend = styled.h3`
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  color: #30AA89 !important;
  text-align: center;
`
const LastRowDiv = styled(RowDiv)`
  margin-top: 60px !important;
`
const InputMaskStyle = {
  backgroundColor: "#FFF",
  border: "1px solid #A3B5C1",
  padding: "0rem 1rem",
  height: '50px',
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
`


class SignUpPanel_4 extends Component {
  constructor(props){
    super(props);
    this.state = {
      bank_code: '',
      branch_code: '',
      account_number: '',
      account_type: 'ordinary',
      account_holder: '',
      errors: ''
    }
  }

  componentDidMount() {
    this.setState({
        step: this.props.step
    })
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  checkValuesSet = () => {
    try {
      let errors = {};
      let isValid = true;
     if (!this.state.bank_code) {
        errors.bank_code = "*銀行コードを入力してください。";
        isValid = false;
      }
      if (!this.state.branch_code) {
        errors.branch_code = "*支店コードを入力してください。";
        isValid = false;
      }
      if (!this.state.account_number) {
        errors.account_number = "*口座番号を入力してください。";
        isValid = false;
      }
      if (!this.state.account_type) {
        errors.account_type = "*口座種別を選択してください。";
        isValid = false;
      }
      if (!this.state.account_holder) {
        errors.account_holder = "*口座名義人を入力してください。";
        isValid = false;
      }
      this.setState({
        errors: errors
      })
      return isValid;
    } catch (err) {
      console.log('Registration values check error.', err)
      return false;
    }
  }
  
  handleNext = () => {
    const checkValidate = this.checkValuesSet();
    if(checkValidate) {
        const { handleRegData } = this.props;
        handleRegData(this.state);
    }
  }

  render() {
    const registrationForm = (
      <form>

        <StyledLegend className="uk-legend uk-text-center uk-text-success uk-text-bold">{ Constants.SIGNUP_4_TITLE }</StyledLegend>
        <RowDiv className="uk-margin" justify="center" direction="column" alignItems="center" >
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="100%" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-bank_code">{ Constants.SIGNUP_4_BANK_CODE }</label>
                <div className="uk-form-controls" style={{width: '30%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <InputMask mask="9999" maskChar=""  name="bank_code" style={InputMaskStyle} placeholder="0000" value={this.state.bank_code} onChange={ this.handleInput } />
                    {/* <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-bank_code" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="bank_code" placeholder="0000000000" value={this.state.bank_code} changed={ this.handleInput } /> */}
                    <ErrorMsg>{this.state.errors.bank_code}</ErrorMsg>
                </div>
            </RowDiv>
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="100%" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-branch_code">{ Constants.SIGNUP_4_BRANCH_CODE }</label>
                <div className="uk-form-controls" style={{width: '30%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <InputMask mask="999" maskChar=""  name="branch_code" style={InputMaskStyle} placeholder="000" value={this.state.branch_code} onChange={ this.handleInput }  />
                    {/* <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-branch_code" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="branch_code" placeholder="000" value={this.state.branch_code} changed={ this.handleInput } /> */}
                    <ErrorMsg>{this.state.errors.branch_code}</ErrorMsg>
               </div>
            </RowDiv>
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="100%" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-account_number">{ Constants.SIGNUP_4_ACCOUNT_NUMBER }</label>
                <div className="uk-form-controls" style={{width: '60%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    {/* <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-account_number" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="account_number" placeholder="000" value={this.state.account_number} changed={ this.handleInput } /> */}
                    <InputMask mask="9999999" maskChar=""  name="account_number" style={InputMaskStyle} placeholder="0000000" value={this.state.account_number} onChange={ this.handleInput } />

                    <ErrorMsg>{this.state.errors.account_number}</ErrorMsg>
                </div>
            </RowDiv>
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="100%" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-account_number">{ Constants.SIGNUP_4_ACCOUNT_NUMBER }</label>
                <div className="uk-form-controls" style={{width: '60%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                  <RightMarginLabel><input className="uk-radio" type="radio" name="account_type" value="ordinary" onChange={ this.handleInput } checked={ this.state.account_type === 'ordinary' } />{Constants.ORDINARY}</RightMarginLabel>
                  <RightMarginLabel><input className="uk-radio" type="radio" name="account_type" value="current" onChange={ this.handleInput }  checked={ this.state.account_type === 'current' } />{Constants.CURRENT_ACCOUNT}</RightMarginLabel>
                  <ErrorMsg>{this.state.errors.account_type}</ErrorMsg>
                </div>
            </RowDiv>
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="100%" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-account_holder">{ Constants.SIGNUP_4_ACCOUNT_HOLDER }</label>
                <div className="uk-form-controls" style={{width: '60%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-account_holder" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="account_holder" placeholder="スズキイチロウ" value={this.state.account_holder} changed={ this.handleInput } />
                    <ErrorMsg>{this.state.errors.account_holder}</ErrorMsg>
                </div>
            </RowDiv>

        </RowDiv>
        <LastRowDiv className="uk-margin uk-align-center uk-text-center">
            <Btn text={ Constants.NEXT } color='#FFF' width="calc(80% - 2rem)" padding=".7rem 0" className='uk-width-1-1'　onClick={this.handleNext} />
        </LastRowDiv>

    </form>
    );

    return (
      <SignupForm className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
        <Sheet content={ registrationForm } />
      </SignupForm>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  handleRegData: bindActionCreators(registration.handleRegData, dispatch),
});


export default  connect(
  null,
  mapDispatchToProps
)(SignUpPanel_4);