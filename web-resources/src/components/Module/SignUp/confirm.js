import React, {Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Constants from "../../../Constants";

import styled from 'styled-components';
import media from 'styled-media-query';
import registration from '../../../store/actions/registration';
import Text from '../../UI/text';

const RoundedButton = styled.button`
  border-radius: 40px;
  background-color: #30AA89;
  color: #FFF;
  border: none;
  height: 60px;
  font-size: 1.2rem;
  margin-top: 2rem;
  &:hover {
    background-color: #30AA89;
    opacity: .7;
  } 
  ${media.lessThan("large")`
    height: 50px;
  `}
`;

const RowDiv = styled.div`
  width: 70%;
  max-width: 500px;
  ${media.lessThan("large")`
    width: 90% !important;
    margin-top: 5px !important;
    margin-bottom: 5px !important;
  `}

`

class ConfirmMessage extends Component {
    constructor(props){
        super(props);
        this.state = {
            errorMessage: '',
        }
    }

    render() {
        return (
            <React.Fragment>
                <RowDiv className="uk-margin uk-align-center">
                    {
                        (typeof this.props.allState.registration.errMessage !== 'undefined' && !this.props.allState.registration.result) ? (
                            <Text fontSize='1.2rem' str={this.props.allState.registration.errMessage}></Text>
                        ) : (
                            <Text fontSize='1.2rem' fontWeight="bolder" str={Constants.SIGNUP_SUCCESS_TEXT}></Text>
                        )
                    }
                </RowDiv> 
                <RowDiv className="uk-margin uk-align-center">
                    {
                        (typeof this.props.allState.registration.errMessage !== 'undefined' && !this.props.allState.registration.result) ? (
                            <RoundedButton type="button" className="uk-button uk-button-success uk-width-1-1 uk-margin-small-bottom" > { Constants.SIGNUP_RETRY } </RoundedButton>
                        ) : ""
                    }
                </RowDiv>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
  allState: state
});

const mapDispatchToProps = (dispatch) => ({
  trySignUp: bindActionCreators(registration.trySignUp, dispatch),
});


export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmMessage);