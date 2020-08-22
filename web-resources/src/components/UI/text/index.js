import React from 'react';
import styled from 'styled-components';
import media from 'styled-media-query';

const BreakableSpan = styled.span`
  white-space: pre-line;
  width: ${ props => `${props.data.width ? props.data.width : 'auto'}` };
  color: ${ props => `${props.data.color ? props.data.color : '#000'}` };
  margin: ${ props => `${props.data.margin ? props.data.margin : '0'}` };
  font-size: ${ props => `${props.data.fontSize ? props.data.fontSize : 'inherit'}` };
  font-weight: ${ props => `${props.data.fontWeight ? props.data.fontWeight : 'normal'}` };
  text-align: ${ props => `${props.data.textAlign ? props.data.textAlign : 'unset'}` };
  ${media.lessThan("large")`
  /* screen width is between 768px (medium) and 1170px (large) */
    margin: ${ props => `${props.data.marginL ? props.data.marginL : ''}` };
    font-size: ${ props => `${props.data.fontSizeL ? props.data.fontSizeL : ''}` };
    font-weight: ${ props => `${props.data.fontWeightL ? props.data.fontWeightL : ''}` };
  `}
  ${media.lessThan("medium")`
    /* screen width is between 450px (small) and 768px (medium) */
      margin: ${ props => `${props.data.marginM ? props.data.marginM : ''}` };
      font-size: ${ props => `${props.data.fontSizeM ? props.data.fontSizeM : ''}` };
      font-weight: ${ props => `${props.data.fontWeightM ? props.data.fontWeightM : ''}` };
  `}
  ${media.lessThan("small")`
  /* screen width is between 450px (small) */
    margin: ${ props => `${props.data.marginS ? props.data.marginS : ''}` };
    font-size: ${ props => `${props.data.fontSizeS ? props.data.fontSizeS : ''}` };
    font-weight: ${ props => `${props.data.fontWeightS ? props.data.fontWeightS : ''}` };
  `}
`;


export default (props) => {
  let text = typeof props.str === 'string' ? props.str : ''
  return (
    <BreakableSpan data={props} id={props.id} style={ props.style }>{ text }</BreakableSpan>
  )
}