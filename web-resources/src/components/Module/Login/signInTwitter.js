import React, {Component } from 'react';
import styled from 'styled-components';

const IconImage = styled.img`
  width: 42px;
  height: 42px;
  margin: auto 20px;
`

class signInTwitter extends Component {
  render() {
    return (
      <IconImage src="/static/img/twitter_icon.png" alt="twitter_icon" />
    );
  }
}

export default signInTwitter;