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
import Anchor from '../components/UI/a';
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
        times: "",
        termsAgree: false
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search)
    this.state.uid = params.get("code");
    this.state.times = params.get('time');
    // if(params.get('agent') !== null){
    //   const  { checkUser } = this.props;
    //   checkUser(this.state.uid, this.state.times);
    // }
  }

  goSignupStep = (index) => {
    if(this.state.termsAgree){
      if(index === 1)
        this.props.history.push(`/regCreator`);
      else if(index === 0)
        this.props.history.push(`/regFan`);
    }
  }

  CheckUser = () => {
    const  { checkUser } = this.props;
    if(this.state.termsAgree){
      checkUser(this.state.uid, this.state.times);
    }
  }

  setTermsAgree = () => {
    this.setState({
      termsAgree: !this.state.termsAgree
    })
  }

  render(){
    const { mainState } = this.props;
    if(typeof mainState.loadingMessage != 'undefined' && mainState.loadingMessage !== null){
      loadingMessage = mainState.loadingMessage
    }
    else if(mainState.isLogedIn === true && mainState.loadingMessage === null){
      loadingState = true;
      loadingMessage = null;
      const params = new URLSearchParams(this.props.location.search)
      if(params.get('agent') !== null){
        this.props.history.push(`/regCreator/${params.get('agent')}`);
      }
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
                      <RowDiv width="100%" margin="2% 0" padding="1rem" direction="column" justify="center" alignItems="center">
                        <Text color="#313131" str={Constants.SIGNUP_TEMP_REGISTRATION1} fontSize="1.5rem" margin=".2rem 1rem" />
                        <Text color="#313131" str={Constants.SIGNUP_TEMP_REGISTRATION2} fontSize="1.5rem" margin=".2rem 1rem" />
                        <Text color="#313131" str={Constants.SIGNUP_TEMP_REGISTRATION3} fontSize="1.5rem" margin=".2rem 1rem" />
                        <Anchor href="#" decoration="underline" color="#2185D0" margin=".3rem auto" text={Constants.TERMS_PAGE} id="terms" target="_blank" />
                        <label style={{width: "80%", marginLeft: "10%"}} ><input className="uk-checkbox" type="checkbox" name="terms_agree" onChange={this.setTermsAgree } checked={ this.state.termsAgree === true } style={{marginRight: "2%"}} />{Constants.TERMS_AGREE}</label>
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