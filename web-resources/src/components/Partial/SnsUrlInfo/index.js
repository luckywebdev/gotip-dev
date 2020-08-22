import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import main from '../../../store/actions/main';
import userEdit from '../../../store/actions/userEdit';

import * as Constants from '../../../Constants';

import Modal from '../../UI/Modal/Modal';

import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled, { keyframes } from 'styled-components';
import Btn from '../../UI/btn';
import Input from '../../UI/input';
import Div from '../../UI/div';
import Anchor from '../../UI/a';
import Img from '../../UI/img';
import Text from '../../UI/text';

const keyFrameFadeInOut = keyframes`
  0% {
    color: rgba(255,255,255,1);
  }
  100% {
    color: rgba(255,255,255,0.4);
  }
`

const SnsIconContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: relative;
`

const ModalTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.5rem !important;
  font-weight: bolder;
  margin-top: 2%;
`
const LoadingContainer = styled.div`
  user-select: none;
  margin: auto;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1050;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${ keyFrameFadeInOut } 1.4s ease-in-out 0s infinite alternate;
  &>span {
    display: inline-block;
    text-align: center;
  }
`

// let profileImageEdit = '';
// let profileInfoEdit = '';

var loadingMessage = null;
class SnsUrlInfo extends Component {
  constructor(props) {
    super(props);
    let temp = {}
    Constants.SNS_ICON.forEach(item => {
      temp = { ...temp, [item]: ''}
    });
    this.state = {
      editable: false,
      loadingMessage: null,
      sns_info: temp,
      countNum: 1
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if( typeof prevProps.mainState.user !== "undefined" && typeof this.props.mainState.user.sns_info !== 'undefined' && this.state.countNum === 1) {
      let tempState = {}
      this.props.mainState.user.sns_info.forEach(item => {
        tempState = { ...tempState, [item.name]: item.url }
      })
      this.setState({
        sns_info: tempState,
        countNum: 2
      })
    }
    if(prevProps.mainState.loadingMessage !== this.props.mainState.loadingMessage && loadingMessage) {
      loadingMessage = null;
      this.SNSEditModalHandler();
    }
  }

  SNSEditModalHandler = () => {
      this.setState({
          editable: !this.state.editable
      })
  }

  ReleaseUrlHandler = (index, name) => {
    document.querySelector(`#sns_${index}`).value = "";
    this.setState({
      sns_info: {...this.state.sns_info, [name]: ''}
    })
  }

  SNSInfoSaveHandler = () => {
    let sns_info = [];
    Constants.SNS_ICON.forEach((item, index) => {
        let sns_value = document.querySelector(`#sns_${index}`).value;
        if(sns_value !== ''){
            let sns_info_val = {
                name: item,
                url: sns_value
            }
            sns_info = [...sns_info, sns_info_val];
        }
    });
    if(sns_info.length === 0){
      sns_info = [{
        name: "",
        url: ""
      }]
    }
    const { updatePersonalInfo } = this.props;
    updatePersonalInfo({sns_info: sns_info});
    loadingMessage = true;
  }

  UrlInputHandler = (e) => {
    this.setState({
      sns_info: {...this.state.sns_info, [e.target.name] : e.target.value}
    })
  }

  render() {
    const { mainState } = this.props;
    let sns_info = [];
    if(typeof mainState.user !== 'undefined' && typeof mainState.user.sns_info !== 'undefined'){
        sns_info = [...sns_info, ...mainState.user.sns_info];
    }
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";

    return(
        <SnsIconContent>
            {
                sns_info.length > 0 ? (
                    sns_info.map((item, index) => {
                        return(
                            <Anchor href={item.url} key={index} margin="0 .5rem" target="blank_">
                                <Img src={`${Constants.LOCAL_IMAGE_URL}sns_icon/${item.name}.png`} alt={item.name} width="30px" height="30px" />
                            </Anchor>
                        )
                    })
                ) : ''
            }
            {
              this.props.editable ? (
                <Anchor color={theme_color} clicked={this.SNSEditModalHandler} margin="0 .5rem" text={ Constants.ADD } />
              ) : ""
            }
            <Modal width="50%" show={this.state.editable} modalClosed={this.SNSEditModalHandler}>
                {
                  mainState.loadingMessage !== null ? (
                    <LoadingContainer>
                      <span>
                        <div uk-spinner={ `ratio: 2 };` } />
                        <br />
                        <br />
                        { mainState.loadingMessage }
                      </span>
                    </LoadingContainer>
                  ) : ''
                }
                <ModalTitle>{Constants.SNS_URL_INFO_TITLE}</ModalTitle>
                <Text str={ Constants.SNS_URL_INFO_INSTRUCTION } color="#333"  />
                {
                    Constants.SNS_ICON.map((item, index) => {
                      return (
                        <Div justify="space-around" alignItems="center" direction="row" width="80%" margin=".3rem auto" padding="0" key={index} >
                          <Img src={`${Constants.LOCAL_IMAGE_URL}sns_icon/${item}.png`} width="40px" height="40px" margin="0 1rem" />
                          <Input elementType="input" type="text" border="1px solid #A3B5C1" backcolor="transparent" value={this.state.sns_info[item] || ''} name={item} id={`sns_${index}`} color="#333" width="100%" height="50px" padding="0 .5rem" changed={this.UrlInputHandler} />
                          <Btn backcolor="transparent" border="none" color="red" onClick={this.ReleaseUrlHandler.bind(this, index, item)} text={Constants.RELEASE} margint="0" />
                        </Div>
                      )
                    })
                }
                <div className="uk-flex uk-flex-center uk-margin-top">
                    <Btn width="25%" radius="20px" backcolor="transparent" color={theme_color} border={`1px solid ${theme_color}`} padding=".5rem 2rem" margin="1.5rem 1rem .5rem 1rem" text={Constants.CANCEL} btnType="rounded" onClick={this.SNSEditModalHandler} />
                    <Btn width="25%" radius="20px" backcolor={theme_color} padding=".5rem 2rem" margin="1.5rem 1rem .5rem 1rem" text={Constants.UPDATE_CONTENT} btnType="rounded" onClick={this.SNSInfoSaveHandler} />
                </div>
            </Modal>

        </SnsIconContent>
    )
  }

}

const mapStateToProps = (state) => ({
  mainState: state.main
});

const mapDispatchToProps = (dispatch) => ({
  updatePersonalInfo: bindActionCreators(userEdit.updatePersonalInfo, dispatch),
  changeState: bindActionCreators(userEdit.changeState, dispatch ),
});

export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(SnsUrlInfo);