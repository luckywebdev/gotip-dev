import React, { Component } from 'react';
import Aux from '../../../hoc/Au/Auxx';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withRouter } from 'react-router-dom';
import main from '../../../store/actions/main';
import Layout from '../../../hoc/Layout/AdminLayout';
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import styled from 'styled-components';
import media from 'styled-media-query';
import LoadingCover from '../../../components/UI/loadingCover';
import CreatorRegContent from '../../../components/Admin/Creator';
import CreatorSearchContent from '../../../components/Admin/Creator/creatorSearch';
import CreatorOnlineContent from '../../../components/Admin/Creator/creatorOnline';
import CreatorDetailContent from '../../../components/Admin/Creator/creatorDetail';
import CreatorSalesContent from '../../../components/Admin/Creator/creatorSaleSearch';
import CreatorCompensationContent from '../../../components/Admin/Creator/creatorCompensation';
import CreatorDailySaleContent from '../../../components/Admin/Creator/creatorDailySale';
import CreatorPersonalSaleContent from '../../../components/Admin/Creator/creatorPersonalSale';

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

const Content = (props) => {
  let pathName = "";
  const url = props.match.url;
  const params = props.match.params;
  let param = "";
  if(Object.keys(params).length === 0 && params.constructor === Object){
    const pathArr = url.split('/');
    pathName = pathArr.slice(-1)[0];
  }
  else{
    const pathArr = url.split('/');
    pathName = pathArr.slice(-2)[0];
    param = pathArr.slice(-2)[1];
  }

  let components = null
  switch (pathName) {
    case 'register':
      components = (<CreatorRegContent />);
      break;
    case 'searchCreator':
      components = props.detailView ? (<CreatorDetailContent changeComponent={props.changeComponent} creatorID={props.creatorID} />) : (<CreatorSearchContent changeComponent={props.changeComponent} creatorID={props.creatorID} />);
      break;
    case 'onlineCreator':
      components = props.detailView ? (<CreatorDetailContent changeComponent={props.changeComponent} creatorID={props.creatorID} />) : (<CreatorOnlineContent changeComponent={props.changeComponent} creatorID={props.creatorID} />);
      break;
    case 'saleCreator':
      components = (<CreatorSalesContent />);
      break;
    case 'compensation':
      components = (<CreatorCompensationContent />);
      break;
    case 'dailySale':
      components = (<CreatorDailySaleContent timestamp={param} />);
      break;
    case 'personalSale':
      components = (<CreatorPersonalSaleContent params={param} />);
      break;
    default:
      break;
  }
  return components;
}

class AgentReg extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logining: false,
        errorModal: false,
        errorMessage: "",
        menuShowHandler: false,
        detailView: false,
        creatorID: "",
   };
  }

  changeComponent = (creatorID = null) => {
    if(!this.state.detailView){
      this.setState({
        detailView: true,
        creatorID: creatorID,
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
                <Content history={this.props.history} match={this.props.match} detailView={this.state.detailView} changeComponent={this.changeComponent} creatorID={this.state.creatorID} />
            </MainContainer>
        </Layout>
      </Aux>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getAccountInfo: bindActionCreators(main.getAccountInfo, dispatch),
  executeLogout: bindActionCreators(main.executeLogout, dispatch),
});


export default connect(null, mapDispatchToProps)(withRouter(AgentReg));
