import React from 'react';
import * as Constants from '../../../Constants';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../store/actions/main';

import Modal from '../../UI/Modal/Modal';
import Btn from '../../UI/btn';
import Div from '../../UI/div';
import Text from '../../UI/text';
import Input from '../../UI/input';

const SubContent = styled.div`
    width: 90%;
    margin: 1rem auto;
    padding: .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    flex-direction: row;
    box-sizing: border-box;
`;
const ModalTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.5rem !important;
  font-weight: bolder;
  margin-top: 2%;
`
const TabUl = styled.ul`
  margin-right: 1rem;
  margin-left: 1rem;
  &:before {
    border: none;
  }
  &>.uk-active>a {
    border-color: #30AA89 !important;
    border-bottom-width: 2px !important;
  }
`
const UnderlineDiv = styled.div`
  width: 100%;
  border-bottom: 1px solid #aaa;
  margin: auto;
  padding: 0 .5rem .5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  algin-items: center;
`;

const SubSpan1 = styled.span`
    &:before {
        color: #FFD949;
        display: inline-block; 
        border-radius: 50%;
        width: 1em;
        height: 1em;
        background-color: #FFD949;
        margin-left: 1em;
        margin-right: 1em;
        content: "";
    }
`;

const SubSpan2 = styled.span`
    &:before {
        color: #C294FF;
        display: inline-block; 
        border-radius: 50%;
        width: 1em;
        height: 1em;
        background-color: #C294FF;
        margin-left: 1em;
        margin-right: 1em;
        content: "";
    }
