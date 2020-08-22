import React, {Component} from 'react';

import Aux from '../hoc/Au/Auxx';
import * as Constants from '../Constants';
import LoginPanel from '../components/Module/Login/LoginPanel';
import Modal from '../components/UI/Modal/Modal';
import withErrorHandler from '../hoc/WithErrorHandler/WithErrorHandler';
import { withRouter } from 'react-router-dom';
import axios from '../axios-instance';
import styled from 'styled-components';
import Logo from '../components/UI/logo';

const StyledContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #30AA89;
  display: flex;
  justify-content: center;
`;


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logining: false,
        errorModal: false,
        errorMessage: ""
    };
  }
  render(){
    const loginPanel = (
        <LoginPanel {...this.props} />
    );

    return(
        <Aux>
            <Modal show={this.state.errorModal} modalClosed={this.modalCancelHandler}>
                {this.state.errorMessage}        
            </Modal>
            <StyledContainer>
              <Logo width='87px' height='120px' src={`${Constants.LOCAL_IMAGE_URL}login_logo.png`} alt='login_logo' margin="20px 10px auto" />
              { loginPanel } 
            </StyledContainer>
        </Aux>
    );
  }
}

export default withErrorHandler(withRouter(Login), axios);