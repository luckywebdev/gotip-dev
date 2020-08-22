import React from 'react';
import styled, { keyframes } from 'styled-components'

const keyFrameFadeInOut = keyframes`
  0% {
    color: rgba(255,255,255,1);
  }
  100% {
    color: rgba(255,255,255,0.4);
  }
`

const LoadingContainer = styled.div`
  user-select: none;
  margin: auto;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1050;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${ keyFrameFadeInOut } 1.4s ease-in-out 0s infinite alternate;
  &>span {
    display: inline-block;
    text-align: center;
  }
`

export default (props) => {
  return props.text ? (
    <LoadingContainer>
      <span>
        <div uk-spinner={ `ratio: ${ props.ratio ? props.ratio : 2 };` } />
        <br />
        <br />
        { props.text }
      </span>
    </LoadingContainer>
  ) : null
}