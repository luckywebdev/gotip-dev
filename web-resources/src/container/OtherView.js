import React, { Component } from 'react';
import Aux from '../hoc/Au/Auxx';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withRouter } from 'react-router-dom';
import main from '../store/actions/main';
import Layout from '../hoc/Layout/Layout';
import Cover from '../components/UI/Cover'
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken, faHeartbeat } from '@fortawesome/free-solid-svg-icons'

import styled from 'styled-components';
import media from 'styled-media-query';
import Img from '../components/UI/img';
import Btn from '../components/UI/btn';
import Anchor from '../components/UI/a';
import GoTipCard from '../components/Module/GoTipCard';
import UserProfile from '../components/Module/UserProfile/other';
import UserMessage from '../components/Module/UserMessage/other';
import BLEList from '../components/Module/BleList';
import ScheduleList from '../components/Module/ScheduleList/other';
import RankingList from '../components/Module/RankingList/other';
import LoadingCover from '../components/UI/loadingCover';


const MainContainer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
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
  box-sizing: border-box;
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
  box-sizing: border-box;
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
const OutlineButton = styled.span`
  background-color: transparent;
  border: 1px solid #30AA89;
  color: #30AA89;
  box-shadow: none;
  border-radius: 5px;
  padding: .1rem .5rem;
  margin-left: 1rem;
  cursor: pointer;
  box-sizing: border-box;
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


const GoTipDiv = styled.div`
  width: 180px;
  height: 180px;
  border: 1px solid #EA497B;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
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

var loadingMessage = null;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logining: false,
        errorModal: false,
        errorMessage: "",
        menuShowHandler: false,
        following: false
    };
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    const { mainState } = this.props;
    this.setState({
      sendID: localStorage.getItem('uid'),
      recID: params.uid,
      sendName: typeof mainState.user !== 'undefined' ? mainState.user.name.nickname : ''
    })
    console.log(params.uid);
    const { getAccountInfo, getOtherAccountInfo } = this.props;
    getAccountInfo(localStorage.getItem('uid'));
    getOtherAccountInfo(params.uid);
    loadingMessage = "データロード中";
  }

  gotip = () => {
    const { mainState, gotipShow } = this.props;
    let gotip_show_state = mainState.show_state;
    if(gotip_show_state === undefined)
      gotip_show_state = false;
    gotipShow(!gotip_show_state);
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

  changeFollow = () => {
    this.setState({
      following: !this.state.following
    })
  }

  handleChip = (value, type) => {
    const { mainState } = this.props;

    const chipData = { 
      chipAmount: value,
      chipType: type,
      sendID: this.state.sendID,
      sendName: this.state.sendName,
      recID: this.state.recID,
      recName: typeof mainState.otherUser !== 'undefined' ? mainState.otherUser.name.nickname : ''
    }
    console.log("chip====>", chipData);
    this.props.sendChip(chipData);
  }

  render() {
    const { mainState } = this.props;
    const gotip_show_state = mainState.show_state;
    let GoTipCards = '';
    if(gotip_show_state === true){
      GoTipCards = (
        <GoTipCard />
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
                    <OutlineButton>シェア</OutlineButton>
                    <button type="button" style={buttonStyle} onClick={this.changeFollow}><FontAwesomeIcon icon={ this.state.following ? faHeart : faHeartbeat } color="#30AA89"/></button>
                  </div>
                  {
                    mainState.otherUser.auth_level === 2 ? (
                      <GoTipDiv onClick={ this.gotip }>
                        <div>
                          <span style={{color: "#FFF", fontSize: "32px", fontWeight: "bolder"}}>Go Tip</span>
                          <span style={{color: "#FFF", fontSize: "12px"}}>このユーザーに <br /> チップする！</span>
                        </div>
                      </GoTipDiv>
                    ) : ''
                  }
                  {/* <Img src="/static/img/GoTip.png" margin="10% 0" width="100%" height="auto" alt="GoTip" clicked={ this.gotip } /> */}
                </RightSection>
              </UserSection>
              <InfoSection>
                <InfoLeftSubSection>
                  <BLEList />
                </InfoLeftSubSection>
                <InfoRightSubSection>
                  <ScheduleList />
                </InfoRightSubSection>
              </InfoSection>
              <InfoSection>
                <RankingList />
              </InfoSection>

            </MainContainer>
            
            { GoTipCards }
            
        </Layout>
      </Aux>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  gotipShow: bindActionCreators(main.gotipShow, dispatch),
  getAccountInfo: bindActionCreators(main.getAccountInfo, dispatch),
  getOtherAccountInfo: bindActionCreators(main.getOtherAccountInfo, dispatch),
  executeLogout: bindActionCreators(main.executeLogout, dispatch),
  sendChip: bindActionCreators(main.sendChip, dispatch)
});


const mapStateToProps = (state) => ({
  mainState: state.main,
  loginState: state.login
});


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main));
