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
import CreatorEmailContent from './creatorInviteMailContent';

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


export default (props) => {
    const [agentID, setAgentID] = useState(100000);
    const [agentLevel, setAgentLevel] = useState(0);
    const [emailContentShow, setEmailContentShow] = useState(false);
    const [linkUrl, setLinkUrl] = useState(`${Constants.BASE_URL}signup/100000`);
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
    const shareUrl = () => {
      console.log("facebook share!");
    }

    useEffect(() => {
      if(typeof mainState.user !== 'undefined' && mainState.user.auth_level === 3){
        setAgentLevel(mainState.user.agentLevel);
        setAgentID(mainState.user.agent_id);
        setLinkUrl(`${Constants.BASE_URL}signup/${mainState.user.agent_id}`)
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
            <Div width="100%" height="80%" margin=".5rem .5rem 2% .5rem" backcolor="#FFF" direction="column" alignItems="center" justify="flex-start" >
                <div className="uk-inline" style={{width: '60%', display: "inline-flex", alignItems: "center"}}>
                    <span className="uk-form-icon" href="#" >
                        <FontAwesomeIcon icon={ faLink } color="#95A8B5"/>
                    </span>
                    <Input className="uk-input" type="text" name="linkUrl" placeholder="https://" onChange={ (e) => setLinkUrl(e.target.value) } value={linkUrl} />
                    <a className="" href="#" style={{width:"10%", marginLeft: "5px"}} >
                      <div className="uk-inline">
                          <FontAwesomeIcon icon={ faShareSquare } color="#95A8B5" size={42}/>
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
              <CreatorEmailContent linkUrl={linkUrl} emailContentShowHandler={() => emailContentShowHandler()} />
            </Modal>

        </BlockContent>
    </MainContent>
  );
}

