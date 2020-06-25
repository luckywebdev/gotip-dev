import React from 'react';
import styled from 'styled-components';
import classes from './index.css';
const input = (props) => {
    
    let validationError = null;
    let inputElement = null;

    let additionalStyle = {
      border: props.border ? props.border : 'none',
      width: props.width ? props.width : '100%',
      height: props.height ? props.height : '50px',
      backgroundColor: props.backcolor ? props.backcolor : '#F5F8FA',
      color: props.color ? props.color : '#333',
      margin: props.margin ? props.margin : '0',
      padding: props.padding ? props.padding : '0',
      fontSize: props.fontSize ? props.fontSize : 'inherite'
    }
    if (props.invalid && props.shouldValidate && props.touched){
      additionalStyle = { ...additionalStyle, border: '1px solid red' };

        validationError = <p className={classes.ValidateNote} >Please enter a valid value!</p>;    
    }

    switch(props.elementType){
        case ('input'):
            inputElement = <input 
                className={classes.InputElement}
                // {...props.elementConfig} 
                name={props.name}
                value={props.value}
                onChange={props.changed}
                style={additionalStyle} />;
            break;
        case ('textarea'):
            inputElement = <textarea 
                className={classes.TextAreaElement}
                {...props.elementConfig} 
                name={props.name}
                value={props.value}
                onChange={props.changed}
                style={additionalStyle} />;
            break;
        case ('select'):
            inputElement = <select
                className={classes.SelectElement}
                value={props.value}
                {...props.elementConfig}
                name={props.name}
                onChange={props.changed}
                style={additionalStyle} >
                {props.elementConfig.options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.displayValue}
                    </option>
                ))}
            </select>;
            break;
        default:
            inputElement = <input 
                className={classes.InputElement}
                {...props.elementConfig} 
                name={props.name}
                value={props.value}
                style={additionalStyle}
                 />;
    }
    
    return(
        <div className={classes.InputDiv}>
            {/* <LabelStyle>{props.label}</LabelStyle> */}
            { inputElement }
            { validationError } 
        </div>
    );
}
    

export default input;

