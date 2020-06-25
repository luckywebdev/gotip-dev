import React, { Component } from 'react';

import styled from 'styled-components';
import media from 'styled-media-query';
import Aux from '../Au/Auxx';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const Content = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: auto;
`;
const StyleMain = styled.main`
    margin-top: 56px;
    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
    ${ media.lessThan("medium")`
        margin-top: 50px !important;
    `}
`
class Layout extends Component{
    constructor(props) {
        super(props);
    }
    
    render(){
        return(
            <Aux>
                <Content>
                    <Header {...this.props} />
                    <StyleMain >
                        {this.props.children}
                    </StyleMain>
                    <Footer />
                </Content>
            </Aux>
        );
    }
} 
export default Layout;