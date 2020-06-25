import React from 'react';
import styled from 'styled-components'

function generateThead (headData) {
  const items = []
  if (headData && typeof headData === 'object') headData.forEach((item, index) => {
    items.push(
    <th key={ index } className={ index === 0 ? 'uk-width-small' : null }>{ item }</th>
    )
  })
  return items.length > 0 ? (
    <thead>
      <tr>{ items }</tr>
    </thead>
  ) : null
}

function generateTbody (bodyData) {
  const rows = []
  if (bodyData && typeof bodyData === 'object') bodyData.forEach((rowData, index) => {
    if (rowData && typeof rowData === 'object') rows.push(
      <tr key={ index }>{ rowData.map((item, i) => {
        return <td key={ i }>{ item }</td>
      }) }</tr>
    )
  })
  return rows.length > 0 ? (
    <tbody>
      { rows }
    </tbody>
  ) : null
}


export default (props) => {
  return (
    <table className="uk-table uk-table-middle uk-table-divider">
      { generateThead(props.tableData.head) }
      { generateTbody(props.tableData.body) }
    </table>
  )
}