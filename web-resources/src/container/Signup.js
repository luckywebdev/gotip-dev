import React, {Component} from 'react';

import Aux from '../hoc/Au/Auxx';
import SignupPanel from '../components/Module/SignUp';
import Modal from '../components/UI/Modal/Modal';
import withErrorHandler from '../hoc/WithErrorHandler/WithErrorHandler';
import { withRouter } from 'react-router-dom';
import axios from '../axios-instance';
import styled from 'styled-components';
import Logo from '../components/UI/logo';

const StyledContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #30AA89;
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: auto;
`;


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logining: false,
    };
  }
  render(){
    const signupPanel = (
        <SignupPanel {...this.props} />
    );

    return(
        <Aux>
          <div style={{height: '100vh', overflowY: 'auto'}}>
            <StyledContainer>
              <Logo width='87px' height='120px' src='/static/img/login_logo.png' alt='login_logo' margin="20px auto auto" />
              {signupPanel} 
            </StyledContainer>
          </div>
        </Aux>
    );
  }
}

export default withRouter(Login);