import React, {Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createBrowserHistory } from "history";
import * as Constants from "../../../Constants";

import styled from 'styled-components';
import media from 'styled-media-query';
import login from '../../../store/actions/login'
import LineDiv from '../../UI/Divider';
import Modal from '../../UI/Modal/Modal';

import SignInFaceBook from './signInFaceBook';
import SignInTwitter from './signInTwitter';
import SignInGoogle from './signInGoogle';

const LoginForm = styled.div`
  max-height: 788px;
  width: 100%;
  max-width: 718px;
  height: auto;
  margin: auto;
  /* position: absolute;
  top: 50%;
  transform: translateY(-45%); */
  padding: 20px 0px;
`;

const LoginInput = styled.input`
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
  font-size: 1.1em;

  &:hover {
    background-color: #30AA89;
    opacity: .7;
  } 
  ${media.lessThan("large")`
    height: 50px;
  `}
`;

const RoundedOutlineButton = styled.button`
  border-radius: 30px;
  border: 1px solid #30AA89;
  background-color: #FFF;
  color: #30AA89;
  height: 40px;
  font-size: .7em;
`
const RowDiv = styled.div`
  width: 80%;
  max-width: 500px;
  ${media.lessThan("large")`
    width: 90% !important;
    margin-top: 5px !important;
    margin-bottom: 5px !important;
  `}

`
const StyledLegend = styled.legend`
  padding-top: 30px !important;
  padding-bottom: 10px !important;
  color: #30AA89 !important;
`
const LastRowDiv = styled(RowDiv)`
  margin-top: 60px !important;
  ${media.lessThan("large")`
    margin-top: 40px !important;
  `}

`
const ErrorMsg = styled.div`
  color: red;
`;

class LoginPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      loginSubmitFlag: false,
      errors: {},
      errorModal: false,
      errorMessage: '',
      loadingMessage: false
    }
    this.history = createBrowserHistory();
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

  LoginSubmit = () => {
    if(this.validateForm()){
      const { tryLogin } = this.props;
      tryLogin(this.state.email, this.state.password, this.state.isKeepLogin);
      this.setState({
        loadingMessage: true
      })
    }
  }

  validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!this.state.email || this.state.email === '') {
      formIsValid = false;
      errors.email = "*Please enter your email.";
    }

    if (typeof this.state.email !== "undefined" && this.state.email !== "") {
      //regular expression for email validation
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(this.state.email)) {
        formIsValid = false;
        errors.email = "*Please enter valid email.";
      }
    }

    if (!this.state.password || this.state.password === '') {
      formIsValid = false;
      errors.password = "*Please enter your password.";
    }

    // if (typeof this.state.password !== "undefined" && this.state.password !== "") {
    //   if (!this.state.password.match(/^.*(?=.{6,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)) {
    //     formIsValid = false;
    //     errors.password = "*Please enter secure and strong password.";
    //   }
    // }

    this.setState({
      errors: errors
    });
    return formIsValid;


  }
  
  navigateSignup = () => {
    this.props.history.push('./signup');
  }

  render() {
    return (
      <LoginForm>
          {
            (this.state.loadingMessage !== false) ? (
              <div style={{position: "absolute", top: "50%", left: "50%", transform: 'translate(-50%, -50%)', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                <div uk-spinner={ `ratio: 2` } style={{ color: '#FFF', fontWeight: "600" }} /><span style={{ color: '#FFF', fontWeight: "600" }}>処理中</span>
              </div>
            ) : null
          }
          <form>
            <fieldset className="uk-fieldset">
  
                <StyledLegend className="uk-legend uk-text-center uk-text-success uk-text-bold">{ Constants.LOGIN_TITLE}</StyledLegend>
  
                <RowDiv className="uk-margin uk-align-center">
                    <LoginInput className="uk-input" type="text" name="email" placeholder="ユーザーID" onChange={ this.handleInput } value={this.state.email} />
                    <ErrorMsg>{this.state.errors.email}</ErrorMsg>
                </RowDiv>
                <RowDiv className="uk-margin uk-align-center">
                    <LoginInput className="uk-input" type="password" name="password" placeholder="パスワード" onChange={ this.handleInput } value={this.state.password} />
                    <ErrorMsg>{this.state.errors.password}</ErrorMsg>
                </RowDiv>
  
                <RowDiv className="uk-margin uk-align-center uk-grid-small uk-child-width-auto uk-grid">
                  <label><input className="uk-checkbox" type="checkbox" name="isKeepLogin" onChange={ this.handleCheckBoxChange } />{ Constants.KEEP_SIGN_IN }</label>
                </RowDiv>
  
                <RowDiv className="uk-margin uk-align-center">
                  <RoundedButton type="button" className="uk-button uk-button-success uk-width-1-1 uk-margin-small-bottom" onClick={this.LoginSubmit } > {Constants.LOGIN} </RoundedButton>
                </RowDiv>
  
                <RowDiv className="uk-margin uk-text-center uk-align-center">
                  <a className="uk-text-success uk-text-normal uk-text-center" onClick={this.props.clicked}>{Constants.FORGOT_PASSWORD}</a>
                </RowDiv>
  
                <RowDiv className="uk-margin uk-align-center uk-text-justify uk-flex uk-flex-between uk-flex-middle">
                  <LineDiv width="25%"></LineDiv>
                  <span className="uk-text-normal uk-text-center" style={{fontSize: '.8em'}}>{Constants.SNS_LOGIN_TITLE}</span>
                  <LineDiv width="25%"></LineDiv>
                </RowDiv>
  
                <RowDiv className="uk-margin uk-align-center uk-text-center uk-flex uk-flex-center uk-flex-middle">
                    <SignInFaceBook type="signin" />
                    <SignInTwitter type="signin" />
                    <SignInGoogle type="signin" />
                </RowDiv>
  
                <LastRowDiv className="uk-margin uk-align-center uk-text-center">
                  <RoundedOutlineButton type="button" className="uk-button uk-width-1-2 uk-margin-small-bottom" onClick={ this.navigateSignup }>{Constants.SIGNUP}</RoundedOutlineButton>
                </LastRowDiv>
  
            </fieldset>
        </form>  
      </LoginForm>
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.login,
  allState: state
});

const mapDispatchToProps = (dispatch) => ({
  changedValues: bindActionCreators(login.changedValues, dispatch),
  tryLogin: bindActionCreators(login.tryLogin, dispatch),
});


export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPanel);