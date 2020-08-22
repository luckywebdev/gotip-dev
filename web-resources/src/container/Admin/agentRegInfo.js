import React, { Component } from 'react';
import Aux from '../../hoc/Au/Auxx';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withRouter } from 'react-router-dom';
import main from '../../store/actions/main';
import Layout from '../../hoc/Layout/AdminLayout';
import Text from '../../components/UI/text';
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import styled from 'styled-components';
import media from 'styled-media-query';
import LoadingCover from '../../components/UI/loadingCover';
import AgentRegContent from '../../components/Admin/AgentReg/agentInfoReg';

const MainContainer = styled.div`
  max-width: 80%;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 1%;
  box-sizing: border-box;
  margin: auto;
`;

var loadingMessage = null;

class AgentReg extends Component {
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

        <Layout {...this.props} regFlag={true} >
            <MainContainer>
              <Text  str={"代理店登録"} textAlign="center" color="#333" fontSize="1.8rem" fontWeight="900" margin="0 .3rem" />
              <AgentRegContent />
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


export default connect(null, mapDispatchToProps)(withRouter(AgentReg));
