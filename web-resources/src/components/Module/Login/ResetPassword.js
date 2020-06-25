import React, {Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createBrowserHistory } from "history";
import * as Constant from '../../../Constants';

import styled from 'styled-components';
import media from 'styled-media-query';
import login from '../../../store/actions/login'

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
  font-size: 1.2rem;

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
    height: 80%;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  `}

`
const StyledLegend = styled.legend`
  padding-top: 30px !important;
  padding-bottom: 10px !important;
  color: #30AA89 !important;
`
const ErrorMsg = styled.div`
  color: red;
`;

class LoginPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      errors: {},
      errorMessage: ''
    }
  }


  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  SendSubmit = () => {
    if(this.validateForm()){
      const { trySendRequest } = this.props;
      trySendRequest(this.state.email);
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


    this.setState({
      errors: errors
    });
    return formIsValid;


  }
  
  render() {
    return (
      <LoginForm>

          <form>
            <fieldset className="uk-fieldset">
                <StyledLegend className="uk-legend uk-text-center uk-text-success uk-text-bold">{Constant.RESET_PASSWORD_TITLE}</StyledLegend>
                <RowDiv className="uk-margin uk-align-center">
                    <LoginInput className="uk-input" type="text" name="email" placeholder="ユーザーID" onChange={ this.handleInput } value={this.state.email} />
                    <ErrorMsg>{this.state.errors.email}</ErrorMsg>
                </RowDiv>
                <RowDiv className="uk-margin uk-align-center">
                    <RoundedButton type="button" className="uk-button uk-button-success uk-width-1-1 uk-margin-small-bottom" onClick={this.SendSubmit } >{Constant.SEND_REQUEST}</RoundedButton>
                </RowDiv>
            </fieldset>
        </form>

      </LoginForm>
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.login,
});

const mapDispatchToProps = (dispatch) => ({
  changedValues: bindActionCreators(login.changedValues, dispatch),
  trySendRequest: bindActionCreators(login.trySendRequest, dispatch),
});


export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPanel);