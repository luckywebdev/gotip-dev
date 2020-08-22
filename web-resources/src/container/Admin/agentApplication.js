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
import AgentApplicationContent from '../../components/Admin/AgentReg/agentApplication';
import AgentApplicationDetailContent from '../../components/Admin/AgentReg/agetnApplicationDetail';

const MainContainer = styled.div`
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 2%;
  box-sizing: border-box;
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
        detailView: false,
        agentID: "",
        currentStatus: 0,
    };
  }

  changeComponent = (agentId, currentStatus) => {
    if(!this.state.detailView){
      this.setState({
        detailView: true,
        agentID: agentId,
        currentStatus: currentStatus
      })
    }
    else{
      this.setState({
        detailView: false
      })
    }
  }

  render() {
    return (
      <Aux>
        <LoadingCover  text={ loadingMessage !== null ? loadingMessage : null } />

        <Layout {...this.props} >
            <MainContainer>
              {
                this.state.detailView ? (
                  <AgentApplicationDetailContent currentStatus={this.state.currentStatus} agentID={this.state.agentID} changeComponent={this.changeComponent} />
                ) : (
                  <AgentApplicationContent changeComponent={this.changeComponent} />
                )
              }
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
