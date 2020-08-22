import React from 'react';
import styled from 'styled-components';

const CardStyle = styled.div`
  width: ${ props => `${props.data.width ? props.data.width : 'auto' }` };
  height: ${ props => `${props.data.height ? props.data.height : 'auto' }` };
  min-height: ${ props => `${props.data.minHeight ? props.data.minHeight : 'auto' }` };
  margin: ${ props => `${props.data.margin ? props.data.margin : '' }` };
  padding: 20px;
  background-color: ${ props => `${props.data.backColor ? props.data.backColor : '#FFF' }` };
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2), 1px 5px 20px 1px rgba(0, 0, 0, 0.19);
  border-radius: ${ props => `${props.data.radius ? props.data.radius : '7px' }` };
  box-sizing: border-box;
`


export default (props) => {

    return (
      <CardStyle className="uk-card uk-card-hover uk-card-body" data={props} >{props.children}</CardStyle>
    );
}

