import React, { Component } from 'react';
import Aux from '../hoc/Au/Auxx';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Constants from "../Constants";
import {
  FacebookShareButton,
  TwitterShareButton,
  LineShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LineIcon,
  EmailIcon
} from "react-share";

import { withRouter } from 'react-router-dom';
import main from '../store/actions/main';
import editInformation from '../store/actions/editInformation';
import Layout from '../hoc/Layout/Layout';
import Cover from '../components/UI/Cover'
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import styled from 'styled-components';
import media from 'styled-media-query';
import Img from '../components/UI/img';
import Btn from '../components/UI/btn';
import Anchor from '../components/UI/a';
import GoTipCard from '../components/Module/GoTipCard';
import UserProfile from '../components/Module/UserProfile';
import UserMessage from '../components/Module/UserMessage';
import BLEList from '../components/Module/BleList';
import ScheduleList from '../components/Module/ScheduleList';
import RankingList from '../components/Module/RankingList';
import LoadingCover from '../components/UI/loadingCover';
import PointDetail from '../components/Module/Point';
import ModalComponent from '../components/ModalComponent';

const MainContainer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${media.lessThan("large")`
    width: 70%;
  `}
  ${media.lessThan("medium")`
    width: 80%;
  `}
`

const UserSection = styled.div`
  background-color: #FFF;
  width: 100%;
  padding-left: 8%;
  padding-right: 8%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding-bottom: 2%;
  &>div:nth-child(first) {
    width: 80%;
  }
`
const LeftSection = styled.div`
  width: 80%;
`
const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 1%;
`

const InfoSection = styled.div`
  background-color: #ECEFF2;
  width: 100%;
  padding: 2% 8%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  ${ media.lessThan('medium')`
    flex-direction: column;
  ` }

`
const OutlineButton = styled.button`
  background-color: transparent;
  border: 1px solid #30AA89;
  color: #30AA89;
  box-shadow: none;
  border-radius: 5px;
  padding: .1rem .5rem;
  margin-left: 1rem;
  cursor: pointer;
  outline: none;
  &:hover {
    box-shadow: none;
    border: 1px solid #30AA89;
  }
  &:focus {
    box-shadow: none;
    border: 1px solid #30AA89;
  }
  &.active {
    box-shadow: none;
    border: 1px solid #30AA89;
  }
`

const buttonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #30AA89',
  color: '#30AA89',
  boxShadow: 'none',
  borderRadius: '5px',
  padding: '.1rem .5rem',
  marginLeft: '1rem',
  cursor: 'pointer',
  outline: 'none'
}


const InfoLeftSubSection = styled.div`
  width: 58%;
  margin-right: 1%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  ${ media.lessThan('medium')`
    width: 100%;
  ` }
`
const InfoRightSubSection = styled.div`
  width: 38%;
  margin-left: 1%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  ${ media.lessThan('medium')`
    width: 100%;
  ` }
`
const MenuContent = styled.div`
  position: absolute;
  top: 42px;
  right: auto;
  height: 10px;
  width:220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  transition: .5s;
  background-color: #FFF;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  overflow-y: hidden;
  div{
    width: 100%;
    height: 80%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 10%;
    span {
      a{
        transition: 0.3s;
        &::before {
          color: #04BBAF;
          font-weight: bold;
          font-size: 22px;
          display: inline-block; 
          width: 1em;
          margin-left: 1em;
          margin-right: 0;
          content: "\\2022";
        }
      }
    }
  }
`;

const SharingModal = styled.div`
  position: absolute;
  top: 42px;
  right: auto;
  height: 10px;
  width:320px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  transition: .5s;
  background-color: #FFF;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  overflow: hidden;
  div{
    width: 100%;
    height: 80%;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 10%;
  }
`;

