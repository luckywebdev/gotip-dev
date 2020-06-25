import React from 'react';
import styled from 'styled-components';

const LineDiv = styled.div`
  margin: ${ props => `${props.data.margin ? props.data.margin : 'auto' }` };
  width: ${ props => `${props.data.width ? props.data.width : 'auto' }` };
  height: 1px;
  background-color: #CFD3D6;
`

export default (props) => {
    return (
      <LineDiv data={ props }></LineDiv>
    );
}

