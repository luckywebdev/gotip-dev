import React, { Component } from 'react';
import Aux from '../hoc/Au/Auxx';

import withErrorHandler from '../hoc/WithErrorHandler/WithErrorHandler';
import { withRouter } from 'react-router-dom';
import ContactInfo from '../components/Module/Contact';

import Modal from '../components/UI/Modal/Modal';
import axios from '../axios-instance';
import Layout from '../hoc/Layout/Layout';
import Cover from '../components/UI/Cover';

import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import styled from 'styled-components';

const MainContainer = styled.div`
  max-width: 60%;
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logining: false,
      errorModal: false,
      errorMessage: ""
    };

  }

  render() {
    return (
      <Aux>
        <Layout {...this.props.history}>
            <Modal show={this.state.errorModal}>
                {this.state.errorMessage}        
            </Modal>
            <MainContainer>
              <Cover />
              <ContactInfo />
            </MainContainer>     
        </Layout>
      </Aux>
    );
  }
}


export default withErrorHandler(withRouter(Contact), axios);

