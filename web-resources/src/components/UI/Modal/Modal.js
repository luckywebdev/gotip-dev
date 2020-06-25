import React, { Component } from 'react';

import Aux from '../../../hoc/Au/Auxx';
import Backdrop from '../Backdrop/Backdrop';
import classes from './Modal.css';

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
                <div className={classes.StyleModal}
                    style={additionalStyle}
                 >
                    <span className={classes.CloseButton} onClick={this.props.modalClosed}>
                        <span uk-icon="icon: close"></span>
                    </span>
                    {this.props.children}
                </div>
            </Aux>
        );
    }
    
};

export default Modal;