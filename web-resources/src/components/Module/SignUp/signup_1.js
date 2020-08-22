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
`;


class SignUpPanel_1 extends Component {
  constructor(props){
    super(props);
    this.state = {
      nickname: '',
      errors: ''
    }
  }

  componentDidMount() {
    this.setState({
        step: this.props.step,
    })
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  checkValuesSet = () => {
    try {
      let errors = {};
      let isValid = true;

      if (!this.state.nickname) {
        errors.nickname = "*ニックネームを入力してください。";
        isValid = false;
      }
      // if (!this.state.email || this.state.email.indexOf('@') === -1){
      //   errors.email = "*有効なメールアドレスを入力してください。";
      //   isValid = false;
      // }
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

        <StyledLegend className="uk-legend uk-text-center uk-text-success uk-text-bold">{ Constants.SIGNUP_1_TITLE }</StyledLegend>

        <RowDiv className="uk-margin" justifyContent="center" direction="column" alignItems="center" >
            <RowDiv className="uk-margin" justifyContent="center" direction="column" alignItems="flex-start" width="80%" margin="0" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-nickname">{ Constants.SIGNUP_1_NICKNAME }</label>
                <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-nickname" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="nickname" placeholder="きゃりーぱみゅぱみゅ" value={this.state.nickname} changed={ this.handleInput } />
                    <ErrorMsg>{this.state.errors.nickname}</ErrorMsg>
                </div>
            </RowDiv>
            {/* <RowDiv className="uk-margin" justifyContent="center" direction="column" alignItems="flex-start" width="80%" margin="0" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-email">{Constants.SIGNUP_1_EMAIL}</label>
                <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <Input type="email" elementType="input" className="uk-input uk-width" width="100%" backcolor="#FFF" border="1px solid #A3B5C1" id="form-reg-email" padding="0rem 1rem" name="email" placeholder="Ichiro.suzuki@gmail.com" value={ this.state.email } changed={ this.handleInput } />
                    <ErrorMsg>{this.state.errors.email}</ErrorMsg>
                </div>
            </RowDiv> */}
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
)(SignUpPanel_1);