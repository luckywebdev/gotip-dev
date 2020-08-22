import React, { Component } from 'react';

import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import RowDiv from '../../UI/div';
import Image from '../../UI/img';
import Text from '../../UI/text';
import Anchor from '../../UI/a';
import * as Constants from '../../../Constants';
import styled from 'styled-components';
import media from 'styled-media-query';

const MainContainer = styled.div`
    width: 100%;
    background-color: #FFF;
    margin-bottom: 10%;
`;

const CardContainer = styled.div`
    width: 19vw;
    border: 2px solid #04BBAF;
    padding: 1rem;
    height: 25vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
`;

const EmptyDiv = styled.div`
    width: 20vw;
    display: flex;
    justify-content: center;
    align-items: center;
`;

class AboutSection extends Component {
    render() {
        return (
            <MainContainer>
                <RowDiv direction="column" width="100%">
                    <RowDiv direction="column" alignItems="center" justify="center" width="60%">
                        <Image src={`${Constants.LOCAL_IMAGE_URL}go_tip_top_text4.png`} margin="3rem 1rem 2rem 1rem" widthL="60%" />
                        <Text str={Constants.LAND_ABOUT_TITLE} fontSize="1.6rem" fontSizeL="1.3rem" fontSizeM="1rem" fontSizeS=".8rem" fontWeight="bold" />
                        <Text str={Constants.LAND_ABOUT_CONTENT} fontSize="1.5rem" fontSizeL="1rem" fontSizeM=".8rem" fontSizeS=".6rem" marginL="2rem 0" marginM="1rem 0" margin="3rem 0" textAlign="center"  />
                    </RowDiv>
                </RowDiv>
                <RowDiv direction="column" width="100%" alignItems="center">
                    <RowDiv direction="row" alignItems="center" justify="space-around" width="75%">
                        <CardContainer>
                            <RowDiv width="100%" height="50%" justify="center" alignItems="center">
                                <Image src={`${Constants.LOCAL_IMAGE_URL}home_about_1.png`} height="80%" />
                            </RowDiv>
                            <RowDiv width="100%" height="10%" justify="center" alignItems="center">
                                <Anchor text={Constants.LAND_ABOUT_CARD_1_TITLE} color="#04BBAF" fontSize="1.2em" fontSizeL="1rem" fontSizeM=".8rem" fontSizeS=".7rem" decoration="underline" fontWeight="bolder" margin="1rem 0"></Anchor>
                            </RowDiv>
                            <RowDiv backcolor="#F0F4F3" width="100%" height="40%" justify="center" alignItems="center" padding="0.5rem">
                                <Text str={Constants.LAND_ABOUT_CARD_1_CONTENT} fontSize=".9rem" fontSizeL=".7rem" fontSizeM=".6rem" fontSizeS=".5rem"  />
                            </RowDiv>
                        </CardContainer>
                        <CardContainer>
                            <RowDiv width="100%" height="50%" justify="center" alignItems="center">
                                <Image src={`${Constants.LOCAL_IMAGE_URL}home_about_2.png`} height="80%" />
                            </RowDiv>
                            <RowDiv width="100%" height="10%" justify="center" alignItems="center">
                                <Anchor text={Constants.LAND_ABOUT_CARD_2_TITLE} color="#04BBAF" fontSize="1.2rem" fontSizeL="1rem" fontSizeM=".8rem" fontSizeS=".7rem" decoration="underline" fontWeight="bolder" margin="1rem 0"></Anchor>
                            </RowDiv>
                            <RowDiv backcolor="#F0F4F3" width="100%" height="40%" justify="center" alignItems="center" padding="0.5rem">
                                <Text str={Constants.LAND_ABOUT_CARD_2_CONTENT}  fontSize=".9rem" fontSizeL=".7rem" fontSizeM=".6rem" fontSizeS=".5rem" />
                            </RowDiv>
                        </CardContainer>
                        <EmptyDiv>
                            <Image src={`${Constants.LOCAL_IMAGE_URL}home_about_right.png`} width="70%" />
                        </EmptyDiv>
                    </RowDiv>
                    <RowDiv direction="row" alignItems="center" justify="space-around" width="75%">
                        <EmptyDiv style={{transform: 'rotate(180deg)'}}>
                            <Image src={`${Constants.LOCAL_IMAGE_URL}home_about_right.png`} width="70%" />
                        </EmptyDiv>

                        <CardContainer>
                            <RowDiv width="100%" height="50%" justify="center" alignItems="center">
                                <Image src={`${Constants.LOCAL_IMAGE_URL}home_about_3.png`} height="80%" />
                            </RowDiv>
                            <RowDiv width="100%" height="10%" justify="center" alignItems="center">
                                <Anchor text={Constants.LAND_ABOUT_CARD_3_TITLE} color="#04BBAF" fontSize="1.2em" fontSizeL="1rem" fontSizeM=".8rem" fontSizeS=".7rem" decoration="underline" fontWeight="bolder" margin="1rem 0"></Anchor>
                            </RowDiv>
                            <RowDiv backcolor="#F0F4F3" width="100%" height="40%" justify="center" alignItems="center" padding="0.5rem">
                                <Text str={Constants.LAND_ABOUT_CARD_3_CONTENT}  fontSize=".9rem" fontSizeL=".7rem" fontSizeM=".6rem" fontSizeS=".5rem"  />
                            </RowDiv>
                        </CardContainer>
                        <CardContainer>
                            <RowDiv width="100%" height="50%" justify="center" alignItems="center">
                                <Image src={`${Constants.LOCAL_IMAGE_URL}home_about_4.png`} height="80%" />
                            </RowDiv>
                            <RowDiv width="100%" height="10%" justify="center" alignItems="center">
                                <Anchor text={Constants.LAND_ABOUT_CARD_4_TITLE} color="#04BBAF" fontSize="1.2rem" fontSizeL="1rem" fontSizeM=".8rem" fontSizeS=".7rem" decoration="underline" fontWeight="bolder" margin="1rem 0"></Anchor>
                            </RowDiv>
                            <RowDiv backcolor="#F0F4F3" width="100%" height="40%" justify="center" alignItems="center" padding="0.5rem">
                                <Text str={Constants.LAND_ABOUT_CARD_4_CONTENT}  fontSize=".9rem" fontSizeL=".7rem" fontSizeM=".6rem" fontSizeS=".5rem"  />
                            </RowDiv>
                        </CardContainer>
                    </RowDiv>
                </RowDiv>
            </MainContainer>
        );
    }
}

export default AboutSection;