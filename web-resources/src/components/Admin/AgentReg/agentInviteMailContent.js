import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import media from 'styled-media-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faShareSquare } from '@fortawesome/free-solid-svg-icons'
import QRCode from 'qrcode.react';
import agent from '../../../store/actions/agent';

import Btn from '../../UI/btn';
import Img from '../../UI/img';
import Text from '../../UI/text';
import Div from '../../UI/div';
import Anchor from '../../UI/a';

const MainContent = styled.nav`
    width: 100%;
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


const ErrorMsg = styled.div`
  color: red;
`;


export default (props) => {
  let dispatch = useDispatch();
    const [agentID, setAgentID] = useState(100000);
    const [title, setTitle] = useState("GOTIP代理店登録のご招待");
    const [content, setContent] = useState("");
    const [receiveName, setReceiveName] = useState("");
    const [linkUrl, setLinkUrl] = useState(`${props.linkUrl}`);
    const [errors, setErrors] = useState({email: "", reEmail: ""});
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";

    useEffect(() => {
        setLinkUrl(props.linkUrl);
        setContent(`GOTIP代理店登録フォーム${props.linkUrl}`);
        let parentAgentIdArr = props.linkUrl.split('/');
        let parentsAgentId = parentAgentIdArr.slice(-1)[0];
       var idArr = parentsAgentId.match(/.{1,6}/g);
        setAgentID(idArr[1]);
    }, [props.linkUrl])

    const downloadQR = () => {
        const canvas = document.getElementById("123456");
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "123456.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

    const sendMessage = () => {
        const canvas = document.getElementById("123456");
        const qrUrl = canvas
          .toDataURL("image/png")
          // .replace("image/png", "image/octet-stream");
        dispatch(agent.sendMessage({receive: receiveName, title: title, content: content, qrUrl: qrUrl, agentID: agentID}));
        props.emailContentShowHandler();
    }

    return (
    <MainContent>
        <BlockContent>
            <Div width="100%" height="80%" margin=".5rem .5rem 2% .5rem" backcolor="#FFF" direction="column" alignItems="center" justify="flex-start" >
                <Div width="95%" margin=".5rem" padding="0" justify="center" >
                    <Div width="15%" margin="0" padding="0" justify="flex-end" >
                        <Text  str="宛先" textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                    </Div>
                    <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                        <Input className="uk-input" type="text" name="receiveName" placeholder="" onChange={ (e) => setReceiveName(e.target.value) } value={receiveName} />
                        <ErrorMsg>{errors.accountName}</ErrorMsg>
                    </Div>
                </Div>
                <Div width="95%" margin=".5rem" padding="0" justify="center" >
                    <Div width="15%" margin="0" padding="0" justify="flex-end" >
                        <Text  str="件名" textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                    </Div>
                    <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                        <Input className="uk-input" type="text" name="title" placeholder="" onChange={ (e) => setTitle(e.target.value) } value={title} />
                        <ErrorMsg>{errors.title}</ErrorMsg>
                    </Div>
                </Div>
                <Div width="95%" margin=".5rem" padding="0" justify="center" >
                    <Div width="15%" margin="0" padding="0" justify="flex-end" >
                        <Text  str="本文" textAlign="right" color="#999" fontSize=".8rem" margin="0 .3rem" />
                    </Div>
                    <Div width="65%" margin="0" padding="0" direction="column" alignItems="flex-start" >
                        <textarea name="content" rows="5" style={{width: "100%", border: "1px solid #A3B5C1", resize: "none"}} value={content} onChange={(e) => setContent(e.target.value)} ></textarea>
                    </Div>
                </Div>
                <Div width="300px" height="250px" margin=".5rem .5rem 2% .5rem" backcolor="#FFF" border="1px solid #A3B5C1" direction="column" >
                  <QRCode
                    id="123456"
                    value={linkUrl}
                    size={250}
                    level={"H"}
                    includeMargin={true}
                  />
                </Div>
                <Div width="95%" margin=".5rem" padding="0" justify="center" >
                    <Btn width="30%" radius="3px" border={ `1px solid ${theme_color}` } backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1.5rem 0 0" text={Constants.SEND} onClick={() => sendMessage()} />
                </Div>
            </Div>
        </BlockContent>
    </MainContent>
  );
}

