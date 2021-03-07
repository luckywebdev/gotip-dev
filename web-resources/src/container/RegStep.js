import React, {Component} from 'react';
import { connect } from "react-redux";
import registration from '../store/actions/registration';

import * as Constants from '../Constants';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import StepConnector from '@material-ui/core/StepConnector';
import clsx from 'clsx';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';

import Aux from '../hoc/Au/Auxx';
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import Layout from '../hoc/Layout/Layout';
import Text from '../components/UI/text';
import Signup_1 from '../components/Module/SignUp/signup_1';
import Signup_2 from '../components/Module/SignUp/signup_2';
import Signup_3 from '../components/Module/SignUp/signup_3';
import Signup_4 from '../components/Module/SignUp/signup_4';
import Signup_5 from '../components/Module/SignUp/signup_5';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

const StyledContainer = styled.div`
  max-width: 60%;
  width: 70%;
  min-height: 74vh;
  background-color: #30AA89;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  overflow: auto;
`;

const StepperContent = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: #FFF;
    /* align-items: center; */
`;

const getSteps = () => {
  return ['ニックネーム登録', 'クリエイター登録情報', '本人確認書類', '銀行口座登録', '登録完了'];
}

const ColorlibConnector = withStyles({
    alternativeLabel: {
      top: 9,
    },
    active: {
      backgroundColor: '#30AA89 !important',
      '& $line': {
        backgroundColor: '#30AA89',
      },
    },
    completed: {
      backgroundColor: '#30AA89',
      '& $line': {
        backgroundColor: '#30AA89',
      },
    },
    line: {
      height: 3,
      border: 0,
      backgroundColor: '#eaeaf0',
      borderRadius: 1,
    },
  })(StepConnector);
  
  const useColorlibStepIconStyles = makeStyles({
    root: {
      backgroundColor: '#eaeaf0',
      zIndex: 1,
      color: '#fff',
      width: 20,
      height: 20,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    active: {
      backgroundColor: '#30AA89',
    },
    completed: {
      backgroundColor: '#FFF',
      color: '#30AA89'
    },
  });
  
  function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;
  
  
    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
      {completed ? <CheckCircleRoundedIcon className={classes.completed} /> : <div className={classes.circle} />}
      </div>
    );
  }
  
  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };
  
  
  

class SignupStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authType: 1,
        };
    }

    componentDidMount() {
      if(typeof this.props.match.params.authType !== 'undefined') {
        this.setState({
            authType: this.props.match.params.authType
        })
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if(prevProps.regState.all_register !== this.props.regState.all_register && this.props.regState.all_register){
        this.props.history.push('/useredit');
      }
    }

    signupComponents = () => {
        const { regState } = this.props;
        switch(regState.step){
            case "0":
                return (
                    <Signup_1 step="1" />
                );
            case "1":
                return (
                    <Signup_2 step="2" { ...this.props } />
                );
            case "2":
                return (
                    <Signup_3 step="3" />
                );
            case "3":
                return (
                    <Signup_4 step="4" />
                );
            case "4":
                return (
                    <Signup_5 step="5" />
                );
        }
    }

    render(){
        const steps = getSteps();
        const { regState, mainState } = this.props;
   
        return(
            <Aux>
              {
                (typeof mainState.loadingMessage != 'undefined' && mainState.loadingMessage !== null) ? (
                  <div style={{position: "absolute", top: "50%", left: "50%", transform: 'translate(-50%, -50%)', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                    <div uk-spinner={ `ratio: 2` } style={{ color: '#FFF', fontWeight: "600" }} /><span style={{ color: '#FFF', fontWeight: "600" }}>{mainState.loadingMessage}</span>
                  </div>
                ) : null
              }
              <Layout {...this.props} headerHide={true} >
                  <StyledContainer>
                      <StepperContent>
                          <Text color="#313131" str={Constants.SIGNUP_STEP_TITLE} textAlign="center" fontSize="2rem" margin="1rem 1rem" />
                          <Stepper activeStep={Number(regState.step)} alternativeLabel connector={<ColorlibConnector />}>
                          {steps.map((label) => (
                              <Step key={label}>
                                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                              </Step>
                              ))}
                          </Stepper>
                      </StepperContent>
                      {
                          this.signupComponents()
                      }
                  </StyledContainer>
              </Layout>
            </Aux>
        );
    }
}

const mapStateToProps = (state) => ({
    regState: state.registration,
    mainState: state.main
});
  

export default connect(mapStateToProps)(withRouter(SignupStep));