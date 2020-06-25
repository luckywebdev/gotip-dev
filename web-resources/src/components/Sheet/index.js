import React from 'react';
import styled from 'styled-components'

const SheetContainer = styled.div`
  background-color: ${ props => props.bgColor ? props.bgColor : 'rgba(255, 255, 255, 0.9)' };
  padding-left: ${ props => props.paddingHorizontal === 'no' ? '0' : '1em' };
  padding-right: ${ props => props.paddingHorizontal === 'no' ? '0' : '1em' };
  padding-top: ${ props => props.paddingTop === 'no' ? '0' : '1em' };
  padding-bottom: ${ props => props.paddingBottom === 'no' ? '0' : '1em' };
  margin: auto;
  max-width: ${ props => props.paddingHorizontal === 'no' ? 'calc( 768px + 2em )' : '768px' };
`

export default (props) => {
  return (
    <SheetContainer bgColor={ props.bgColor } paddingTop={ props.paddingTop } paddingBottom={ props.paddingBottom } paddingHorizontal={ props.paddingHorizontal }>
      { props.content }
    </SheetContainer>
  )
}