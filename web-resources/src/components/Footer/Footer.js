import React from 'react';
import { useHistory } from "react-router-dom"

import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled from 'styled-components';
import media from 'styled-media-query';
import FlexContainer from '../UI/flexContainer';
import LinkList from '../UI/List';
import LineDiv from '../UI/Divider';
import Anchor from '../UI/a';

const StyleFooter = styled.footer`
  background-color: #454545;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  ${ media.lessThan('small')`
    display: none;
  ` }
`

const FooterContent = styled.div`
  max-width: 60%;
  width: 70%;
  padding-top: 2%;
  padding-bottom: 2%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
let history

export default (props) => {
  history = useHistory();
  const flexChildren = []
  footerLinks.forEach((links, i) => {
    flexChildren.push(
      <LinkList key={ i } lists={ links } color='#FFF' />  
    )
  })

  return (
    <StyleFooter>
        <FooterContent>
          <FlexContainer children={ flexChildren } justify='around' responsive={ true } />
          <LineDiv width="100%" />
          <div className="uk-flex uk-flex-center uk-margin">
            <Anchor margin="auto 1rem" fontSize="12px" color="#B1B1B1" href="#" clicked={pushInternalHistory.bind(this, '/terms')} text="利用規約"></Anchor>
            <Anchor margin="auto 1rem" fontSize="12px" color="#B1B1B1" href="#" clicked={pushInternalHistory.bind(this, '/privacy')} text="プライバシーポリシー"></Anchor>
          </div>
        </FooterContent>
    </StyleFooter>
  );
}

const footerLinks = [
  {
    title: 'GO TIP',
    items: [
      {
        text: 'ホーム',
        onClick: pushInternalHistory.bind(this, '/home')
      },
      {
        text: '会社概要',
        onClick: pushInternalHistory.bind(this, '/company')
      }
    ]
  },
  {
    title: 'アカウント',
    items: [
      {
        text: 'ログイン',
        onClick: pushInternalHistory.bind(this, `/login`)
      },
      {
        text: '新規登録',
        onClick: pushInternalHistory.bind(this, '/signup')
      }
    ]
  },
  {
    title: 'サポート',
    items: [
      {
        text: 'お問い合わせ',
        onClick: pushInternalHistory.bind(this, '/contact')
      },
      {
        text: '使い方',
        onClick: pushInternalHistory.bind(this, '/privacy')
      },
      {
        text: 'ヘルプ',
        onClick: pushInternalHistory.bind(this, '/contact')
      }
    ]
  }
]

function pushInternalHistory (path) {
  console.log("path", path);
  history.push(path)
}
