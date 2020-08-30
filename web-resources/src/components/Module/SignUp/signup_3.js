import React, {Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons';
UIkit.use(UIkitIcons)

import styled from 'styled-components';
import registration from '../../../store/actions/registration';
import * as Constants from '../../../Constants';
import RowDiv from '../../UI/div';
import Btn from '../../UI/btn';
import Sheet from '../../Sheet';
import Text from '../../UI/text';
import Input from '../../UI/input';

const SignupForm = styled.div`
    width: 90%;
    height: auto;
    padding: 10px 0px;
    margin: 20px auto;
    background-color: #FFF;
`;

const StyledLegend = styled.h3`
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  color: #30AA89 !important;
  text-align: center;
`
const LastRowDiv = styled(RowDiv)`
  margin-top: 60px !important;
`

const RightMarginLabel = styled.label`
  margin-right: 1em;
`

const ErrorMsg = styled.div`
  color: red;
`


class SignUpPanel_3 extends Component {
  constructor(props){
    super(props);
    this.state = {
      uploadFile: '',
      fileContent: '',
      delegate: { name: '', ID_photo: "" },
      errors: ''
    }
  }

  componentDidMount() {
    this.setState({
        step: this.props.step
    })
  }

  handleInput = (e) => {
    const delegate = { ...this.state.delegate, name: e.target.value };
    this.setState({
      ...this.state, delegate
    }, function(){
      console.log("delegate", this.state.delegate);
    });
  }

  onClickFileUpload = () => {
    document.getElementById("uploadFileTag").click();
  }

  onChangeHandler = (e) => {
    this.setState({
        uploadFile: e.target.files[0].name,
        fileContent: e.target.files[0]
    })
  }

  deleteUploadFile = () => {
    this.setState({
        uploadFile: '',
        fileContent: ''
    })
  }
  
  checkValuesSet = () => {
    try {
      let errors = {};
      let isValid = true;
      if (!this.state.uploadFile) {
        errors.uploadFile = "*あなたの身分確認書類ファイルを選択してください。";
        isValid = false;
      }
      if (!this.state.delegate.name) {
        errors.name = "*あなたの身元確認書類の種類を選択してください。";
        isValid = false;
      }
      this.setState({
        errors: errors
      })
      return isValid;
    } catch (err) {
      console.log('Registration values check error.', err)
      return false;
    }
  }
  
  handleNext = () => {
    const checkValidate = this.checkValuesSet();
    if(checkValidate) {
        const { handleRegData } = this.props;
        handleRegData(this.state);
    }
  }

  render() {
    const registrationForm = (
      <form>

        <StyledLegend className="uk-legend uk-text-center uk-text-success uk-text-bold">{ Constants.SIGNUP_3_TITLE }</StyledLegend>

        <RowDiv className="uk-margin" justifyContent="center" direction="column" alignItems="center" >
            <RowDiv className="uk-margin" justifyContent="center" direction="column" alignItems="flex-start" width="100%" >
                <Text color="#313131" str={Constants.SIGNUP_3_UPLOAD_INSTRUCTION} textAlign="left" fontSize="1.2rem" margin="1rem 0" />
            </RowDiv>
            <RowDiv className="uk-margin" justifyContent="center" direction="column" alignItems="flex-start" width="100%" backcolor="#F5F8FA" padding=".5rem" >
                <RightMarginLabel><input className="uk-radio" type="radio" name="delegate" value="運転免許証" onChange={ this.handleInput } checked={ this.state.delegate.name === '運転免許証' } />{Constants.SIGNUP_3_DRIVER_LICENSE}</RightMarginLabel>
                <RightMarginLabel><input className="uk-radio" type="radio" name="delegate" value="パスポート" onChange={ this.handleInput } checked={ this.state.delegate.name === 'パスポート' } />{Constants.SIGNUP_3_PASSPORT}</RightMarginLabel>
                <RightMarginLabel><input className="uk-radio" type="radio" name="delegate" value="住基カード" onChange={ this.handleInput } checked={ this.state.delegate.name === '住基カード' } />{Constants.SIGNUP_3_JUKI_CARD}</RightMarginLabel>
                <RightMarginLabel><input className="uk-radio" type="radio" name="delegate" value="マイナンバーカード" onChange={ this.handleInput } checked={ this.state.delegate.name === 'マイナンバーカード' } />{Constants.SIGNUP_3_MY_NUMBER_CARD}</RightMarginLabel>
                <RightMarginLabel><input className="uk-radio" type="radio" name="delegate" value="障害者手帳" onChange={ this.handleInput } checked={ this.state.delegate.name === '障害者手帳' } />{Constants.SIGNUP_3_DISABILITY}</RightMarginLabel>
                <RightMarginLabel><input className="uk-radio" type="radio" name="delegate" value="在留カード" onChange={ this.handleInput } checked={ this.state.delegate.name === '在留カード' } />{Constants.SIGNUP_3_RESIDENCE}</RightMarginLabel>
                <RightMarginLabel><input className="uk-radio" type="radio" name="delegate" value="健康保険証" onChange={ this.handleInput } checked={ this.state.delegate.name === '健康保険証' } />{Constants.SIGNUP_3_HEALTH_CARD}</RightMarginLabel>
            </RowDiv>
            <ErrorMsg>{this.state.errors.name}</ErrorMsg>
        </RowDiv>
        <RowDiv className="uk-margin" justify="space-between" direction="row" alignItems="center" width="100%" >
            <RowDiv justify="flex-start" direction="row" alignItems="center" width="70%" margin="0" padding="0" >
                <Btn text={ Constants.UPLOAD_FILE } color='#FFF' fontWeight="400" fontSize="1rem" padding=".5rem .5rem" onClick={this.onClickFileUpload} className='uk-width-1-1' />
                <Text color="#313131" str={this.state.uploadFile} textAlign="left" fontSize=".8rem" margin=".5rem 0" />
                <input type="file" name="file" id="uploadFileTag" style={{display: "none"}} onChange={this.onChangeHandler}/>
            </RowDiv>
            <ErrorMsg>{this.state.errors.uploadFile}</ErrorMsg>

            <RowDiv justify="flex-end" direction="row" alignItems="center" width="30%" margin="0" padding="0" >
                <Btn color="#EA5555" text={Constants.DELETE} fontWeight="bold" fontSize="1rem" margin=".5rem" backcolor="transparent" border="none" onClick={this.deleteUploadFile} />
            </RowDiv>

        </RowDiv>

        <LastRowDiv className="uk-margin uk-align-center uk-text-center">
            <Btn text={ Constants.NEXT } color='#FFF' width="calc(80% - 2rem)" padding=".7rem 0" className='uk-width-1-1'　onClick={this.handleNext} />
        </LastRowDiv>

    </form>
    );

    return (
      <SignupForm className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
        <Sheet content={ registrationForm } />
      </SignupForm>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  handleRegData: bindActionCreators(registration.handleRegData, dispatch),
});


export default  connect(
  null,
  mapDispatchToProps
)(SignUpPanel_3);