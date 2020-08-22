import React, { Component } from 'react';
import Aux from '../../hoc/Au/Auxx';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withRouter } from 'react-router-dom';
import main from '../../store/actions/main';
import Layout from '../../hoc/Layout/AdminLayout';
import Cover from '../../components/UI/Cover'
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import styled from 'styled-components';
import media from 'styled-media-query';
import LoadingCover from '../../components/UI/loadingCover';
import SideMenu from '../../components/SideMenu';
import HomeMainContent from '../../components/Admin/HomeMainContent';

const MainContainer = styled.div`
  max-width: 80%;
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 2%;
  box-sizing: border-box;
`;

var loadingMessage = null;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logining: false,
        errorModal: false,
        errorMessage: "",
        menuShowHandler: false,
    };
  }

  render() {
    return (
      <Aux>
        <LoadingCover  text={ loadingMessage !== null ? loadingMessage : null } />

        <Layout {...this.props} >
            <MainContainer>
                <HomeMainContent />
            </MainContainer>
        </Layout>
      </Aux>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  gotipShow: bindActionCreators(main.gotipShow, dispatch),
  getAccountInfo: bindActionCreators(main.getAccountInfo, dispatch),
  executeLogout: bindActionCreators(main.executeLogout, dispatch),
});


export default connect(null, mapDispatchToProps)(withRouter(Home));
