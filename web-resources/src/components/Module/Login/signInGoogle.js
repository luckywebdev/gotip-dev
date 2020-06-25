import React, {Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Constants from "../../../Constants";
import styled from 'styled-components';
import login from '../../../store/actions/login'

const IconImage = styled.img`
  width: 42px;
  height: 42px;
  margin: auto 20px;
`

class signInGoogle extends Component {

  handleLogin = () => {
    const { tryGoogleLogin } = this.props;
    tryGoogleLogin();
  }

  render() {
    return (
      <IconImage src={`${Constants.LOCAL_IMAGE_URL}google_icon.png`} alt="google_icon" onClick={this.handleLogin} />
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.login,
});

const mapDispatchToProps = (dispatch) => ({
  tryGoogleLogin: bindActionCreators(login.tryGoogleLogin, dispatch),
});


export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(signInGoogle);