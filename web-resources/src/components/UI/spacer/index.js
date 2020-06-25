import React from 'react';
import styled from 'styled-components'

const Spacer = styled.span`
  display: inline-block;
  margin: 0 4px;
`

export default (props) => {
  return (
    <Spacer>{ props.text }</Spacer>
  )
}