import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import main from '../../../store/actions/main';
import userEdit from '../../../store/actions/userEdit';

import * as Constants from '../../../Constants';


import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled from 'styled-components';
import Btn from '../../UI/btn';
import Input from '../../UI/input';
import Div from '../../UI/div';

const UserProfileContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: relative;
`

const ProfileImage = styled.img`
  width: 165px;
  height: 163px;
  border-radius: 5px;
  border: none;
  background-color: #EDF1FA;
  margin-top: -5%;
  margin-right: 2%;
`
const OnlineStateButton = styled.span`
  border-radius: 20px;
  padding: .1rem 1rem;
  // margin: 1rem 1rem .5rem 1rem;
  text-align: center;
  color: #FFF;
  background-color: #EA497B;
  border: none;
`
const ProfileImageEditIcon = styled.span`
  width: 35px;
  height: 35px;
  position: absolute;
  bottom: -10px;
  left: 145px;
  z-index: 1005;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const PictureEditSection = styled.div`
  width: 100%;
  margin-top: 2rem;
`
const PersonalInfoEditSection = styled.div`
  width: 80%;
  margin: 2rem auto 1rem auto;
`

const ModalTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.5rem !important;
  font-weight: bolder;
  margin-top: 2%;
`
// let profileImageEdit = '';
// let profileInfoEdit = '';

var ageList = []
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      updateType: 'photo',
      countNum: 0,
      userName: '',
      userAge: '',
      userState: 0,
      color: 'rgba(48, 170, 137, 1)',
      loadingMessage: null,
      profileImage: '/static/img/user1.png'
    }
  }

  componentDidMount() {
    for(let i = 10; i < 100; i++){
      ageList.push({displayValue: i, value: i})
    }
  }

  render() {
    const { allState } = this.props;
    const userData = {
      userName: '',
      userAge: '',
      userState: 0,
      color: 'rgba(48, 170, 137, 1)',
      profileImage: this.state.profileImage
    };

    if(typeof allState.main.otherUser !== 'undefined' && Object.keys(allState.main.otherUser).length !== 0 && allState.main.otherUser.constructor === Object){
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const userAge = (typeof allState.main.otherUser.birthdate !== 'undefined' && allState.main.otherUser.birthdate.year !== "") ? (currentYear - allState.main.otherUser.birthdate.year) : "";
  
      userData.userName = allState.main.otherUser.name.nickname;
      userData.userAge = userAge;
      userData.color = allState.main.otherUser.theme_color;
      userData.userState = allState.main.otherUser.userState;
      if(typeof allState.main.otherUser.profileImgUrl !== 'undefined' && allState.main.otherUser.profileImgUrl !== '')
        userData.profileImage = allState.main.otherUser.profileImgUrl;
    }
    const theme_color = typeof allState.main.otherUser !== 'undefined' && typeof allState.main.otherUser.theme_color !== 'undefined' ? allState.main.otherUser.theme_color : "#30AA89";


    return(
      <UserProfileContent>
        <ProfileImage src={userData.profileImage} alt="user_avatar" />
        <div className="uk-flex uk-flex-column uk-flex-left uk-flex-top">
          <div className="uk-flex uk-flex-row" style={{margin: "1rem 1rem 0.5rem 1rem"}}>
            <OnlineStateButton>Online</OnlineStateButton>
          </div>
          <div className="uk-margin-left">
            <span>{userData.userName}</span>
            <span>{(userData.userAge !== '' && userData.userState === '0') ? '(' + userData.userAge + '歳)' : '' }</span>

          </div>
        </div>
      </UserProfileContent>
    )
  }

}

const mapStateToProps = (state) => ({
  allState: state
});

const mapDispatchToProps = (dispatch) => ({
  getAccountInfo: bindActionCreators(main.getAccountInfo, dispatch),
});


export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);