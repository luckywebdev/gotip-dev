import React from 'react';
import styled from 'styled-components'
import LinkAnchor from '../a'

const PlainList = styled.ul`
  list-style: none;
  color: ${ props => props.color };
  li {
    font-size: .7rem;
    &:first-child {
      font-size: 1em;
      font-weight: bold;
      margin-bottom: 6px;
    }
  }
`

export default (props) => {
  const links = props.lists;
  return (
    <PlainList color={ props.color }>
       <li>{ links.title }</li>
       { links.items.map( (item, i) => (
         <li key={ i }>
           <LinkAnchor color='#B1B1B1' text={ item.text } href={ item.url } clicked={ item.onClick } />
         </li>
       ) ) }
    </PlainList>
  )
}