import React from 'react';
import styled from 'styled-components';

const StyleDiv = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 2000;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
`

const backdrop = (props) => (
    props.show ? <StyleDiv onClick={props.clicked}></StyleDiv> : null 
);

export default backdrop;