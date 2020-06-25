import React from 'react';
import styled from 'styled-components'

const TermsDl = styled.dl`
  white-space: pre-line;
`


function generateDT (data) {
  const result = []
  if (data && typeof data === 'object') data.forEach((item) => {
    if (item.heading && item.text ) result.push(
      <React.Fragment>
        <dt>{ item.heading }</dt>
        <dd>{ item.text }</dd>
      </React.Fragment>
    )
  })
  return result
}

export default (props) => {
  return (
    <TermsDl className="uk-description-list uk-description-list-divider">
      { generateDT(props.data) }
    </TermsDl>
  )
}