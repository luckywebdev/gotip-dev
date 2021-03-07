import React, {Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Constants from "../../../Constants";
import styled from 'styled-components';
import login from '../../../store/actions/login'
import registration from '../../../store/actions/registration';

const IconImage = styled.img`
  width: 42px;
  height: 42px;
  margin: auto 20px;
`

class signInTwitter extends Component {
  constructor(props){
    super(props);

  }

  handleLogin = () => {
    if(this.props.type === "signin"){
      const { tryTwitterLogin } = this.props;
      tryTwitterLogin();
    }
    else{
      const { tryTwitterSignup } = this.props;
      tryTwitterSignup(this.props.agentID);  
    }
  }


  render() {
    return (
      <IconImage src={`${Constants.LOCAL_IMAGE_URL}twitter_icon.png`} onClick={this.handleLogin} alt="twitter_icon" />
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.login,
});

const mapDispatchToProps = (dispatch) => ({
  tryTwitterLogin: bindActionCreators(login.tryTwitterLogin, dispatch),
  tryTwitterSignup: bindActionCreators(registration.tryTwitterSignup, dispatch),
});


export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(signInTwitter);
