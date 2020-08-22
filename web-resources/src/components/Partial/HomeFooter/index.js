import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'

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
    display: flex;
    flex-direction: column;
`;

const StyledUl = styled.ul`
    margin: 0 0 0.8rem;
    list-style: none;
    li {
        padding: .3rem;
        a {
            color: #333;
            font-weight: bold;
            font-size: 1.4rem;
        }
    }
`;

class HomeFooter extends Component {
    render() {
        return (
            <MainContainer>
                <RowDiv backcolor="#F0F4F3" padding="2%" width="100%" justify="center" alignItems="center">
                    <RowDiv direction="row" alignItems="center" justify="space-between" width="75%">
                        <RowDiv width="50%" justify="flex-start" alignItems="flex-start" direction="column" padding="0">
                            <Image src={`${Constants.LOCAL_IMAGE_URL}go_tip_top_text6.png`} width="60%" margin="3rem 1rem 2rem 1rem" />
                            <RowDiv justify="flex-start" direction="row">
                                <Image src="static/img/Download-on-the-App-Store-button.png" width="40%" height="4.5vw" margin="1rem 1rem" />
                                <Image src="static/img/getingoogleplay_new.png" width="40%" height="4.5vw" margin="1rem 0rem" />
                            </RowDiv>
                        </RowDiv>
                        <RowDiv justify="flex-end" direction="row" width="50%" alignItems="flex-start" padding="0">
                            <StyledUl>
                                <li>
                                    <Link to="/home" >
                                        <Text str={Constants.MAIN_PAGE} fontWeight="bold" fontSize="1.2rem" fontSizeL=".9rem" fontSizeM=".8rem" fontSizeS=".6rem" textAlign="center"  />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/company" >
                                        <Text str={Constants.COMPANY_PAGE} fontWeight="bold" fontSize="1.2rem" fontSizeL=".9rem" fontSizeM=".8rem" fontSizeS=".6rem" textAlign="center"  />
                                    </Link>
                                </li>
                            </StyledUl>
                            <StyledUl>
                                <li>
                                    <Link to="/terms" >
                                        <Text str={Constants.TERMS_PAGE} fontWeight="bold" fontSize="1.2rem" fontSizeL=".9rem" fontSizeM=".8rem" fontSizeS=".6rem" textAlign="center"  />
                                    </Link>
                                </li>
                                <li>

                                    <Link to="/privacy" >
                                        <Text str={Constants.PRIVACY_PAGE} fontWeight="bold" fontSize="1.2rem" fontSizeL=".9rem" fontSizeM=".8rem" fontSizeS=".6rem" textAlign="center"  />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact">
                                        <Text str={Constants.CONTACT_PAGE} fontWeight="bold" fontSize="1.2rem" fontSizeL=".9rem" fontSizeM=".8rem" fontSizeS=".6rem" textAlign="center"  />
                                    </Link>
                                </li>
                            </StyledUl>
                        </RowDiv>
                    </RowDiv>
                </RowDiv>
                <RowDiv width="100%" backcolor="#00BAAE" justify="center">
                    <Text str={Constants.LAND_COPYRIGHT} fontSize="1.2rem" color="#FFF" margin="1rem 0"  marginL=".3rem 0" marginM="0" textAlign="center"  />
                </RowDiv>
            </MainContainer>
        );
    }
}

export default withRouter(HomeFooter);