const GoTipDiv = styled.div`
  width: 180px;
  height: 180px;
  border: 1px solid #EA497B;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  div {
    width: 90%;
    height: 90%;
    background-color: #EA497B;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;

const menuList = [
  {
    id: 'profile_update',
    name: '登録情報変更 ',
    url: ''
  },
  {
    id: 'category_update',
    name: '登録カテゴリ編集 ',
    url: ''
  },
  {
    id: 'follower_list',
    name: 'フォロワー一覧 ',
    url: ''
  },
  {
    id: 'logout',
    name: 'ログアウト',
    url: ''
  }
]

var shareUrl = '';
var loadingMessage = null;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logining: false,
        errorModal: false,
        errorMessage: "",
        menuShowHandler: false,
        sharingShowHandler: false,
        detailModal: false
    };
  }

  componentDidMount() {
    const { getAccountInfo, executeRefreshInfo } = this.props;
    getAccountInfo(localStorage.getItem('uid'));
    executeRefreshInfo({uid: localStorage.getItem('uid')})
    loadingMessage = "データロード中";
    shareUrl = `${Constants.SHARING_URL}${localStorage.getItem('uid')}`;
  }

  gotip = () => {
    const { mainState } = this.props;
    let gotip_show_state = mainState.show_state;
    if(gotip_show_state === undefined)
      gotip_show_state = false;
    this.props.gotipShow(!gotip_show_state);
  };
  

  DropDownMenuHandler = () => {
    this.setState({
      menuShowHandler: !this.state.menuShowHandler
    });
  }

  handleSignOut = () => {
    const { executeLogout } = this.props;
    executeLogout();
  }

  SharingModal = () => {
    this.setState({
      sharingShowHandler: !this.state.sharingShowHandler
    })
  }

  pointDetailModal = () => {
    this.setState({
      detailModal: !this.state.detailModal
    })
  }


  render() {
    const point_json = [100, 500, 1000, 1500, 2000, 2500, 3000, 5000];
    const { mainState } = this.props;
    let currentPoint = 0;
    if(typeof mainState.points !== 'undefined'){
      currentPoint = mainState.points.data.normal.value + mainState.points.data.subscription.value;
    }
    const gotip_show_state = mainState.show_state;
    let rowDiv = [];
    let GoTipCards = '';
    if(gotip_show_state === true){
      const point_json_length = Math.ceil(point_json.length / 2);

      for(let x = 0; x < point_json_length; x++ ) {
        const left_Btn = (<Btn btnType="rounded" radius="2px" width="20%" color="#FFF" text={point_json[x * 2]} backcolor="#EA497B"/>);
        const right_Btn = (point_json[(x * 2) + 1]) ? (<Btn btnType="rounded" width="20%" radius="2px" color="#FFF" text={point_json[(x * 2) + 1]} backcolor="#EA497B"/>) : '';
        rowDiv.push(
          <div className="uk-flex uk-flex-between" key={x}>
            { left_Btn }
            { right_Btn }
          </div>
        );
      }
      GoTipCards = (
        <GoTipCard>
          { rowDiv }
        </GoTipCard>
      );
    }
    if(mainState.gettingState){
      loadingMessage = null;
    }
    return (
      <Aux>
        <LoadingCover  text={ loadingMessage !== null ? loadingMessage : null } />

        <Layout {...this.props} >
            <MainContainer>
              <Cover></Cover>
              <UserSection>
                <LeftSection>
                  <UserProfile></UserProfile>
                  <UserMessage></UserMessage>
                </LeftSection>
                <RightSection>
                  <div className="uk-flex uk-flex-row uk-flex-right" style={{position: "relative"}}>
                    <OutlineButton onClick={ this.SharingModal }>シェア</OutlineButton>
                    <SharingModal style={{height: this.state.sharingShowHandler ? '80px' : "0px"}}>
                      <div>
                        <FacebookShareButton url={shareUrl} >
                          <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                        <TwitterShareButton url={shareUrl} >
                          {/* <img src={`${Constants.LOCAL_IMAGE_URL}shareImg.png`} /> */}
                          <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                        <LineShareButton url={shareUrl} >
                          <LineIcon size={32} round={true} />
                        </LineShareButton>
                        <EmailShareButton url={shareUrl} >
                          <EmailIcon size={32} round={true} />
                        </EmailShareButton>
                      </div>
                    </SharingModal>
                    <button type="button" uk-toggle="target: #offcanvas-slide" style={buttonStyle}><span uk-icon="menu"></span></button>
                  </div>
                  <GoTipDiv>
                    <div>
                      <span style={{color: "#FFF", fontSize: "12px"}}>現在の保有ポイント</span>
                      <span style={{color: "#FFF", fontSize: "22px", fontWeight: "bolder"}}>{currentPoint} <small>pt</small></span>
                      <Btn backcolor="#FFF" color="#EA497B" fontSize="12px" margin=".3rem" padding=".3rem .8rem" text={Constants.CHECK} onClick={this.pointDetailModal} />
                    </div>
                  </GoTipDiv>
                  <PointDetail detailModal={this.state.detailModal} pointDetailModal={this.pointDetailModal} />

                  {/* <Img src="/static/img/GoTip.png" margin="10% 0" width="100%" height="auto" alt="GoTip" clicked={ this.gotip } /> */}
                </RightSection>
              </UserSection>
              <InfoSection>
                <InfoLeftSubSection>
                  <BLEList />
                </InfoLeftSubSection>
                <InfoRightSubSection>
                  {
                    typeof mainState.user !== 'undefined' && mainState.user.auth_level === 2 ? (
                      <ScheduleList />
                    ) : ''
                  }
                </InfoRightSubSection>
              </InfoSection>
              <InfoSection>
                {
                  typeof mainState.user !== 'undefined' && mainState.user.auth_level === 2 ? (
                    <RankingList />
                  ) : ''
                }
              </InfoSection>

            </MainContainer>
            
            { GoTipCards }
            
            <ModalComponent />
        </Layout>
      </Aux>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  gotipShow: bindActionCreators(main.gotipShow, dispatch),
  getAccountInfo: bindActionCreators(main.getAccountInfo, dispatch),
  executeRefreshInfo: bindActionCreators(editInformation.executeRefreshInfo, dispatch),
  executeLogout: bindActionCreators(main.executeLogout, dispatch),
});


const mapStateToProps = (state) => ({
  mainState: state.main,
  loginState: state.login
});


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main));
