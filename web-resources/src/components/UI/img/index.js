import React from 'react';
import styled from 'styled-components'
import media from "styled-media-query";

const Image = styled.img`
  display: inline-block;
  border: none;
  padding: 0;
  border-radius: ${ props => `${ props.data.radius ? props.data.radius : '' }` };
  margin: ${ props => `${ props.data.margin ? props.data.margin : '' }` };
  height: ${ props => `${ props.data.height ? props.data.height : '100%' }` };
  width: ${ props => `${ props.data.width ? props.data.width : '' }` };
  max-height: ${ props => `${ props.data.maxHeight ? props.data.maxHeight : '' }` };
  max-width: initial;
  cursor: pointer;
  ${media.lessThan("large")`
  /* screen width is between 768px (medium) and 1170px (large) */
    padding: ${ props => `${props.data.paddingL ? props.data.paddingL : ''}` };
    margin: ${ props => `${props.data.marginL ? props.data.marginL : ''}` };
    width: ${ props => `${props.data.widthL ? props.data.widthL : ''}` };
    height: ${ props => `${props.data.heightL ? props.data.heightL : ""}` };
  `}
  ${media.lessThan("medium")`
  /* screen width is between 768px (medium) and 1170px (large) */
    padding: ${ props => `${props.data.paddingM ? props.data.paddingM : ''}` };
    margin: ${ props => `${props.data.marginM ? props.data.marginM : ''}` };
    width: ${ props => `${props.data.widthM ? props.data.widthM : ''}` };
    height: ${ props => `${props.data.heightM ? props.data.heightM : ""}` };
  `}
  ${media.lessThan("small")`
  /* screen width is between 450px (small) */
    padding: ${ props => `${props.data.paddingS ? props.data.paddingS : ''}` };
    margin: ${ props => `${props.data.marginS ? props.data.marginS : ''}` };
    width: ${ props => `${props.data.widthS ? props.data.widthS : ''}` };
    height: ${ props => `${props.data.heightS ? props.data.heightS : ""}` };
  `}
`

export default (props) => {

  return (
    <Image src={ props.src } data={props} onClick={ props.clicked } />
  )
}