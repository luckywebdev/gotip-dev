import React from 'react';
import styled from 'styled-components';
import media from 'styled-media-query';

const Anchor = styled.a`
  appearance: none;
  color: ${ props => `${ props.data.color ? props.data.color : 'inherit' }` };
  font-size: ${ props => `${ props.data.fontSize ? props.data.fontSize : 'inherit' }` };
  font-weight: ${ props => `${ props.data.fontWeight ? props.data.fontWeight : 'normal' }` };
  margin: ${ props => `${ props.data.margin ? props.data.margin : 'inherit' }` };
  text-decoration: ${ props => `${ props.data.decoration ? props.data.decoration : 'none' }` };
  white-space: nowrap;
  &:hover {
    opacity: 0.8;
    text-decoration: underline;
    color: ${ props => `${ props.data.color ? props.data.color : 'inherit' }` };
  }
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

  return (
    <Anchor href={ props.href } data={props} target={props.target} id={props.id} onClick={ props.clicked }>
      { props.text }
      { props.children }
    </Anchor>
  );
}