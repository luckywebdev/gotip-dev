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

class signInFaceBook extends Component {

  handleLogin = () => {
    const { tryFacebookLogin } = this.props;
    tryFacebookLogin();
  }

  render() {
    return (
      <IconImage src={`${Constants.LOCAL_IMAGE_URL}facebook_icon.png`} alt="facebook_icon" onClick={this.handleLogin} />
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.login,
});

const mapDispatchToProps = (dispatch) => ({
  tryFacebookLogin: bindActionCreators(login.tryFacebookLogin, dispatch),
});


export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(signInFaceBook);