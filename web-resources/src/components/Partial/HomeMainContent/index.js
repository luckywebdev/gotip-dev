import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import Btn from '../../UI/btn';
import Img from '../../UI/img';
import Text from '../../UI/text';
import Div from '../../UI/div';
import Anchor from '../../UI/a';

const MainContent = styled.nav`
    width: 65%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-right: 1%;
    margin-left: 1%;
    margin-top: 2%;
`

const BlockContent = styled.div`
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
`;

export default (props) => {

    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";

    return (
    <MainContent>
        <BlockContent>
            <Img src={`${Constants.LOCAL_IMAGE_URL}home_main.png`} alt="home_back" width="100%" height="100%" padding="0" margin="0" />
        </BlockContent>
        <BlockContent style={{backgroundColor: theme_color}}>
            <Text str="GOTIPからのお知らせ" color="#FFF" margin=".5rem" />
            <Div width="95%" height="80%" backcolor="#FFF" margin=".5rem .5rem 2% .5rem"></Div>
        </BlockContent>
        <BlockContent style={{backgroundColor: "#FFF"}}>
            <Text str="おすすめクリエイター" color="#313131" margin=".5rem" />
            <Div width="90%" height="80%" padding=".5rem" margin=".5rem" justify="space-around" alignItems="center">
                
            </Div>
        </BlockContent>
    </MainContent>
  );
}

