import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import main from '../../store/actions/main';

import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled from 'styled-components';
import Btn from '../UI/btn';
import Img from '../UI/img';

const StyleHeader = styled.header`
  background-color: ${ props => `${ props.backColor ? props.backColor : '#30AA89' }` };;
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
`
const HeaderContent = styled.div`
  max-width: 60%;
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const SearchInput = styled.input`
  border-radius: 20px;
  border: none;
  height: 40px;
  background-color: rgba(255, 255, 255, .3);
  color: #FFF;
  font-size: 1.2rem;
  &:focus {
    border: none;
    box-shadow: none;
    border-radius: 20px;
  }
  &::placeholder {
    color: #FFF;
  }
`
const SearchDiv = styled.div`
  &>a {
    color: #FFF;
    &:focus {
      color: #000;
    }
  }
`

let dispatch;
export default (props) => {
  dispatch = useDispatch()
  const mainState = useSelector( state => state.main )

  return (
    <StyleHeader uk-navbar backColor={(typeof mainState.user !== 'undefined' && mainState.user.theme_color !== '') ? mainState.user.theme_color : '#30AA89'}>
        <HeaderContent>
          <div>
            <Img margin="auto .5rem auto 0" src="/static/img/header_logo.png" clicked={() => props.history.push('/main')} />
            <SearchDiv className="uk-inline">
              <a className="uk-form-icon" href="#" uk-icon="icon: search"></a>
              <SearchInput className="uk-input" type="text" placeholder="ユーザーを検索" />
            </SearchDiv>
          </div>
          <div>
            <Img margin="auto .5rem" src="/static/img/gotip_icon.png" />
            <Img margin="auto .5rem" src="/static/img/quote_icon.png" />
            <Img margin="auto .5rem" src="/static/img/bell_icon.png" />
            <Img margin="auto .5rem auto 0" src="/static/img/user_icon.png" clicked={() => props.history.push('/useredit')} />
          </div>
        </HeaderContent>
    </StyleHeader>
  );
}

