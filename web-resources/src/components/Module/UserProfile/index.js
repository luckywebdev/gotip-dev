import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import main from '../../../store/actions/main';
import userEdit from '../../../store/actions/userEdit';

import * as Constants from '../../../Constants';

import Modal from '../../UI/Modal/Modal';
import InputColor from 'react-input-color';

import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled from 'styled-components';
import Btn from '../../UI/btn';
import Input from '../../UI/input';
import Div from '../../UI/div';
import SnsUrlInfo from '../../Partial/SnsUrlInfo';

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

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.allState.userEdit.editResult !== nextProps.allState.userEdit.editResult)
      return true;
    if(this.state.editable !== nextState.editable)
      return true;
    if(this.state.userName !== nextState.userName || this.state.userAge !== nextState.userAge || this.state.userState !== nextState.userState || this.state.color !== nextState.color || this.state.avatar !== nextState.avatar)
      return true;
    if(this.props.allState.main !== nextProps.allState.main)
      return true;
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    const { allState } = this.props;
    if(allState.userEdit.editResult && this.state.editable && allState.main.gettingState) {
      this.setState({
        editable: false
      }, function() {
        const { changeState } = this.props;
        changeState();
      })
    }

  }

  EditablePhotoChange = () => {
    this.setState({
      editable: !this.state.editable,
      updateType: 'photo',
    });
  }
  
  EditablePersonalInfoChange = () => {
    const { allState } = this.props;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const userAge = (typeof allState.main.user.birthdate !== 'undefined') ? (currentYear - allState.main.user.birthdate.year) : "";
    this.setState({
      editable: !this.state.editable,
      updateType: 'personal',
      userName: allState.main.user.name.nickname,
      userAge: userAge,
      color: allState.main.user.theme_color,
      userState: allState.main.user.userState
    });
  }

  userDataChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  userThemeColorChange = (color) => {
    this.setState({
      color: color.rgba
    })
  }

  profileImageEdit = () => {
    const { allState } = this.props;
    const theme_color = typeof allState.main.user !== 'undefined' && typeof allState.main.user.theme_color !== 'undefined' ? allState.main.user.theme_color : "#30AA89";
    return (
      // <ProfileImageEditIcon src="/static/img/photoedit_icon.png" alt="photoedit_icon" onClick={this.EditablePhotoChange} />
      <ProfileImageEditIcon  style={{backgroundColor: theme_color, color: "#FFF"}} onClick={this.EditablePhotoChange} > <span  uk-icon="icon: camera" style={{color: "#FFF"}}></span> </ProfileImageEditIcon>
    );
  }
  profileInfoEdit = () => {
    const { allState } = this.props;
    const theme_color = typeof allState.main.user !== 'undefined' && typeof allState.main.user.theme_color !== 'undefined' ? allState.main.user.theme_color : "#30AA89";
    return   (
      <Btn text={Constants.PROFILE_EDIT_BTN} color={theme_color} btnType="rounded" border={`1px solid ${theme_color}`} fontSize=".7rem" backcolor="transparent" radius="3px" onClick={ this.EditablePersonalInfoChange } />
    );  
  }

  PersonalInfoUpdate = () => {
    let infoData = {
      nickname: this.state.userName,
      userAge: this.state.userAge,
      userState: this.state.userState,
      themeColor: this.state.color
    }
    const { updatePersonalInfo } = this.props;
    updatePersonalInfo(infoData);
  }

  PhotoUpdate = () => {
    const imageData = this.state.avatar;
    const { uploadImage, allState } = this.props;
    if(typeof imageData !== 'undefined') {
      const fileType = imageData.file.name.split('.').pop();
      imageData.fileType = fileType;
      imageData.imgType = 'profile';
      uploadImage(imageData);
    }
    else{
      alert("Please select image");
      this.setState({
        editable: false
      })
    }

  }

  onChangeHandler = () => {
    document.getElementById("profile_image").click();
  }

  onChangeImage = (e) => {
    if (e.target && e.target.files && e.target.files[0] && e.target.files[0].type.match(/image/) && e.target.files[0].size < 10000000) {

      let imageData = { file: e.target.files[0]};
      const fileType = imageData.file.name.split('.').pop();

      const freader = new FileReader()
      
      freader.onload = async loaded => {
        if (freader.result) {
          const imageBlob = await Constants.convertToBlobPng(freader.result, fileType)
          imageData.dataURL = imageBlob;
          document.getElementById("profileImgShow").src = freader.result;
        }
      }

      freader.readAsDataURL(e.target.files[0]);

      this.setState({
        avatar: imageData,
      })
    }
  }

  render() {
    const maxMbFileSize = 5 * 1024 * 1024; // 5Mb
    const { allState } = this.props;
    const userData = {
      userName: '',
      userAge: '',
      userState: 0,
      color: 'rgba(48, 170, 137, 1)',
      profileImage: this.state.profileImage
    };

    if(typeof allState.main.user !== 'undefined' && Object.keys(allState.main.user).length !== 0 && allState.main.user.constructor === Object){
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const userAge = (typeof allState.main.user.birthdate !== 'undefined' && allState.main.user.birthdate.year !== "") ? (currentYear - allState.main.user.birthdate.year) : "";
  
      userData.userName = allState.main.user.name.nickname;
      userData.userAge = userAge;
      userData.color = allState.main.user.theme_color;
      userData.userState = allState.main.user.userState;
      if(typeof allState.main.user.profileImgUrl !== 'undefined' && allState.main.user.profileImgUrl !== '')
        userData.profileImage = allState.main.user.profileImgUrl;
    }
    const theme_color = typeof allState.main.user !== 'undefined' && typeof allState.main.user.theme_color !== 'undefined' ? allState.main.user.theme_color : "#30AA89";


    return(
      <UserProfileContent>
        <ProfileImage src={userData.profileImage} alt="user_avatar" />
        { this.props.editable ? this.profileImageEdit() : '' }
        <div className="uk-flex uk-flex-column uk-flex-left uk-flex-top">
          <div className="uk-flex uk-flex-row" style={{margin: "1rem 1rem 0.5rem 1rem"}}>
            <OnlineStateButton>Online</OnlineStateButton>
            <SnsUrlInfo editable={this.props.editable} />
          </div>
          <div className="uk-margin-left">
            <span>{userData.userName}</span>
            <span>{(userData.userAge !== '' && userData.userState === '0') ? '(' + userData.userAge + '歳)' : '' }</span>

          </div>
          { this.props.editable ? this.profileInfoEdit() : '' }
        </div>
        <Modal width="50%" show={this.state.editable} modalClosed={this.state.updateType === 'photo' ? this.EditablePhotoChange : this.EditablePersonalInfoChange}>

          <ModalTitle>{this.state.updateType === 'photo' ? Constants.PROFILE_PICTURE_EIDT_TITLE : Constants.PROFILE_EDIT_TITLE}</ModalTitle>
            {
              this.state.updateType === 'photo' ? (
                <PictureEditSection>
                  {
                    (typeof allState.main.loadingMessage != 'undefined' && allState.main.loadingMessage !== null) ? (
                      <div style={{position: "absolute", top: "50%", left: "50%", transform: 'translate(-50%, -50%)', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                        <div uk-spinner={ `ratio: 2` } style={{ color: '#FFF', fontWeight: "600" }} /><span style={{ color: '#FFF', fontWeight: "600" }}>{allState.main.loadingMessage}</span>
                      </div>
                    ) : null
                  }
                  <div className="uk-flex uk-flex-center" style={{width: "165px", height: "165px", zIndex: "2000", margin: 'auto', border: '1px solid #ddd', borderRadius: '5px' }}    >
                    <img src={userData.profileImage} alt="avatar" id="profileImgShow" onClick={this.onChangeHandler} />
                    <input type="file" style={{display: "none"}} id="profile_image" onChange={this.onChangeImage} />
                  </div>
                </PictureEditSection>
              ) : (
                <PersonalInfoEditSection>
                  <Div width="90%" margin=".1rem auto" padding=".5rem" justify="space-between">
                    <Div width="20%" margin="0rem" padding="0" justify="flex-start">
                      <label>{Constants.DISPLAY_NAME}</label>
                    </Div>
                    <Div width="80%" margin="0rem" padding="0" justify="flex-start">
                      <Input elementType="input" width="100%" padding="0rem 1rem" name="userName" value={this.state.userName} changed={ this.userDataChange } />
                    </Div>
                  </Div>
                  <Div width="90%" margin=".1rem auto" padding=".5rem" justify="space-between">
                    <Div width="20%" margin="0rem" padding="0" justify="flex-start">
                      <label>{Constants.AGE_LABEL}</label>
                    </Div>
                    <Div width="23%" margin="0rem" padding="0" justify="flex-start">
                      <Input elementType="select" width="100%" padding="0rem 1rem" name="userAge" elementConfig={{options: ageList}} value={this.state.userAge} changed={ this.userDataChange } />
                    </Div>
                    <Div width="29%" margin="0rem" padding="0 .3rem 0 .5rem" justify="flex-start">
                      <label>{ Constants.AGE_DISPLAY_STATE }</label>
                    </Div>
                    <Div width="27%" margin="0rem" padding="0" justify="flex-start">
                      <Input elementType="select" elementConfig={{options: [{displayValue: "公開", value: 0}, {displayValue: "非公開", value: 1}]}} name="userState" width="100%" padding="0rem 1rem" value={this.state.userState} changed={ this.userDataChange } />
                    </Div>
                  </Div>
                  <Div width="90%" margin=".1rem auto" padding=".5rem" justify="space-between">
                    <Div width="20%" margin="0rem" padding="0" justify="flex-start">
                      <label>{Constants.THEME_COLOR}</label>
                    </Div>
                    <Div width="80%" margin="0rem" padding="0" justify="flex-start">
                      <InputColor
                          initialValue={Constants.rgb2hex(this.state.color)}
                          onChange={this.userThemeColorChange}
                          placement="right"
                          name="color"
                          color={this.state.color}
                      /> 
                    </Div>

                  </Div>
                </PersonalInfoEditSection>
              )
            }

          <div className="uk-flex uk-flex-center uk-margin-top">
            <Btn width="25%" radius="20px" backcolor={theme_color} fontSize=".7rem" padding=".5rem 2rem" margin="1.5rem auto .5rem auto" text={ this.state.updateType === 'photo' ? Constants.UPLOAD_PICTURE : Constants.UPDATE_CONTENT } btnType="rounded" onClick={this.state.updateType === 'photo' ? this.PhotoUpdate : this.PersonalInfoUpdate} />
          </div>
        </Modal>

      </UserProfileContent>
    )
  }

}

const mapStateToProps = (state) => ({
  allState: state
});

const mapDispatchToProps = (dispatch) => ({
  getAccountInfo: bindActionCreators(main.getAccountInfo, dispatch),
  updatePersonalInfo: bindActionCreators(userEdit.updatePersonalInfo, dispatch),
  changeState: bindActionCreators(userEdit.changeState, dispatch ),
  uploadImage: bindActionCreators(userEdit.uploadImage, dispatch)
});


export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);