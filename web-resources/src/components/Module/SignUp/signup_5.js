import React, {Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';

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

const ErrorMessage = styled.div`
  color: red;
`


class SignUpPanel_5 extends Component {
  constructor(props){
    super(props);
    this.state = {
      step: '',
    }
  }

  componentDidMount() {
    this.setState({
        step: this.props.step
    })
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  checkValuesSet = () => {
    try {
      if (!this.state.step) return true
    } catch (err) {
      console.log('Registration values check error.', err)
    }
    return false
  }
  
  handleNext = () => {
    const checkValidate = this.checkValuesSet();
    if(!checkValidate) {
        const { handleRegData, regState } = this.props;
        regState.step = this.state.step;
        regState.auth_level = 2;
        regState.userState = '0';
        regState.regType = 'creator';
        handleRegData(regState);
    }
    else{
        alert("Invalidate input!");
    }
  }

  render() {
    const registrationForm = (
      <form>

        <StyledLegend className="uk-legend uk-text-center uk-text-success uk-text-bold">{ Constants.SIGNUP_5_TITLE }</StyledLegend>
        <RowDiv className="uk-margin" justify="center" direction="column" alignItems="center" >
            <RowDiv className="uk-margin" justify="center" direction="row" alignItems="center" width="100%" padding="0 1rem" >
              <CheckCircleRoundedIcon style={{fontSize: "large", color: "#30AA89", backgroundColor: "#FFF"}} />
            </RowDiv>
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="center" width="80%" padding="0 1rem" >
              <Text color="#313131" str={Constants.SIGNUP_5_SIGNUP_FINISH} textAlign="center" fontSize="1.2rem" margin="1rem 0" />
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

const mapStateToProps = (state) => ({
  regState: state.registration,
  mainState: state.main
});


const mapDispatchToProps = (dispatch) => ({
  handleRegData: bindActionCreators(registration.handleRegData, dispatch),
});


export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPanel_5);