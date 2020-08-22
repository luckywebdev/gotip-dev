import React from 'react';
import styled from 'styled-components';
import classes from './index.css';

const InputDiv = styled.div`
    width: 100%;
    box-sizing: border-box;
`;

const ValidateNote = styled.p`
    text-align: left;
    margin: 1px 0;
    color: red;
`;

const InputElement = styled.input`
    box-shadow: none;
    outline: none;
    height: 50px;
    box-sizing: border-box;
    border-radius: 5px;
    &:focus {
        border: 1px solid #707070;
    }
`;

const TextAreaElement = styled.textarea`
    outline: none;
    font: inherit;
    display: block;
    box-sizing: border-box;
`;

const SelectElement = styled.select`
    outline: none;
    font: inherit;
    display: block; 
    padding: .8rem !important;
    box-sizing: border-box;
`;

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

        validationError = <ValidateNote >Please enter a valid value!</ValidateNote>;    
    }

    switch(props.elementType){
        case ('input'):
            inputElement = <InputElement
                // {...props.elementConfig}
                type={props.type}
                name={props.name}
                value={props.value}
                id={props.id}
                onChange={props.changed}
                placeholder={props.placeholder}
                style={additionalStyle} />;
            break;
        case ('textarea'):
            inputElement = <TextAreaElement
                {...props.elementConfig} 
                name={props.name}
                value={props.value}
                onChange={props.changed}
                style={additionalStyle} />;
            break;
        case ('select'):
            inputElement = <SelectElement
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
            </SelectElement>;
            break;
        default:
            inputElement = <InputElement
                {...props.elementConfig} 
                name={props.name}
                value={props.value}
                style={additionalStyle}
                 />;
    }
    
    return(
        <InputDiv>
            {/* <LabelStyle>{props.label}</LabelStyle> */}
            { inputElement }
            { validationError } 
        </InputDiv>
    );
}
    

export default input;

