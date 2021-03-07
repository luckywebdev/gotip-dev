import React, {Component} from 'react';

import Aux from '../hoc/Au/Auxx';
import * as Constants from '../Constants';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../components/UI/logo';
import SignUp from '../components/Module/SignUp';

const StyledContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #30AA89;
  display: flex;
  justify-content: flex-start;
  padding-top: 1rem;
  flex-direction: column;
  overflow: auto;
  box-sizing: border-box;
`;

const MainContent = styled.div`
  width: 80%;
  max-width: 700px;
  background-color: #FFF;
  margin: 2rem auto;
  height: 60%;
`;

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agentID: null
    }
  }

  componentDidMount() {
    const params = this.props.match.params;
    if(Object.keys(params).length > 0 && params.constructor === Object){
      console.log("params-agentID", params);
      this.setState({
        agentID: params.agentID
      })
    }
  }

  render(){
    return(
        <Aux>
          <div style={{height: '100vh', overflowY: 'auto'}}>
            <StyledContainer>
              <Logo width='87px' height='120px' src={`${Constants.LOCAL_IMAGE_URL}login_logo.png`} alt='login_logo' margin="1rem auto .5rem auto" />
              <MainContent>
                <SignUp {...this.props} agentID={this.state.agentID} />
              </MainContent>
            </StyledContainer>
          </div>
        </Aux>
    );
  }
}

export default withRouter(Signup);