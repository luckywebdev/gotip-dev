import React, { Component } from 'react';

import styled from 'styled-components';
import media from 'styled-media-query';
import Aux from '../Au/Auxx';
import Header from '../../components/Header/AdminHeader';
import Footer from '../../components/Footer/Footer';
import OffCanvas from '../../components/OffCanvas';
import SideMenu from '../../components/SideMenu/AdminSideMenu';
import SubHeader from '../../components/Header/AdminSubHeader';

const Content = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: auto;
    background-color: #F5F8FA;
    position: relative;
`;
const SubContent = styled.div`
    width: 100%;
    min-height: 100%;
    overflow: auto;
    background-color: #F5F8FA;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
`;

const Side = styled.div`
    width: 18%;
    background: #343130;
    margin-top: 56px;
    height: auto;
    // min-height: 70vh;
    align-self: stretch;
`

const StyleMain = styled.main`
    margin-top: 56px;
    width: 90% !important;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    // min-height: 70vh;
    ${ media.lessThan("medium")`
        margin-top: 50px !important;
    `}
`;

class Layout extends Component{
    constructor(props) {
        super(props);
    }
    
    render(){
        return(
            <Aux>
                <Content>
                    <Header {...this.props} />
                    <OffCanvas />
                    <SubContent>
                        {
                            !this.props.regFlag ? (
                                <Side>
                                    <SideMenu />
                                </Side>
                            ) : null
                        }
                        <StyleMain>
                            {
                                !this.props.regFlag ? (
                                    <SubHeader />
                                ) : null
                            }
                            {this.props.children}
                        </StyleMain>
                    </SubContent>
                </Content>
            </Aux>
        );
    }
} 
export default Layout;