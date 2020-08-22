import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Constants from '../../Constants';
import main from '../../store/actions/main';

import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled from 'styled-components';
import Btn from '../UI/btn';
import Img from '../UI/img';

const StyleHeader = styled.header`
  background-color: ${ props => `${ props.backColor ? props.backColor : '#30AA89' }` };
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
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

const SearchResult = styled.div`
  background-color: #FFF;
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 270px;
  height: 200px;
  position: absolute;
  top: 90%;
  left: 28%;
`;

const CategoryList = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  width: 95%;
  margin: .5rem auto;
  flex-flow: wrap;
`;

let dispatch;
export default (props) => {
  dispatch = useDispatch()
  const mainState = useSelector( state => state.main );
  const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
  const headerHide = props.headerHide ? true : false;
  const [categoryList, setCategoryList] = useState(false);
  const [selectCategory, setSelectCategory] = useState(0);

  return (
    <StyleHeader uk-navbar backColor={(typeof mainState.user !== 'undefined' && mainState.user.theme_color !== '') ? mainState.user.theme_color : '#30AA89'}>
        <HeaderContent>
          <div>
            <Img margin="auto .5rem auto 0" src="/static/img/header_logo.png" clicked={() => props.history.push('/land')} />
            {
              !headerHide ? (
                <SearchDiv className="uk-inline">
                  <a className="uk-form-icon" href="#" uk-icon="icon: search" onClick={() => setCategoryList(false)}></a>
                  <SearchInput className="uk-input" type="text" placeholder="ユーザーを検索" onFocus={() => setCategoryList(true)} onChange={() => setCategoryList(true)} />
                </SearchDiv>
              ) : ''
            }
          </div>
          {
            !headerHide ? (
              <div>
                <Img margin="auto .5rem" src="/static/img/gotip_icon.png" clicked={() => props.history.push('/home')}  />
                <Img margin="auto .5rem" src="/static/img/quote_icon.png" />
                <Img margin="auto .5rem" src="/static/img/bell_icon.png" />
                <Img margin="auto .5rem auto 0" src="/static/img/user_icon.png" clicked={() => props.history.push('/useredit')} />
              </div>
            ) : ''
          }
        </HeaderContent>
          {
            categoryList ? (
              <SearchResult>
                <CategoryList>
                  {
                    Constants.CATEGORY_LIST.map((item, index) => {
                      return (<Btn key={index} text={item} backcolor={index === selectCategory ? theme_color : "#CFD3D6"} color="#FFF" onClick={() => setSelectCategory(index)} radius="20px" fontSize="12px" margin="0.5rem .5rem 0 0"  padding=".3rem" />)
                    } )
                  }
                </CategoryList>
              </SearchResult>
            ) : ''
          }

    </StyleHeader>
  );
}

