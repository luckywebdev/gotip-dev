import React from 'react';
import styled, { css } from 'styled-components'
import media from "styled-media-query"

const responsiveStyle = css`
  ${ media.lessThan('small')`
      flex-wrap: wrap;
      &> div {
        display: block;
        width: 100%;
      }
  ` }
`

const Container = styled.div`
  display: flex;
  width: 80%;
  height: 100%;
  justify-content: ${ props => {
    switch (props.justify) {
      case 'between':
        return 'space-between'
      case 'around':
      default:
        return 'space-around'
    }
  }};
  ${ props => {if (props.responsive) return responsiveStyle} }
`
const InnerContainer = styled.div`
  display: inline-flex;
  height: 100%;
  width: 30%;
  justify-content: center;
`

export default (props) => {
  return (
    <Container justify={ props.justify } responsive={ props.responsive }>
      { props.children.map((child, i) => {
        return (
          <InnerContainer key={ i }>
            { child }
          </InnerContainer>
        )
      }) }
    </Container>
  )
}