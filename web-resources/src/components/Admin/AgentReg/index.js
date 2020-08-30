import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import media from 'styled-media-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faShareSquare } from '@fortawesome/free-solid-svg-icons'
import {
  FacebookShareButton,
  TwitterShareButton,
  LineShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LineIcon,
  EmailIcon
} from "react-share";
import QRCode from 'qrcode.react';

import Btn from '../../UI/btn';
import Img from '../../UI/img';
import Text from '../../UI/text';
import Div from '../../UI/div';
import Anchor from '../../UI/a';
import  Modal from '../../UI/Modal/Modal';
import AgentEmailContent from './agentInviteMailContent';

const MainContent = styled.nav`
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-right: 1%;
    margin-left: 1%;
`

const BlockContent = styled.div`
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
`;

const Input = styled.input`
  border: 1px solid #A3B5C1;
  background-color: #FFF;
  box-shadow: none;
  outline: none;
  height: 50px;

  &:focus {
    border: 1px solid #707070;
  }
  ${media.lessThan("large")`
    height: 40px;
  `}
`;


const StyledSelect = styled.select`
  width: 50%;
  margin: 0;
  padding: .5rem .5rem;
  border: 1px solid #A3B5C1;
  border-radius: 5px;
  margin-right: .5rem;
  margin-left: .5rem;
  height: 50px;
  &:first-child{
    margin-left: 0;
  }
  &:focus {
    border: 1px solid #93B5C1;
  }

`
const ErrorMsg = styled.div`
  color: red;
`;

const GenerateRegLevel = (props) => {
    const regLevels = ["1次", "2次", "3次"];
    let regLevel = [];
    regLevel = regLevels.map((item, index) => {
      if(props.agentLevel <= index){
        return (<option key={ index } value={ index }>{ item }</option>)
      }
    })

    let divStyle = {
        width: '80%',
        marginTop: '.3rem',
        marginBottom: '.5rem',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: '20px',
    }

    return (
        <React.Fragment>
            <div className="uk-form-control" style={divStyle} >
                <StyledSelect className="uk-select" name="regLevel" value={ props.regLevel } onChange={props.changed}>
                    { regLevel }
                </StyledSelect>
            </div>
        </React.Fragment>
    )
}


export default (props) => {
    const [regLevel, setRegLevel] = useState(0);
    const [agentID, setAgentID] = useState(100000);
    const [agentLevel, setAgentLevel] = useState(0);
    const [emailContentShow, setEmailContentShow] = useState(false);
    const [linkUrl, setLinkUrl] = useState(`${Constants.BASE_URL}admin/agent/registration/1000001`);
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
    const shareUrl = () => {
      console.log("facebook share!");
    }

    useEffect(() => {
      const regLevelR = Number(regLevel) + 1;
      console.log("regLevel", regLevelR);
      const generateID = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
      setLinkUrl(`${Constants.BASE_URL}admin/agent/registration/${agentID}${generateID}${regLevelR}`)
    }, [regLevel])

    useEffect(() => {
      if(typeof mainState.user !== 'undefined' && mainState.user.auth_level === 3){
        setAgentLevel(mainState.user.agentLevel);
        setRegLevel(Number(mainState.user.agentLevel));
        setAgentID(mainState.user.agent_id);
        const regLevelR = Number(mainState.user.agentLevel) + 1;
        const generateID = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
        setLinkUrl(`${Constants.BASE_URL}admin/agent/registration/${mainState.user.agent_id}${generateID}${regLevelR}`)
      }
    }, [mainState.user])

    const emailContentShowHandler = () => {
      setEmailContentShow(!emailContentShow);
    }

    const randomString = (length, chars) => {
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
      return result;
  }

    return (
    <MainContent>
        <BlockContent>
            <Div width="80%" padding="1% 0 0 0" margin="0" backcolor="transparent" justify="center" >
                <GenerateRegLevel regLevel={regLevel} agentLevel={agentLevel} changed={(e) => setRegLevel(e.target.value)}/>
                {/* <Btn width="20%" radius="3px" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding=".5rem 2rem" margin="0 1.5rem 0 0" text={Constants.DECIDE} /> */}
            </Div>
            <Div width="100%" height="80%" margin=".5rem .5rem 2% .5rem" backcolor="#FFF" direction="column" alignItems="center" justify="flex-start" >
                <div className="uk-inline" style={{width: '60%'}}>
                    <span className="uk-form-icon" href="#" >
                        <FontAwesomeIcon icon={ faLink } color="#95A8B5"/>
                    </span>
                    <a className="uk-form-icon uk-form-icon-flip" href="#"  >
                      <div className="uk-inline">
                          <FontAwesomeIcon icon={ faShareSquare } color="#95A8B5"/>
                          <div uk-drop="mode: click" style={{width: "500px"}}>
                              <div className="uk-card uk-card-body uk-card-default " style={{padding: "10px 10px", display: "flex", justifyContent: "space-around"}}>
                                <FacebookShareButton url={linkUrl} onClick={() => shareUrl()} >
                                  <FacebookIcon size={32} round={true} />
                                 </FacebookShareButton>
                                {/*<a href={`https://twitter.com/messages/compose?recipient_id=3805104374&text=${encodeURIComponent(linkUrl)}`} target="_blank"
                                  className="twitter-dm-button"  data-screen-name="@MDK">
                                <TwitterIcon size={32} round={true} />(messenger)</a> */}
                                <TwitterShareButton url={linkUrl} >
                                  <TwitterIcon size={32} round={true} />
                                </TwitterShareButton>
                                  {/* <img src={`${Constants.LOCAL_IMAGE_URL}shareImg.png`} /> */}
                                <LineShareButton url={linkUrl} >
                                  <LineIcon size={32} round={true} />
                                </LineShareButton>
                                {/* <EmailButton url={linkUrl} > */}
                                  <EmailIcon size={32} round={true} onClick={() => emailContentShowHandler()} />
                                {/* </EmailButton> */}
                              </div>
                          </div>
                      </div>
                    </a>
                    <Input className="uk-input" type="text" name="linkUrl" placeholder="https://" onChange={ (e) => setLinkUrl(e.target.value) } value={linkUrl} />
                </div>
                <Div width="300px" height="250px" margin=".5rem .5rem 2% .5rem" backcolor="#FFF" border="1px solid #A3B5C1" >
                  <QRCode
                    id="123456"
                    value={linkUrl}
                    size={250}
                    level={"H"}
                    includeMargin={true}
                  />
                </Div>
                {/* <Div width="95%" margin=".5rem" padding="0" justify="center" >
                    <Div width="30%" margin="0" padding="0" justify="flex-end" >
                        <Btn width="20%" radius="3px" border={ `1px solid ${theme_color}` } backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1.5rem 0 0" text={Constants.SEND} />
                    </Div>
                </Div> */}
            </Div>
            <Modal show={emailContentShow} width="35%" modalClosed={() => emailContentShowHandler()}>
              <AgentEmailContent linkUrl={linkUrl} emailContentShowHandler={() => emailContentShowHandler()} />
            </Modal>

        </BlockContent>
    </MainContent>
  );
}

