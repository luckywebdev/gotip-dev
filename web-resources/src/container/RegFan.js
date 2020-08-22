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
import Input from '../components/UI/input';

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
  width: 80%;
  max-width: 700px;
  background-color: #FFF;
  margin: 2rem auto;
  height: 60%;
`;

const MainContentComplete = styled.div`
  width: 80%;
  background-color: transparent;
  margin: 2rem auto;
  height: 60%;
`;

const ErrorMsg = styled.div`
  color: red;
`;

const LastRowDiv = styled(RowDiv)`
  margin-top: 60px !important;
`

class RegFan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            email: '',
            regType: 'fan',
            auth_level: 1,
            errors: '',
            formContent: true
        }
    }

    componentDidMount() {
        if(localStorage.getItem('email') !== null){
            this.setState({
                email: localStorage.getItem('email')
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.regState.all_register !== this.props.regState.all_register && this.props.regState.all_register){
            this.setState({
                formContent: false
            })         
        }
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
            if (!this.state.email || this.state.email.indexOf('@') === -1){
                errors.email = "*有効なメールアドレスを入力してください。";
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

    handleRegistration = () => {
        const checkValidate = this.checkValuesSet();
        if(checkValidate) {
            const { executeRegister } = this.props;
            executeRegister(this.state);
        }
    }

    handleNavigate = (index) => {
        this.props.history.push(index);
    }

    regForm = () => {
        if(this.state.formContent){
            return (
                <MainContent>
                    <RowDiv width="100%" margin="0rem" padding="1rem" justify="center">
                        <Text color="#313131" str={Constants.SIGNUP_TITLE} fontSize="2rem" margin="1rem 1rem" />
                    </RowDiv>
                    <RowDiv className="uk-margin" justifyContent="center" direction="column" margin="0 0 1rem 0" alignItems="center" >
                        <RowDiv className="uk-margin" justifyContent="center" direction="column" alignItems="flex-start" width="80%" margin="0" padding="0 1rem" >
                            <label className="uk-form-label" htmlFor="form-reg-nickname">{ Constants.SIGNUP_1_NICKNAME }</label>
                            <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                                <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-nickname" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="nickname" placeholder="きゃりーぱみゅぱみゅ" value={this.state.nickname} changed={ this.handleInput } />
                                <ErrorMsg>{this.state.errors.nickname}</ErrorMsg>
                            </div>
                        </RowDiv>
                    </RowDiv>
                    <LastRowDiv className="uk-margin uk-align-center uk-text-center">
                        <Btn text={ Constants.REGISTRATION } color='#FFF' width="calc(80% - 2rem)" padding=".7rem 0" className='uk-width-1-1'　onClick={this.handleRegistration} />
                    </LastRowDiv>
                </MainContent>
            )
        }
        else{
            return (
                <MainContentComplete>
                    <RowDiv width="100%" margin="0rem" padding="1rem" justify="center" direction="column">
                        <Text color="#313131" str={Constants.SIGNUP_FAN_COMPLETE} fontSize="2rem" fontWeight="bold" margin="1rem 1rem" />
                        <Text color="#313131" str={Constants.SIGNUP_FAN_COMPLETE_ADVICE} fontSize="2rem" fontWeight="bold" margin="1rem 1rem" />
                    </RowDiv>
                    <RowDiv className="uk-margin" width="100%" justifyContent="between-around" direction="row" alignItems="center" >
                        <Btn text={ Constants.SEARCH_CREATOR } backcolor="#FFF" border="1px solid #30AA89" color='#30AA89' fontSize="1.2rem" radius="5px" width="30%" padding="1rem 0" className='uk-width-1-1'　onClick={this.handleNavigate.bind(this, './search')} />
                        <Btn text={ Constants.GO_HOME } color='#30AA89' backcolor="#FFF" border="1px solid #30AA89" fontSize="1.2rem" radius="5px" width="30%" padding="1rem 0" className='uk-width-1-1'　onClick={this.handleNavigate.bind(this, "./home")} />
                        <Btn text={ Constants.GO_MYPAGE } color='#30AA89' backcolor="#FFF" border="1px solid #30AA89" fontSize="1.2rem" radius="5px" width="30%" padding="1rem 0" className='uk-width-1-1'　onClick={this.handleNavigate.bind(this, "./main")} />
                    </RowDiv>
                </MainContentComplete>
    
            )
        }
    }

    render(){
        const { regState, mainState } = this.props;

        return(
            <Aux>
                <div style={{height: '100vh', overflowY: 'auto'}}>
                    <StyledContainer>
                    {
                        (typeof mainState.loadingMessage != 'undefined' && mainState.loadingMessage !== null) ? (
                        <div style={{position: "absolute", top: "50%", left: "50%", transform: 'translate(-50%, -50%)', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                            <div uk-spinner={ `ratio: 2` } style={{ color: '#FFF', fontWeight: "600" }} /><span style={{ color: '#FFF', fontWeight: "600" }}>{mainState.loadingMessage}</span>
                        </div>
                        ) : null
                    }

                    <Logo width='87px' height='120px' src={`${Constants.LOCAL_IMAGE_URL}login_logo.png`} alt='login_logo' margin="20px auto" />
                    { this.regForm() }
                    </StyledContainer>
                </div>
            </Aux>
        );
    }
}

const mapStateToProps = (state) => ({
    mainState: state.main,
    regState: state.registration,
});

const mapDispatchToProps = (dispatch) => ({
    executeRegister: bindActionCreators(registration.executeRegister, dispatch),
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(RegFan));