import React, { Component } from 'react';

import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import RowDiv from '../../UI/div';
import Image from '../../UI/img';
import Text from '../../UI/text';
import Btn from '../../UI/btn';
import * as Constants from '../../../Constants';
import styled from 'styled-components';
import media from 'styled-media-query';

const MainContainer = styled.div`
    width: 100%;
    background-color: #FFF;
    margin-bottom: 10%;
    margin-top: 25%;
`;

const StyledUl = styled.ul`
    list-style: none;
    width: 100%;
    li {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ddd;
        padding: .8rem;
        &::before {
            color: #04BBAF;
            font-weight: bold;
            font-size: 22px;
            display: inline-block; 
            width: 1em;
            margin-left: 1em;
            margin-right: 0;
            content: "\\2022";
        }
        &>div {
            display: flex;
            justify-content: space-between;
            width: calc(100% - 2em);
            font-size: 1.5rem;
            font-weight: bolder;
            color: #000;
            &>span {
                &>sm {
                    font-size: 1rem;
                    font-weight: 600;
                }
            }
        }
    }
`;

const normalRate = [
    {
        point: 1000,
        price: 1000
    },{
        point: 3000,
        price: 3000
    },{
        point: 5000,
        price: 5000
    },{
        point: 10000,
        price: 10000
    },{
        point: 30000,
        price: 30000
    },{
        point: 50000,
        price: 50000
    }
]
const monthlyRate = [
    {
        point: 1000,
        price: 800
    },{
        point: 3000,
        price: 2400
    }
]

class PriceSection extends Component {
    render() {
        return (
            <MainContainer>
                <RowDiv direction="column" width="100%">
                    <RowDiv direction="column" alignItems="center" justify="center" width="60%">
                        <Image src={`${Constants.LOCAL_IMAGE_URL}go_tip_top_text5.png`} margin="3rem 1rem 2rem 1rem" />
                        <Text str={Constants.LAND_PRICE_TITLE} fontSize="1.6rem" fontWeight="bold" />
                        <Text str={Constants.LAND_PRICE_CONTENT} fontSize="1.5rem" margin="3rem 0" textAlign="center"  />
                    </RowDiv>
                </RowDiv>
                <RowDiv direction="row" width="75%" alignItems="flex-start" justify="space-around">
                    <RowDiv direction="column" alignItems="center" justify="flex-start" width="50%" margin="1rem">
                        <Btn text={ Constants.NORMAL_RATE } radius="0px" fontSize="1.6rem" width="40%" padding=".8rem" backcolor="#30AA89" />
                        <StyledUl>
                            {
                                normalRate.map((item, index) => {
                                    return(
                                        <li key={index}>
                                            <div>
                                                <span>{item.point}<small>pt</small></span>
                                                <span><small>¥</small>{item.price.toLocaleString("jp-JP")}</span>
                                            </div>
                                            
                                        </li>
                                    )
                                })
                            }
                        </StyledUl>
                        <RowDiv justify="flex-end" width="100%" padding="0" margin="0">
                            <Text str={Constants.LAND_PRICE_BOTTOM_TEXT} fontSize=".8rem" color="#898989" textAlign="right" />
                        </RowDiv>

                    </RowDiv>
                    <RowDiv direction="column" alignItems="center" justify="flex-start" width="50%" margin="1rem">
                        <Btn text={ Constants.NORMAL_RATE } radius="0px" fontSize="1.6rem" width="40%" padding=".8rem" backcolor="#D7FAF6" color="#30AA89" />
                        <StyledUl>
                            {
                                monthlyRate.map((item, index) => {
                                    return(
                                        <li key={index}>
                                            <div>
                                                <span><small>¥</small>{item.price.toLocaleString("jp-JP")}</span>
                                                <span><small>月</small> {item.point}<small>pt</small></span>
                                            </div>
                                            
                                        </li>
                                    )
                                })
                            }
                        </StyledUl>
                    </RowDiv>
                </RowDiv>
            </MainContainer>
        );
    }
}

export default PriceSection;