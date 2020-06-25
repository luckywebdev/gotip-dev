import React from 'react';
import styled from 'styled-components';

const LogoImage = styled.img`
  width: ${ props => `${props.data.width ? props.data.width : 'auto' }` };
  height: ${ props => `${props.data.height ? props.data.height : 'auto' }` };
  margin: ${ props => `${props.data.margin ? props.data.margin : '' }` };
`

export default (props) => {

    return (
      <LogoImage src={props.src} alt={props.alt} data={props} />
    );
}

