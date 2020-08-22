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
    background-color: #F0F4F3;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 60vw;
`;

const CardContainer = styled.div`
    width: 17vw;
    border: none;
    padding: 1rem;
    height: 23vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
`;

const BottomCard = styled.div`
    width: 75%;
    background-color: #FFF;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0vh;
    transform: translateY(40%);
    box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2), 1px 5px 20px 1px rgba(0, 0, 0, 0.19);
`;

const PhoneImage = styled.img`
    position: absolute;
    top: 0;
    transform: translateY(-10vw);
    width: 19vw;
`;

const additionalStyle = {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
}

class AdviceSection extends Component {
    render() {
        return (
            <MainContainer>
                <RowDiv direction="row" width="75%" margin="0">
                    <RowDiv justify="center" width="50%">
                        <PhoneImage src={`${Constants.LOCAL_IMAGE_URL}home_phone.png`}  />
                    </RowDiv>
                    <RowDiv direction="column" alignItems="flex-start" justify="center" width="50%" margin="5% 0 0 0">
                        <Text str={Constants.LAND_ADVICE_TITLE} fontSize="1.2rem" fontSizeL="1rem" fontSizeM=".8rem" fontSizeS=".7rem" fontWeight="bold" />
                        <Text str={Constants.LAND_ADVICE_CONTENT_1} fontSize="1rem" fontSizeL=".8rem" fontSizeM=".6rem" fontSizeS=".5rem" margin="1rem 0" textAlign="left"  />
                        <Text str={Constants.LAND_ADVICE_CONTENT_2} fontSize="1rem" fontSizeL=".8rem" fontSizeM=".6rem" fontSizeS=".5rem" margin="1rem 0" textAlign="left"  />
                    </RowDiv>
                </RowDiv>
                <BottomCard >
                    <RowDiv direction="row" alignItems="center" justify="space-around" width="100%">
                        <CardContainer>
                            <RowDiv width="100%" height="50%" justify="center" alignItems="center">
                                <Image src={`${Constants.LOCAL_IMAGE_URL}home_advice_1.png`} height="80%" />
                            </RowDiv>
                            <RowDiv width="100%" height="10%" justify="center" alignItems="flex-start" margin="1rem 0" marginL="0" padding="0">
                                <Text str={Constants.LAND_ADVICE_CARD_1_TITLE} fontSize="1.2rem" fontSizeL=".9rem" fontSizeM=".8rem" fontSizeS=".7rem" fontWeight="bolder" margin="1rem 0"  marginL="0" style={additionalStyle}/>
                            </RowDiv>
                            <RowDiv width="100%" height="40%" justify="flex-start" alignItems="flex-start" margin="1rem 0" marginL="0" padding="0.5rem">
                                <Text str={Constants.LAND_ADVICE_CARD_1_CONTENT} fontSize=".9rem" fontSizeL=".7rem" fontSizeM=".6rem" fontSizeS=".5rem" marginL="0"  />
                            </RowDiv>
                        </CardContainer>
                        <CardContainer>
                            <RowDiv width="100%" height="50%" justify="center" alignItems="center">
                                <Image src={`${Constants.LOCAL_IMAGE_URL}home_advice_2.png`} height="80%" />
                            </RowDiv>
                            <RowDiv width="100%" height="10%" justify="center" alignItems="flex-start" padding="0" margin="1rem 0" marginL="0">
                                <Text str={Constants.LAND_ADVICE_CARD_2_TITLE} fontSize="1.2rem" fontSizeL=".9rem" fontSizeM=".8rem" fontSizeS=".7rem" fontWeight="bolder" margin="1rem 0" marginL="0" style={additionalStyle} />
                            </RowDiv>
                            <RowDiv width="100%" height="40%" justify="flex-start" alignItems="flex-start" margin="1rem 0" marginL="0" padding="0.5rem">
                                <Text str={Constants.LAND_ADVICE_CARD_2_CONTENT} fontSize=".9rem" fontSizeL=".7rem" fontSizeM=".6rem" fontSizeS=".5rem"  marginL="0" />
                            </RowDiv>
                        </CardContainer>
                        <CardContainer>
                            <RowDiv width="100%" height="50%" justify="center" alignItems="center">
                                <Image src={`${Constants.LOCAL_IMAGE_URL}home_advice_3.png`} height="80%" />
                            </RowDiv>
                            <RowDiv width="100%" height="10%" justify="center" alignItems="flex-start" padding="0" margin="1rem 0" marginL="0">
                                <Text str={Constants.LAND_ADVICE_CARD_3_TITLE} fontSize="1.2rem" fontSizeL=".9rem" fontSizeM=".8rem" fontSizeS=".7rem" fontWeight="bolder" margin="1rem 0"  marginL="0" style={additionalStyle}/>
                            </RowDiv>
                            <RowDiv width="100%" height="40%" justify="flex-start" alignItems="flex-start" margin="1rem 0" marginL="0" padding="0.5rem">
                                <Text str={Constants.LAND_ADVICE_CARD_3_CONTENT} fontSize=".9rem" fontSizeL=".7rem" fontSizeM=".6rem" fontSizeS=".5rem"  marginL="0" />
                            </RowDiv>
                        </CardContainer>
                    </RowDiv>
                    <RowDiv alignItems="center" justify="center" width="100%">
                        <Image src={`${Constants.LOCAL_IMAGE_URL}home_advice.png`} width="90%" margin="auto" />
                    </RowDiv>
                </BottomCard>
            </MainContainer>
        );
    }
}

export default AdviceSection;