`;

let dispatch

export default (props) => {
    dispatch = useDispatch();

    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
    const gotipShows = () => {
        let gotip_show_state = mainState.show_state;
        if(gotip_show_state === undefined)
            gotip_show_state = false;
        dispatch(actions.gotipShow(!gotip_show_state));
    };

    const ReceivedPoint = () => {
        return (
            <SubContent style={{border: `2px solid ${theme_color}`, height: "300px"}}  >
                <Div width="40%" margin=".5rem auto" padding="1rem 0" justify="space-between" alignItems="center" direction="column" height="100%" >
                    <Btn text={Constants.REWARD_AMOUNT} padding=".8rem 1rem" margin="0" fontSize="14px" backcolor={theme_color} border="none" color="#FFF" radius="1px" />
                    <Text str="3500円" fontSize="22px" color="#313131" />
                    <Div justify="space-between" direction="row" width="100%" padding="0" margin="0">
                        <Btn text={Constants.POINT_CONVERSION} padding=".8rem 1rem" margin="0 .5rem 0 0" border={`1px solid ${theme_color}`} fontSize="14px" backcolor="transparent" color={theme_color} radius="5px" />
                        <Btn text={Constants.VIEW_DETAIL} padding=".8rem 1rem" margin="0 0 0 .5rem" border={`1px solid ${theme_color}`} fontSize="14px" backcolor="transparent" color={theme_color} radius="5px" />
                    </Div>
                </Div>
                <div className="uk-divider-vertical" ></div>
                <Div width="40%" height="100%" margin=".5rem auto" padding="1rem 0" justify="space-between" alignItems="center" direction="column"  >
                    <Btn text={Constants.REWARD_AMOUNT} padding=".8rem 1rem" margin="0" backcolor={theme_color} fontSize=".8rem" border="none" color="#FFF" radius="1px" />
                    <Text str={Constants.OWNED_POINT} fontSize="14px" color="#313131" />
                    <Text str="3500円" fontSize="18px" color="#313131" />
                    <Text str={Constants.SUBSCRIPTION_POINT} fontSize="14px" color="#313131" />
                    <Text str="500pt" fontSize="18px" color="#313131" />
                    <Div justify="space-between" direction="row" width="100%" padding="0" margin="0" >
                        <Btn text={Constants.POINT_CONVERSION} padding=".8rem 1rem" margin="0 .5rem 0 0" border={`1px solid ${theme_color}`} fontSize="14px" backcolor="transparent" color={theme_color} radius="5px" />
                        <Btn text={Constants.VIEW_DETAIL} padding=".8rem 1rem" margin="0 0 0 .5rem" border={`1px solid ${theme_color}`} fontSize="14px" backcolor="transparent" color={theme_color} radius="5px" />
                    </Div>
                </Div>
            </SubContent>
        )
    }

    const WithdrawlPoint = () => {
        return (
            <SubContent style={{border: `2px solid ${theme_color}`, flexDirection: "column"}}  >
                <Div width="80%" justify="space-between" alignItems="flex-start" direction="row" padding="0" margin=".5rem 0">
                    <UnderlineDiv>
                        <span>{Constants.REWARD_AMOUNT}</span>
                        <span>3500円</span>
                    </UnderlineDiv>
                </Div>
                <Div width="80%" justify="space-between" alignItems="flex-start" direction="row" padding="0.5rem" margin=".5rem 0">
                    <Div width="28%" justify="space-between" alignItems="center" direction="row" padding="0" margin="0">
                        <span>{Constants.EARNED_POINT}</span>
                    </Div>
                    <Div width="72%" justify="space-between" alignItems="center" direction="column" padding="0" margin="0">
                        <UnderlineDiv>
                            <SubSpan1>{Constants.EARNED_USAGE_POINT}</SubSpan1>
                            <span>4000pt</span>
                        </UnderlineDiv>
                        <UnderlineDiv style={{marginTop: ".5rem"}}>
                            <SubSpan2>{Constants.EARNED_SUBSCRIPTION_POINT}</SubSpan2>
                            <span>500pt</span>
                        </UnderlineDiv>
                    </Div>
                </Div>
                <Div width="80%" justify="space-between" alignItems="center" direction="row" padding="0.5rem" margin=".5rem 0">
                    <Div width="30%" justify="space-between" alignItems="center" direction="row" padding="0" margin="0">
                        <span>{Constants.TRANSFER_MIN_AMOUNT}</span>
                    </Div>
                    <Div width="60%" justify="flex-end" alignItems="center" direction="row" padding="0" margin="0">
                        <Input type="text" elementType="input" width="90%" border="1px solid #A3B5C1" name="minTransAmount" margin="0 1rem 0 0" padding=".5rem"/>
                        <span>円</span>
                        <Btn text={Constants.POINT_CONVERSION} width="40%" padding=".8rem 1rem" margin="0 0 0 1rem" border={`1px solid ${theme_color}`} fontSize="14px" backcolor="transparent" color={theme_color} radius="5px" />
                    </Div>
                </Div>
                <Div width="80%" justify="center" alignItems="center" direction="row" padding="0" margin="0">
                    <Text str={Constants.SUBSCRIPTION_POINT_INSTRUCTION} fontSize="12px" color="#95A8B5" />
                </Div>
                <Div width="80%" justify="center" alignItems="center" direction="column" padding="0.5rem" margin="1rem 0 .5rem 0">
                    <Text str={`現在: ${Constants.getCurrentDate()} / 締め日:7月30日`} fontSize="14px" color="#313131" />
                    <Text str="次回の自動振込予定日　7月31日　　振込予定金額　3500円" fontSize="14px" color="#313131" />
                </Div>
            </SubContent>
        )
    }

    const PointConversion = () => {
        return (
            <SubContent style={{border: `2px solid ${theme_color}`, flexDirection: "column", minHeight: "300px"}}  >
                <Div width="80%" justify="space-between" alignItems="flex-start" direction="row" padding="0.5rem" margin=".5rem 0">
                    <Div width="28%" justify="space-between" alignItems="center" direction="row" padding="0" margin="0">
                        <span>{Constants.EARNED_POINT}</span>
                    </Div>
                    <Div width="72%" justify="space-between" alignItems="center" direction="column" padding="0" margin="0">
                        <UnderlineDiv>
                            <SubSpan1>{Constants.EARNED_USAGE_POINT}</SubSpan1>
                            <span>4000pt</span>
                        </UnderlineDiv>
                        <UnderlineDiv style={{marginTop: ".5rem"}}>
                            <SubSpan2>{Constants.EARNED_SUBSCRIPTION_POINT}</SubSpan2>
                            <span>500pt</span>
                        </UnderlineDiv>
                    </Div>
                </Div>
                <Div width="80%" justify="space-between" alignItems="center" direction="row" padding="0.5rem" margin=".5rem 0">
                    <Div width="30%" justify="space-between" alignItems="center" direction="row" padding="0" margin="0">
                        <span>{Constants.CONVERTIBLE_POINT}</span>
                    </Div>
                    <Div width="60%" justify="space-between" alignItems="center" direction="row" padding="0" margin="0">
                        <Text str="3500pt" fontSize="18px" color="#313131" />
                        <Btn text={Constants.POINT_CONVERSION} width="40%" padding=".8rem 1rem" margin="0 0 0 1rem" border={`1px solid ${theme_color}`} fontSize="14px" backcolor="transparent" color={theme_color} radius="5px" />
                    </Div>
                </Div>
            </SubContent>
        )
    }


    return (
        <Modal width="50%" show={props.detailModal} modalClosed={props.pointDetailModal}>
            <ModalTitle>{Constants.POINT_TITLE}</ModalTitle>
            <Div widht="100%" padding="0" margin="0" direction="column">
                <TabUl className="uk-flex-center" data-uk-tab="{connect:'#my-id'}">
                    <li><a href="#">{Constants.RECEIVED_POINT}</a></li>
                    <li><a href="#">{Constants.WITHDRAWL_APPLICATION}</a></li>
                    <li><a href="#">{Constants.POINT_CONVERSION}</a></li>
                </TabUl>

                <ul id="my-id" className="uk-switcher uk-margin" style={{width:"100%"}}>
                    <li>
                        {
                            ReceivedPoint()
                        }
                    </li>
                    <li>
                        {
                            WithdrawlPoint()
                        }
                    </li>
                    <li>
                        {
                            PointConversion()
                        }
                    </li>
                </ul>
            </Div>
            <Div widht="100%" padding="0" margin="1rem 0" direction="row" justify="center" alignItems="center" >
                <Btn text={Constants.CLOSE} backcolor={theme_color} color="#FFF" border="none" padding=".5rem 1rem" width="30%" onClick={props.pointDetailModal} />
            </Div>
        </Modal>
    );
}

