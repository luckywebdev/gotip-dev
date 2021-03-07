import React, {Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Constants from "../../../Constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import styled from 'styled-components';
import media from 'styled-media-query';
import registration from '../../../store/actions/registration'
import LineDiv from '../../UI/Divider';

import SignInFaceBook from '../Login/signInFaceBook';
import SignInTwitter from '../Login/signInTwitter';
import SignInGoogle from '../Login/signInGoogle';
import ConfirmMessage from './confirm';

const SignUpForm = styled.div`
  max-height: 788px;
  min-height: 400px;
  width: 100%;
  max-width: 718px;
  height: auto;
  margin: auto;
  padding: 20px 0px;
  position: relative;
`;

const SignUpInput = styled.input`
  border: none;
  background-color: #F5F8FA;
  box-shadow: none;
  outline: none;
  height: 50px;

  &:focus {
    border: 1px solid #707070;
  }
  ${media.lessThan("large")`
    height: 40px;
  `}
`;

const RoundedButton = styled.button`
  border-radius: 40px;
  background-color: #30AA89;
  color: #FFF;
  border: none;
  height: 60px;
  font-size: 1.2rem;
  margin-top: 2rem;
  &:hover {
    background-color: #30AA89;
    opacity: .7;
  } 
  ${media.lessThan("large")`
    height: 50px;
  `}
`;

const RowDiv = styled.div`
  width: 70%;
  max-width: 500px;
  ${media.lessThan("large")`
    width: 90% !important;
    margin-top: 5px !important;
    margin-bottom: 5px !important;
  `}

`
const CloseBtn = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20pxl
  z-index: 2000;
`;

const StyledLegend = styled.legend`
  padding-top: 30px !important;
  padding-bottom: 10px !important;
  color: #30AA89 !important;
`
const ErrorMsg = styled.div`
  color: red;
`;

class SignUp extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      re_email: '',
      re_password: '',
      signupSubmitFlag: false,
      errors: {},
      errorModal: false,
      errorMessage: '',
      showPassword: false,
      showRePassword: false,
      signupResult: false,
      loadingMessage: false
    }
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleCheckBoxChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  SignUpSubmit = () => {
    if(this.validateForm()){
      const { trySignUp } = this.props;
      const agentID = this.props.agentID;
      if(agentID !== null && agentID !== ""){
        trySignUp(this.state.email, this.state.password, agentID);
      }
      else{
        trySignUp(this.state.email, this.state.password);
      }
      this.setState({
        loadingMessage: true
      })
    }
  }

  showPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    })
  }
  showRePassword = () => {
    this.setState({
      showRePassword: !this.state.showRePassword
    })
  }

  validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!this.state.email || this.state.email === '') {
      formIsValid = false;
      errors.email = "*正しいメールアドレスを入力してください。";
    }
    if (!this.state.re_email || this.state.re_email === '') {
      formIsValid = false;
      errors.re_email = "*正しいメールアドレスを入力してください。";
    }

    if (typeof this.state.email !== "undefined" && this.state.email !== "") {
      //regular expression for email validation
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(this.state.email)) {
        formIsValid = false;
        errors.email = "*正しいメールアドレスを入力してください。";
      }
    }
    if (typeof this.state.re_email !== "undefined" && this.state.re_email !== "") {
      //regular expression for email validation
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(this.state.re_email)) {
        formIsValid = false;
        errors.re_email = "*正しいメールアドレスを入力してください。";
      }
    }

    if(this.state.email !== '' && this.state.email !== this.state.re_email){
      formIsValid = false;
      errors.re_email = "*メールが一致しません。入力した電子メールを再度確認してください。";
  }

    if (!this.state.password || this.state.password === '') {
      formIsValid = false;
      errors.password = "*パスワードを入力してください。";
    }
    if (!this.state.re_password || this.state.re_password === '') {
      formIsValid = false;
      errors.re_password = "*パスワードを入力してください。";
    }
    if(this.state.password !== '' && this.state.password !== this.state.re_password){
      formIsValid = false;
      errors.re_password = "*パスワードが一致しません。パスワードを再確認してください。";
    }    

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  // handleClose = () => {
  //   this.props.history.push('/land')
  // }

  render() {
    return (
      <SignUpForm>
          {
            (this.state.loadingMessage !== false) ? (
              <div style={{position: "absolute", top: "50%", left: "50%", transform: 'translate(-50%, -50%)', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                <div uk-spinner={ `ratio: 2` } style={{ color: '#FFF', fontWeight: "600" }} /><span style={{ color: '#FFF', fontWeight: "600" }}>処理中</span>
              </div>
            ) : null
          }
          <form>
            <fieldset className="uk-fieldset">
                <CloseBtn onClick={() => this.props.history.push('/land')}>
                    <span uk-icon="icon: close"></span>
                </CloseBtn>
                <StyledLegend className="uk-legend uk-text-center uk-text-success uk-text-bold">{ Constants.SIGNUP_TITLE}</StyledLegend>
                {
                  ((typeof this.props.allState.registration.errMessage !== 'undefined' && !this.props.allState.registration.result) || (this.props.allState.registration.result)) ? (
                    <ConfirmMessage />
                  ) : (
                    <React.Fragment>
                      <RowDiv className="uk-margin uk-align-center">
                          <SignUpInput className="uk-input" type="text" name="email" placeholder="e-mail アドレス" onChange={ this.handleInput } value={this.state.email} />
                          <ErrorMsg>{this.state.errors.email}</ErrorMsg>
                      </RowDiv>
                      <RowDiv className="uk-margin uk-align-center">
                          <SignUpInput className="uk-input" type="text" name="re_email" placeholder="e-mail アドレス(確認用)" onChange={ this.handleInput } value={this.state.re_email} />
                          <ErrorMsg>{this.state.errors.re_email}</ErrorMsg>
                      </RowDiv>
                      <RowDiv className="uk-margin uk-align-center">
                          <div className="uk-inline" style={{width: '100%'}}>
                            <a className="uk-form-icon uk-form-icon-flip" href="#" onClick={this.showPassword} tabIndex="-1" >
                              {
                                this.state.showPassword ? (
                                  <FontAwesomeIcon icon={ faEyeSlash } color="#95A8B5"/>
                                ) : (
                                  <FontAwesomeIcon icon={ faEye } color="#95A8B5"/>
                                )
                              }
                            </a>
                            <SignUpInput className="uk-input" type={this.state.showPassword ? "text" : "password"} name="password" placeholder="パスワード" onChange={ this.handleInput } value={this.state.password} />
                          </div>
                          <ErrorMsg>{this.state.errors.password}</ErrorMsg>
                      </RowDiv> 
                      <RowDiv className="uk-margin uk-align-center">
                          <div className="uk-inline" style={{width: '100%'}}>
                            <a className="uk-form-icon uk-form-icon-flip" href="#" onClick={this.showRePassword} tabIndex="-1" >
                              {
                                this.state.showRePassword ? (
                                  <FontAwesomeIcon icon={ faEyeSlash } color="#95A8B5"/>
                                ) : (
                                  <FontAwesomeIcon icon={ faEye } color="#95A8B5"/>
                                )
                              }
                            </a>
                            <SignUpInput className="uk-input" type={this.state.showRePassword ? "text" : "password"} name="re_password" placeholder="パスワード(確認用)" onChange={ this.handleInput } value={this.state.re_password} />
                          </div>
                          <ErrorMsg>{this.state.errors.re_password}</ErrorMsg>
                      </RowDiv> 
                      <RowDiv className="uk-margin uk-align-center">
                        <RoundedButton type="button" className="uk-button uk-button-success uk-width-1-1 uk-margin-small-bottom" onClick={this.SignUpSubmit } > {Constants.SIGNUP_BTN} </RoundedButton>
                      </RowDiv>
        
                      <RowDiv className="uk-align-center uk-text-justify uk-flex uk-flex-between uk-flex-middle" style={{marginTop: "4rem", marginBottom: "1rem"}}>
                        <LineDiv width="25%"></LineDiv>
                        <span className="uk-text-normal uk-text-center" style={{fontSize: '.8rem'}}>{Constants.SNS_SIGNUP_TITLE}</span>
                        <LineDiv width="25%"></LineDiv>
                      </RowDiv>
        
                      <RowDiv className="uk-margin uk-align-center uk-text-center uk-flex uk-flex-center uk-flex-middle">
                          <SignInFaceBook type="signup" agentID={this.props.agentID} />
                          <SignInTwitter type="signup" agentID={this.props.agentID} />
                          <SignInGoogle type="signup" agentID={this.props.agentID} />
                      </RowDiv>
                      <RowDiv className="uk-margin uk-align-center uk-text-center uk-flex uk-flex-center uk-flex-middle" style={{padding: "2%"}}>
                      </RowDiv>
                    </React.Fragment>
                  )
                }
  
              </fieldset>
        </form>  
      </SignUpForm>
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.login,
  allState: state
});

const mapDispatchToProps = (dispatch) => ({
  trySignUp: bindActionCreators(registration.trySignUp, dispatch),
});


export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);