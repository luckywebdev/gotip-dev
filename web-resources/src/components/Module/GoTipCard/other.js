import React, {useState} from 'react';
import Switch from "react-switch";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons'
import * as Constants from '../../../Constants';
import Text from '../../UI/text';
import Div from '../../UI/div';
import Btn from '../../UI/btn';
import Img from '../../UI/img';

import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../store/actions/main';

const CardStyle = styled.div`
  padding: 20px;
  position: absolute;
  bottom:10%;
  right: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 7px;
  svg {
    height: 100%;
  }
`
const CloseBtn = styled.span`
  width: 20px;
  height: 20px;
  background-color: #EA497B;
  border-radius: 50%;
  padding: 5px;
  color: #FFF;
  cursor: pointer;
  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  z-index: 1000;
  &:hover {
    opacity: .9;
  }
`
const GotipSendModal = styled.div`
  width: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(255, 255, 255, .99);
  border-radius: 10px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
`;

const RightMarginLabel = styled.label`
  margin-right: 1em;
  font-size: 12px;
`

let dispatch

export default (props) => {
  dispatch = useDispatch()
  const [checked10, setChcecked10] = useState(false);
  const [checked20, setChcecked20] = useState(false);
  const [oneCheck, setOneCheck] = useState(false);
  const [gotipSendModal, setGotipSendModal] = useState(false);
  const state = useSelector( state => state.main );
  const theme_color = typeof state.otherUser !== 'undefined' && typeof state.otherUser.theme_color !== 'undefined' ? state.otherUser.theme_color : "#30AA89";
  const gotipShows = () => {
    let gotip_show_state = state.show_state;
    if(gotip_show_state === undefined)
      gotip_show_state = false;
    dispatch(actions.gotipShow(!gotip_show_state));
  };
  
  const gotipModal = () => {
    return (
      <GotipSendModal>
        <Div width="60%" margin="3rem auto 0 auto" padding="0" backcolor="#FFF" style={{borderRadius: "10px"}} justify="center">
          <Text color="#313131" str="30ptをxxxさんに送信しますよろしいですか？" margin="0 .5rem" fontSize="12px" />
        </Div>
        <Div width="100%" justify="space-around" alignItems="center" margin=".5rem auto 0 auto" padding="0">
          <Btn text={Constants.CANCEL} backcolor="#FFF" color={theme_color} radius="20px" border={`1px solid ${theme_color}`} fontSize="12px" width="25%" margin=".5rem" padding=".5rem 2rem" />
          <Btn text={Constants.SEND} backcolor={theme_color} color="#FFF" border="none" radius="20px" fontSize="12px" margin=".5rem" padding=".5rem 2rem" width="25%" onClick={() => setGotipSendModal(false)} />
        </Div>
        <Div width="100%" justify="space-around" alignItems="center" margin="0 0 1rem 0">
          <RightMarginLabel><input className="uk-checkbox" type="checkbox" name="oneCheck" value={oneCheck} onChange={ () => setOneCheck(!oneCheck) } checked={ oneCheck } style={{marginRight: '5px'}} />今後は表示しない</RightMarginLabel>
        </Div>
      </GotipSendModal>
    )
  }

    const pointList = props.children.map(item => {
      return item;
    });

    return (
      <CardStyle className="uk-card uk-card-body" >
        <CloseBtn onClick={ gotipShows }>X</CloseBtn>
        <div style={{width: "320px"}}>
          <Div width="100%" padding=".5rem" margin=".5rem 0 0 0" justify="flex-start" alignItems="center">
            <Text color="#FFF" str={typeof state.user !== 'undefined' && typeof state.user.name !== 'undefined' ? state.user.name.nickname : ""} margin="0 .5rem" fontSize="16px" />
          </Div>
          <Div width="100%" padding="0 .5rem" margin="0" justify="space-between" alignItems="center">
            <Div width="40%" padding="0" margin="0" justify="flex-start" alignItems="center">
              <FontAwesomeIcon icon={ faEye } color="#95A8B5"/>
              <Text color="#FFF" str="12567人" margin="0 .5rem" fontSize="12px" />
            </Div>
            <Div width="60%" padding="0" margin="0" justify="flex-end" alignItems="center">
              <Text color="#FFF" str="遅延設定" margin="0 .5rem" fontSize="12px" />
              <Switch
                onChange={() => setChcecked10(!checked10)}
                checked={checked10}
                className="react-switch"
                id="normal-switch"
              />
              <Switch
                onChange={() => setChcecked20(!checked20)}
                checked={checked20}
                className="react-switch"
                id="normal-switch"
              />
            </Div>
          </Div>
          <Div width="100%" padding=".5rem" margin=".5rem 0" justify="flex-start" alignItems="center">
            <Btn text={Constants.CONNECTING_STATE} backcolor={theme_color} color="#FFF" radius="1px" fontSize="12px" margin="0 .5rem 0 0" padding=".3rem" />
            <Text color="#FFF" str="ここに機器名がはいります" margin="0 1rem" fontSize="12px" />
          </Div>
          <Div width="100%" padding=".5rem" margin=".5rem 0" justify="flex-start" alignItems="center">
            <Text color="#FFF" str="機器の設定情報詳細がここに載ります機器の設定情報詳細がここに載ります機器の設定情報詳細がここに載ります機器の設定情報詳細がここに載ります" margin="0" fontSize="12px" />
          </Div>
          <Div width="95%" padding=".5rem" margin=".5rem 0" justify="center" alignItems="center" direction="column" style={{ border: "1px solid #FFF" }} >
            <Text color="#FFF" str="獲得ポイント" margin="0" fontSize="14px" />
            <Div width="100%" padding=".5rem" margin=".5rem 0" justify="space-around" alignItems="center" >
              <Img src={`${Constants.LOCAL_IMAGE_URL}point_10.png`} width="20px" height="20px" />
              <Text color="#FFF" str={`"150pt"`} margin="0" fontSize="14px" />
              <Img src={`${Constants.LOCAL_IMAGE_URL}point_20.png`} width="20px" height="20px" />
              <Text color="#FFF" str="150pt" margin="0" fontSize="14px" />
            </Div>
          </Div>
          <Div width="95%" height="100px" padding="0 .5rem" margin=".5rem 0" justify="flex-start" direction="column" alignItems="center" backcolor="#FFF" style={{ borderRadius: "10px"}} >
            <Div width="90%" height="100px" padding=".5rem" margin="0" justify="flex-start" direction="column" alignItems="flex-start" backcolor="#FFF" direction="column" style={{ overflowY: "auto" }} >
              <Text color="#333" str="獲得ポイント" margin="0" fontSize="14px" />
              <Text color="#333" str="獲得ポイント" margin="0" fontSize="14px" />
              <Text color="#333" str="獲得ポイント" margin="0" fontSize="14px" />
              <Text color="#333" str="獲得ポイント" margin="0" fontSize="14px" />
              <Text color="#333" str="獲得ポイント" margin="0" fontSize="14px" />
              <Text color="#333" str="獲得ポイント" margin="0" fontSize="14px" />
            </Div>
          </Div>

        </div>
        <div className="uk-divider-vertical" style={{height: "300px"}} ></div>
        {
          gotipSendModal ? gotipModal() : ''
        }
        <div>
          <Div width="100%" padding=".5rem" margin=".5rem 0" justify="flex-start" alignItems="center">
            <Text color="#FFF" str={Constants.EARNED_POINT} margin="0 .5rem" fontSize="16px" />
          </Div>
          <div className="uk-flex uk-flex-around">
            <Img src={`${Constants.LOCAL_IMAGE_URL}point_10.png`} width="20px" height="20px" />
            <Text color="#FFF" str="150pt" margin="0" fontSize="14px" />
            <Img src={`${Constants.LOCAL_IMAGE_URL}point_20.png`} width="20px" height="20px" />
            <Text color="#FFF" str="150pt" margin="0" fontSize="14px" />
          </div>
          {pointList}
          <Div width="100%" padding=".5rem" margin=".5rem 0" justify="space-around" alignItems="center">
            <Btn text="3000pt" backcolor="#FFF" color="#313131" radius="1px" width="20%" fontSize="12px" margin=".5rem" padding=".5rem 2rem" />
            <Btn text={Constants.SEND} backcolor={theme_color} color="#FFF" radius="20px" fontSize="12px" margin=".5rem" padding=".5rem 1rem" onClick={() => setGotipSendModal(true)} />
          </Div>
          <div className="uk-flex uk-flex-center uk-margin">
            <a className="uk-link-muted" href="#" uk-icon="icon: plus-circle"></a>
            <a className="uk-link-muted" href="#">チャージする</a>
          </div>
        </div>
      </CardStyle>
    );
}

