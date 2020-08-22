import React, { Component } from 'react';
import { connect } from "react-redux";
import Aux from '../hoc/Au/Auxx';
import axios from '../axios-instance';
import withErrorHandler from '../hoc/WithErrorHandler/WithErrorHandler';
import { withRouter } from 'react-router-dom';
import login from '../store/actions/login';
import OffCanvas from '../components/OffCanvas';

import Introduction from '../components/Partial/Introduction';
import AboutSection from '../components/Partial/AboutSection';
import AdviceSection from '../components/Partial/AdviceSection';
import PriceSection from '../components/Partial/PriceSection';
import HomeFooter from '../components/Partial/HomeFooter';
import Modal from '../components/UI/Modal/Modal';
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import styled from 'styled-components';
import media from 'styled-media-query';

const LandContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    /* height: 100vh; */
    overflow: auto;
`;

const TopScrollButton = styled.div`
    position: fixed;
    bottom: 5%;
    right: 5%;
    width: 3rem;
    height: 3rem;
    background-color: #30AA89;
    color: #FFF;
    border: none;
    box-shadow: none;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
        opacity: 0.8;
    }
`;


class Land extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            is_visible: false,
            intervalId: 0,
        };
      
    }

    componentDidMount() {
        if(localStorage.getItem('isLoggedin')) {
            this.props.history.push('/main');
        }
    }

    scrollStep = (stepSize) => {
        if (this.myRef.current.scrollTop <= 0) {
            clearInterval(this.state.intervalId);
        }
        if(this.myRef.current.scrollTop > stepSize)
            this.myRef.current.scrollTo(0, this.myRef.current.scrollTop - stepSize);
        else {
            this.myRef.current.scrollTo(0, 0);
        }
    }
  
    scrollToTop = (stepSize, stepInterval) => {
        let intervalId = setInterval(this.scrollStep.bind(this, stepSize), stepInterval);
        this.setState({ intervalId: intervalId });
    }

    scrollCaptures = () => {
        if(this.myRef.current.scrollTop >= 50 && !this.state.is_visible){
            this.setState({
                is_visible: true
            });
        }
        else if(this.myRef.current.scrollTop <= 50) {
            this.setState({
                is_visible: false
            });
        }
    }

    render() {
        return (
            <Aux>
                <div style={{height: '100vh', overflow: 'auto'}} onScrollCapture={this.scrollCaptures} ref={this.myRef}>
                    <LandContainer>
                        <OffCanvas />
                        <Introduction { ...this.props } />
                        <AboutSection />
                        <AdviceSection />
                        <PriceSection />
                        <HomeFooter />
                        {
                            this.state.is_visible ? (
                                <TopScrollButton onClick={this.scrollToTop.bind(this, 50, 15)}>
                                    <span uk-icon="icon: chevron-up; ratio: 2"></span>
                                </TopScrollButton>
                            ) : null
                        }    
            
                    </LandContainer>
                </div>
            </Aux>
        );
    }
}
  
export default withErrorHandler(withRouter(Land), axios);