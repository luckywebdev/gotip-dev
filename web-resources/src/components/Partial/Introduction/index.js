import React, { Component } from 'react';
import { connect } from "react-redux";

import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import RowDiv from '../../UI/div';
import Image from '../../UI/img';
import Btn from '../../UI/btn';
import Text from '../../UI/text';
import Anchor from '../../UI/a';

import Modal from '../../UI/Modal/Modal';
import * as Constants from '../../../Constants';
import LoginPanel from '../../Module/Login/LoginPanel';
import ResetPassword from '../../Module/Login/ResetPassword';

import styled from 'styled-components';
import media from 'styled-media-query';

const MainContainer = styled.div`
    width: 100%;
    height: 100vh;
    background: url('/static/img/home_back.png') no-repeat;
    -webkit-background-size:  100% 100%;
    -moz-background-size:  100% 100%;
    -o-background-size:  100% 100%;
    background-size: 100% 100%;
    background-attachment: fixed;
    ${media.lessThan("medium")`
        height: 80vh;
        -webkit-background-size:  100% 80%;
        -moz-background-size:  100% 80%;
        -o-background-size:  100% 80%;
        background-size: 100% 80%;
   `}
   ${media.lessThan("small")`
        height: 50vh;
        -webkit-background-size:  100% 50%;
        -moz-background-size:  100% 50%;
        -o-background-size:  100% 50%;
        background-size: 100% 50%;
   `}
`;
const MenuContent = styled.div`
  position: absolute;
  top: 90px;
  right: 100px;
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
    }
  ]
  

class Introduction extends Component {
    constructor(props){
        super(props);
        this.state = {
            loginModal: false,
            resetPasswordModal: false,
            menuShowHandler: false,
        }
    }

    componentDidMount() {
        if(typeof this.props.match.params.login !== 'undefined') {
            this.setState({
                loginModal: true
            })
        }
    }

    componentDidUpdate() {
        const { loginState, mainState } = this.props;
        if(loginState.isLoading){
            localStorage.setItem('isLoggedin', true);
            localStorage.setItem('uid', loginState.user.uid);
            console.log("login_main", loginState);
            if(loginState.user && loginState.user.auth_level < 3){
                this.props.history.push('/main');
            }
            else if(loginState.user && loginState.user.auth_level === 3){
                this.props.history.push('/admin/top/news');
            }
            else if(loginState.user && loginState.user.auth_level === 4){
                this.props.history.push('/admin/top/news');
            }
        }
    }

    LoginModalHandler = () => {
        this.setState({
            loginModal: true
        });
    }

    handleResetPassword = () => {
        this.setState({
            loginModal: false,
            resetPasswordModal: true
        });
    }

    loginModalCancelHandler = () => {
        this.setState({
            loginModal: false
        });
    }

    resetPasswordModalCancelHandler = () => {
        this.setState({
            resetPasswordModal: false
        });
    }

    DropDownMenuHandler = () => {
        this.setState({
          menuShowHandler: !this.state.menuShowHandler
        });
      }
    
    

    navigateSignup = () => {
        this.props.history.push('./signup');
    }
    

    render() {
        const { loginState } = this.props;

        if(typeof loginState.resetRequest !== 'undefined' && loginState.resetRequest && this.state.resetPasswordModal){
            this.resetPasswordModalCancelHandler();
        }

        return (
            <MainContainer>
                <RowDiv direction="row" alignItems="center" justify="space-between" height="15%">
                    <RowDiv width="20%" widthS="30%" justify="flex-end" direction="row" height="100%" paddingL="0rem" >
                        <Image src="static/img/logo_horizontal.png" height="auto" />
                    </RowDiv>
                    <RowDiv width="70%" widthS="60%" justify="flex-end" direction="row" height="100%">
                        <Btn text={Constants.MEMBER_REGISTER} border="1px solid #FFF" padding="0.5rem" backcolor="transparent" width="15%" fontWeight="bold" fontSizeL=".8rem" fontSizeM=".6rem" fontSizeS=".5rem" marginL="0 1rem 0 0" widthL="20%" widthS="30%" onClick={ this.navigateSignup } />
                        <Btn text={Constants.LOGIN} backcolor="#FFF" width="15%" padding="0.5rem" color="#30AA89" widthL="20%" widthS="30%" fontWeight="bold" fontSizeL=".8rem" fontSizeM=".6rem" fontSizeS=".5rem" marginL="0" onClick={ this.LoginModalHandler } />
                    </RowDiv>
                    <RowDiv width="10%" justify="flex-end" direction="row" height="100%" paddingS="0.2rem">
                        <button type="button" uk-toggle="target: #offcanvas-slide" style={buttonStyle}><span uk-icon="menu"></span></button>
                    </RowDiv>
                </RowDiv>
                <RowDiv direction="column" justify="flex-start" alignItems="flex-start" width="100%" height="30%" padding="0 1rem">
                    <RowDiv direction="column" justify="flex-start" alignItems="center" width="40%" margin="0 0 0 10%" height="100%">
                        <Image src="static/img/go_tip_top_text2.png" margin="1rem 1rem" height="auto" />
                        <Image src="static/img/go_tip_top_text3.png" height="30%" marginL="0 0 1rem 0rem"/>
                    </RowDiv>
                </RowDiv>
                <RowDiv direction="column" justify="flex-start" alignItems="flex-start" width="100%" height="30%" padding="0 1rem">
                    <RowDiv direction="row" justify="flex-start" width="40%" margin="0 0 0 10%" paddingL="0.8rem 1rem">
                        <Text str={Constants.LAND_INTRODUCTION_TITLE} color="#FFF" fontSize="2rem" fontSizeL="1.5rem" fontSizeM="1rem" fontSizeS=".8rem"  />
                    </RowDiv>
                    <RowDiv direction="row" justify="center" width="40%" margin="0 0 0 10%" paddingL="0 1rem">
                        <Text str={Constants.LAND_INTRODUCTION} color="#FFF" fontSize="1.5rem" fontSizeL="1rem" fontSizeM=".8rem" fontSizeS=".5rem" />
                    </RowDiv>
                </RowDiv>
                <RowDiv direction="row" justify="flex-start" height="22%">
                    <RowDiv width="50%" justify="flex-start" direction="row" margin="0 0 0 10%" height="100%" >
                        <Image src="static/img/Download-on-the-App-Store-button.png" width="35%" height="5.5vw" margin="1rem 1rem" />
                        <Image src="static/img/getingoogleplay_new.png" width="35%" height="5.5vw" margin="1rem 0rem" />
                    </RowDiv>
                </RowDiv>
                <Modal show={this.state.loginModal} width="35%" modalClosed={this.loginModalCancelHandler}>
                    <LoginPanel {...this.props} clicked={this.handleResetPassword} />
                </Modal>
                <Modal show={this.state.resetPasswordModal} width="35%" modalClosed={this.resetPasswordModalCancelHandler}>
                    <ResetPassword {...this.props} />
                </Modal>
            </MainContainer>
        );
    }
}

const mapStateToProps = (state) => ({
    loginState: state.login,
    mainState: state.main,
    allState: state
});
  
export default connect(mapStateToProps)(Introduction);