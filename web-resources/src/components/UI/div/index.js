import React from 'react';
import styled from 'styled-components';
import media from "styled-media-query";

const StyleDiv = styled.div`
  width: ${props => `${props.data.width ? props.data.width : '100%'}`};
  height: ${props => `${props.data.height ? props.data.height : "auto"}`};
  display: flex;
  justify-content: ${props => `${props.data.justify ? props.data.justify : 'center'}`};
  align-items: ${props => `${props.data.alignItems ? props.data.alignItems : 'center'}`};
  flex-direction: ${props => `${props.data.direction ? props.data.direction : 'row'}`};
  background-color: ${props => `${props.data.backcolor ? props.data.backcolor : 'transparent'}`};
  margin: ${props => `${props.data.margin ? props.data.margin : 'auto'}`};
  padding: ${props => `${props.data.padding ? props.data.padding : '1rem'}`};
  position: ${props => `${ props.data.position ? props.data.position : 'unset'}`};
  top: ${props => `${ props.data.top ? props.data.top : 'unset'}`};
  bottom: ${props => `${ props.data.bottom ? props.data.bottom : 'unset'}`};
  left: ${props => `${ props.data.left ? props.data.left : 'unset'}`};
  right: ${props => `${ props.data.right ? props.data.right : 'unset'}`};
  box-sizing: border-box;
  // overflow-y: auto;
  ${media.lessThan("large")`
  /* screen width is between 768px (medium) and 1170px (large) */
    padding: ${props => `${props.data.paddingL ? props.data.paddingL : ''}`};
    margin: ${props => `${props.data.marginL ? props.data.marginL : ''}`};
    width: ${props => `${props.data.widthL ? props.data.widthL : ''}`};
    height: ${props => `${props.data.heightL ? props.data.heightL : ""}`};
  `}
  ${media.lessThan("medium")`
  /* screen width is between 768px (medium) and 1170px (large) */
    padding: ${props => `${props.data.paddingM ? props.data.paddingM : ''}`};
    margin: ${props => `${props.data.marginM ? props.data.marginM : ''}`};
    width: ${props => `${props.data.widthM ? props.data.widthM : ''}`};
    height: ${props => `${props.data.heightM ? props.data.heightM : ""}`};
  `}
  ${media.lessThan("small")`
  /* screen width is between 450px (small) */
    padding: ${props => `${props.data.paddingS ? props.data.paddingS : ''}`};
    margin: ${props => `${props.data.marginS ? props.data.marginS : ''}`};
    width: ${props => `${props.data.widthS ? props.data.widthS : ''}`};
    height: ${props => `${props.data.heightS ? props.data.heightS : ""}`};
  `}

`;

const div = (props) => {
  return (
    <StyleDiv data={props} style={props.style}> 
      { props.children }
    </StyleDiv>
  )
}

export default div;