import React, { Component } from 'react';

import Aux from '../../../hoc/Au/Auxx';
import Backdrop from '../Backdrop/Backdrop';
import styled from 'styled-components';

const StyleModal = styled.div`
    position: fixed;
    z-index: 10000;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2), 1px 5px 20px 1px rgba(0, 0, 0, 0.19);
    min-height: 40vh;    
    height: auto;
    padding: 16px;
    padding-bottom: 2rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) !important;
    box-sizing: border-box;
    transition: all 0.5s ease-out;
    @media (max-width: 1320px){
        width: 50% !important;
    }
    @media screen and (max-width: 980px){
        width: 70% !important;
    }
`;

const CloseButton = styled.span`
    width: 30px;
    height: 30px;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    &:hover {
        opacity: .9;
        color: #999;    
    }
    span{
        font-size: 2rem;
        font-weight: bolder;
        color: #CCC;
    }
`;

class Modal extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState){
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children ;
    }


    render(){
        const additionalStyle = {
            transform: this.props.show? 'translateY(0)' : 'translateY(-100vh)',
            display: this.props.show? 'block' : 'none',
            opacity: this.props.show? '1' : '0',
            width: this.props.width ? this.props.width : '70%',
        }
        
        return(
            <Aux>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
                <StyleModal
                    style={additionalStyle}
                 >
                    <CloseButton onClick={this.props.modalClosed}>
                        <span uk-icon="icon: close"></span>
                    </CloseButton>
                    {this.props.children}
                </StyleModal>
            </Aux>
        );
    }
    
};

export default Modal;