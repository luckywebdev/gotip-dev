import React from 'react';
import styled from 'styled-components';
import media from "styled-media-query";

const RoundedBorder = styled.span`
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  color: ${ props => `${ props.data.color ? props.data.color : '#FFF' }` };
  border: ${ props => `${ props.data.border ? props.data.border : 'none' }` };
  background-color: ${ props => `${ props.data.backcolor ? props.data.backcolor : '#30AA89' }` };
  border-radius: ${ props => `${ props.data.radius ? props.data.radius : '20px' }` };
  width: ${ props => `${ props.data.width ? props.data.width : 'auto' }` };
  font-weight: ${ props => `${ props.data.fontWeight ? props.data.fontWeight : '600' }` };
  padding: ${ props => `${ props.data.padding ? props.data.padding : '.1rem 2rem' }` };
  margin: ${ props => `${ props.data.margin ? props.data.margin : '1rem 1rem .5rem 1rem' }` };
  position: ${ props => `${ props.data.position ? props.data.position : 'unset' }` };
  top: ${ props => `${ props.data.top ? props.data.top : 'unset' }` };
  left: ${ props => `${ props.data.left ? props.data.left : 'unset' }` };
  right: ${ props => `${ props.data.right ? props.data.right : 'unset' }` };
  font-size: ${ props => `${ props.data.fontSize ? props.data.fontSize : 'inherit' }` };
  &[disabled] {
    color: #FFF;
    background-color: #CFD3D6;
  }  

  &:hover {
    opacity: 0.6;
  }
  &[disabled] {
    color: #FFF;
    background-color: #CFD3D6;
  }
  ${media.lessThan("large")`
  /* screen width is between 768px (medium) and 1170px (large) */
    width: ${ props => `${ props.data.widthL ? props.data.widthL : '' }` };
    margin: ${ props => `${props.data.marginL ? props.data.marginL : ''}` };
    font-size: ${ props => `${props.data.fontSizeL ? props.data.fontSizeL : ''}` };
    font-weight: ${ props => `${props.data.fontWeightL ? props.data.fontWeightL : ''}` };
  `}
  ${media.lessThan("medium")`
  /* screen width is between 768px (medium) and 1170px (large) */
    width: ${ props => `${ props.data.widthM ? props.data.widthM : '' }` };
    margin: ${ props => `${props.data.marginM ? props.data.marginM : ''}` };
    font-size: ${ props => `${props.data.fontSizeM ? props.data.fontSizeM : ''}` };
    font-weight: ${ props => `${props.data.fontWeightM ? props.data.fontWeightM : ''}` };
  `}
  ${media.lessThan("small")`
  /* screen width is between 450px (small) */
    width: ${ props => `${ props.data.widthS ? props.data.widthS : '' }` };
    margin: ${ props => `${props.data.marginS ? props.data.marginS : ''}` };
    font-size: ${ props => `${props.data.fontSizeS ? props.data.fontSizeS : ''}` };
    font-weight: ${ props => `${props.data.fontWeightS ? props.data.fontWeightS : ''}` };
  `}
`

const btn = (props) => {
  const onClickValue = !props.disabled ? props.onClick : null
  return (
    <RoundedBorder onClick={ onClickValue } data={props} id={props.id} disabled={ props.disabled }>
      { props.text }
      { props.children }
    </RoundedBorder>
  )
}

export default btn;