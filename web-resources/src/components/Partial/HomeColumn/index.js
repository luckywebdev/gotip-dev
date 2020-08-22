import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons' ;
import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import Btn from '../../UI/btn';
import Img from '../../UI/img';
import Text from '../../UI/text';
import Div from '../../UI/div';
import Anchor from '../../UI/a';

const MainContent = styled.nav`
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-left: 1%;
`;

const BlockColumn = styled.div`
    width: 100%;
    height: 610px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #FFF;
    flex-direction: column;
`;

const BlockNews = styled.div`
    width: 100%;
    height: 300px;
    margin-bottom: 2%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #45BFEB;
    flex-direction: column;
`;

export default (props) => {

    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";

    return (
    <MainContent>
        <BlockColumn>
            <Text str="コラム" color="#313131" margin=".5rem" />
            <Div width="90%" height="80%" margin=".5rem"></Div>
        </BlockColumn>
        <BlockNews>
            <FontAwesomeIcon icon={ faTwitter } color="#FFF" size="lg" />
            {/* <FontAwesomeIcon icon={['fab', 'twitter']} /> */}
            <Div width="90%" height="20%" backcolor="#FFF" padding="0 .5rem" margin="0 0 .5rem 0" justify="space-around" alignItems="center">
                
            </Div>
            <Div width="90%" height="20%" backcolor="#FFF" padding="0 .5rem" margin="0 0 .5rem 0" justify="space-around" alignItems="center">
                
            </Div>
            <Div width="90%" height="20%" backcolor="#FFF" padding="0 .5rem" margin="0 0 .5rem 0" justify="space-around" alignItems="center">
                
            </Div>
        </BlockNews>
    </MainContent>
  );
}

