import React, {Component} from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import registration from '../store/actions/registration';
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import Aux from '../hoc/Au/Auxx';
import * as Constants from '../Constants';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../components/UI/logo';
import RowDiv from '../components/UI/div';
import Text from '../components/UI/text';
import Btn from '../components/UI/btn';
import Img from '../components/UI/img';

const StyledContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #30AA89;
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: auto;
`;

const MainContent = styled.div`
  width: 75%;
  max-width: 700px;
  background-color: #FFF;
  margin: 2rem auto;
  height: 60%;
`;

var loadingState = false;
var loadingMessage = null;

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logining: false,
        uid: "",
        times: ""
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search)
    this.state.uid = params.get("code");
    this.state.times = params.get('time');
  }

  goSignupStep = (index) => {
    if(index === 1)
      this.props.history.push(`/regCreator`);
    else if(index === 0)
      this.props.history.push(`/regFan`);
  }

  CheckUser = () => {
    const  { checkUser } = this.props;
    checkUser(this.state.uid, this.state.times);
  }

  render(){
    const { mainState } = this.props;
    if(typeof mainState.loadingMessage != 'undefined' && mainState.loadingMessage !== null){
      loadingMessage = mainState.loadingMessage
    }
    else if(mainState.isLogedIn === true && mainState.loadingMessage === null){
      loadingState = true;
      loadingMessage = null;
    }
    
    return(
        <Aux>
          <div style={{height: '100vh', overflowY: 'auto'}}>
            <StyledContainer>
              {
                (loadingMessage !== null) ? (
                  <div style={{position: "absolute", top: "50%", left: "50%", transform: 'translate(-50%, -50%)', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                    <div uk-spinner={ `ratio: 2` } style={{ color: '#FFF', fontWeight: "600" }} /><span style={{ color: '#FFF', fontWeight: "600" }}>{mainState.loadingMessage}</span>
                  </div>
                ) : null
              }

              <Logo width='87px' height='120px' src={`${Constants.LOCAL_IMAGE_URL}login_logo.png`} alt='login_logo' margin="20px auto" />
              <MainContent>
                {
                  loadingState ? (
                    <React.Fragment>
                      <RowDiv width="100%" margin="0rem" padding="1rem" justify="center">
                        <Text color="#313131" str={Constants.SIGNUP_TITLE} fontSize="2rem" margin="1rem 1rem" />
                      </RowDiv>
                      <RowDiv width="100%" margin="0rem" padding="1rem" justify="space-around" alignItem="center" >
                        <Img width="40%" src={`${Constants.LOCAL_IMAGE_URL}fan_icon.png`} radius="50%" alt="fan" />
                        <Img width="40%" src={`${Constants.LOCAL_IMAGE_URL}creator_icon.png`} radius="50%" alt="creator" />
                      </RowDiv>
                      <RowDiv width="100%" margin="0 0 5rem 0" padding="1rem" justify="space-around" alignItem="center" >
                        <Btn text={Constants.FAN_SIGNUP} fontSize=".8rem" width="40%" padding=".8rem 0" onClick={this.goSignupStep.bind(this, 0)} />
                        <Btn text={Constants.CREATOR_SIGNUP} fontSize=".8rem" width="40%" backcolor="#EA497B" padding=".8rem 0" onClick={this.goSignupStep.bind(this, 1)} />
                      </RowDiv>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <RowDiv width="100%" margin="20% 0" padding="1rem" justify="center">
                        <Text color="#313131" str={Constants.SIGNUP_TEMP_REGISTRATION} fontSize="2.5rem" margin="1rem 1rem" />
                      </RowDiv>
                      <RowDiv width="100%" margin="0 0 5rem 0" padding="1rem" justify="space-around" alignItem="center" >
                        <Btn text={Constants.LOGIN} fontSize=".8rem" width="40%" backcolor="#EA497B" padding=".8rem 0" onClick={this.CheckUser} />
                      </RowDiv>
                    </React.Fragment>
                  )
                }
              </MainContent>
            </StyledContainer>
          </div>
        </Aux>
    );
  }
}

const mapStateToProps = (state) => ({
  mainState: state.main,
});

const mapDispatchToProps = (dispatch) => ({
  checkUser: bindActionCreators(registration.checkUser, dispatch),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Registration));