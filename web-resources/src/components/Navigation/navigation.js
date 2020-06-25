import React from 'react';
import UIkit from 'uikit';
import styled from 'styled-components';
import Btn from '../UI/btn';

const styleNav = styled.nav`
  background-color: #30AA89;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`
export default (props) => {
  return (
    <styleNav className="uk-navbar-container" uk-navbar>
        <div className="uk-navbar-left">
            <ul className="uk-navbar-nav">
                <li className="uk-active"><a href="">Home</a></li>
                <li className="uk-parent"><a href="">My Page</a></li>
                <li><a href="">Messages</a></li>
            </ul>
        </div>
    </styleNav>
  );
}

