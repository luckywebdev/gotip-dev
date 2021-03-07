import React, {useState, useEffect} from 'react';
import * as Constants from '../../Constants';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import moment from "moment";
import 'moment/locale/ja';

import actions from '../../store/actions/points';

import Modal from '../UI/Modal/Modal';
import Btn from '../UI/btn';
import Div from '../UI/div';
import Text from '../UI/text';
import Input from '../UI/input';
import LineDiv from '../UI/Divider';

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

const DateSelect = styled.select`
  width: auto;
`


const GenerateDateSelect = (props) => {
    console.log(props, "dateSelect====>");
    const monthArray = [<option key={ 0 }>--</option>]
    for (let month = 1; month < 13; month++) {
      monthArray.push(<option key={ month }>{ month }</option>)
    }
  
    const dayArray = [<option key={ 0 }>--</option>]
    for (let day = 1; day < 32; day++) {
      dayArray.push(<option key={ day }>{ day }</option>)
    }
    
    return (
      <React.Fragment>
        <div className="uk-form-label">{Constants.DATE_SEARCH}</div>
        <DateSelect className="uk-select" name="month" value={ props.month } onChange={ props.handleSelectChange }>
        { monthArray }
        </DateSelect>
        <span>月</span>
        <DateSelect className="uk-select" name="day" value={ props.day } onChange={ props.handleSelectChange }>
        { dayArray }
        </DateSelect>
        <span>日</span>
      </React.Fragment>
    )
  }


let dispatch

export default (props) => {
    dispatch = useDispatch();
    const currentDate = new Date();
    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [day, setDay] = useState(currentDate.getDate());
    const [selectedDate, setSelectedDate] = useState(moment().valueOf());
    const [selectedMonth, setSelectedMonth] = useState(moment().valueOf());
    const [pointData, setPointData] = useState({data: {}, log: [], saleData: {}});
    const [availablePoint, setAvailablePoint] = useState(0)
    const [pointDateHitory, setPointDateHistory] = useState([]);
    const [pointMonthHitory, setPointMonthHistory] = useState([]);
    const [addValue, setAddValue] = useState(1);
    const [subValue, setSubValue] = useState(1);
    const [addValueM, setAddValueM] = useState(1);
    const [subValueM, setSubValueM] = useState(1);
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";

    useEffect(() => {
        if(typeof mainState.points !== 'undefined'){
            setPointData(mainState.points);
            if(typeof mainState.points.saleData !== 'undefined'){
                const normalSale = mainState.points.saleData.normal.value ? mainState.points.saleData.normal.value : 0;
                const subscriptionSale = mainState.points.saleData.subscription.value ? mainState.points.saleData.subscription.value : 0;
                setAvailablePoint(Number(normalSale) + Number(subscriptionSale) / 2);
                console.log("availableState", Number(normalSale) + Number(subscriptionSale) / 2);
            }
        }
    }, [mainState.points]);

    useEffect(() => {
        const selectedY = moment(selectedDate).format('YYYY');
        const selectedM = moment(selectedDate).format('M');
        const selectedD = moment(selectedDate).format('D');
        if(pointData.log.length > 0){
            const pointDataTemp = pointData.log.filter(item => {
                if(item.year === Number(selectedY) && item.month === Number(selectedM) && item.date === Number(selectedD)){
                    return item;
                }
            })
            setPointDateHistory(pointDataTemp);
        }
    }, [pointData, selectedDate]);

    useEffect(() => {
        const selectedY = moment(selectedMonth).format('YYYY');
        const selectedM = moment(selectedMonth).format('M');
        if(pointData.log.length > 0){
            const pointDataTemp = pointData.log.filter(item => {
                if(item.year === Number(selectedY) && item.month === Number(selectedM)){
                    return item;
                }
            })
            setPointMonthHistory(pointDataTemp);
        }
    }, [pointData, selectedMonth]);

    const handleSelectChange = (e) => {
        const currentY = moment().format("YYYY");
        if(e.target.name === "month") {
            setMonth(e.target.value);
            setSelectedDate(moment(currentY + '-' + e.target.value + '-' + day).valueOf());
        }
        else{
            setDay(e.target.value);
            setSelectedDate(moment(currentY + '-' + month + '-' + e.target.value).valueOf());
        }
    }

    const handleDate = (index) => {
        if(index === 'now'){
            setAddValue(1);
            setSubValue(1);
            setSelectedDate(moment().valueOf());
        }
        else if(index === 'prev') {
            setAddValue(1);
            setSubValue(subValue + 1);
            setSelectedDate(moment().subtract(subValue, 'day').valueOf());
        }
        else if(index === 'next') {
            setSubValue(1);
            setAddValue(addValue + 1);
           setSelectedDate(moment().add(addValue, 'day').valueOf());
        }
    }

    const handleMonth = (index) => {
        if(index === 'now'){
            setAddValueM(1);
            setSubValueM(1);
            setSelectedMonth(moment().valueOf());
        }
        else if(index === 'prev') {
            setAddValueM(1);
            setSubValueM(subValue + 1);
            setSelectedMonth(moment().subtract(subValue, 'month').valueOf());
        }
        else if(index === 'next') {
            setSubValueM(1);
            setAddValueM(addValue + 1);
            setSelectedMonth(moment().add(addValue, 'month').valueOf());
        }
    }

    const convertPoint = () => {
        dispatch(actions.convertPoints(availablePoint));
    }

    const ReceivedPoint = () => {
        return (
            <SubContent style={{border: `2px solid ${theme_color}`, height: "300px"}}  >
                <Div width="40%" margin=".5rem auto" padding="1rem 0" justify="space-between" alignItems="center" direction="column" height="100%" >
                    <Btn text={Constants.DAILY_POINT_HISTORY} padding=".8rem 1rem" margin="0" fontSize="14px" backcolor={theme_color} border="none" color="#FFF" radius="1px" />
                    <Div justify="space-between" direction="row" width="100%" padding="0" margin="1px">
                        <GenerateDateSelect month={month} day={day} handleSelectChange={(e) => handleSelectChange(e)} />
                    </Div>
                    <Div justify="center" direction="row" width="100%" padding="0" margin="1px">
                        <a href="#" onClick={() => handleDate('prev')}>{Constants.PREV_DATE}</a>
                        <span>{`<`}</span>
                        <a href="#" onClick={() => handleDate('now')}>{Constants.TODAY}</a>
                        <span>{`>`}</span>
                        <a href="#" onClick={() => handleDate('next')}>{Constants.NEXT_DATE}</a>
                    </Div>
                    <LineDiv width="80%" margin="1px auto"></LineDiv>
                    <Div direction="column" justify="flex-start" width="100%" padding="0" margin="0" height="100px" style={{overflowY: "auto"}}>
                        { pointDateHitory.length > 0 && pointDateHitory.map((item, index) => {
                            return (
                                <Div key={index} justify="space-between" direction="row" width="100%" padding="0" margin="0">
                                    <Text str={`${item.sendName}さん`} fontSize="16px" color="#313131" />
                                    <Text str={`${item.chipAmount}pt`} fontSize="16px" color="#313131" />
                                </Div>
                            )
                        })}
                    </Div>
                </Div>
                <div className="uk-divider-vertical" ></div>
                <Div width="40%" margin=".5rem auto" padding="1rem 0" justify="space-between" alignItems="center" direction="column" height="100%" >
                    <Btn text={Constants.MONTHLY_POINT_HISTORY} padding=".8rem 1rem" margin="0" fontSize="14px" backcolor={theme_color} border="none" color="#FFF" radius="1px" />
                    <Div justify="space-between" direction="row" height="30px" width="100%" padding="0" margin="1px">
                    </Div>
                    <Div justify="center" direction="row" width="100%" padding="0" margin="1px">
                        <a href="#" onClick={() => handleMonth('prev')}>{Constants.PREV_MONTH}</a>
                        <span>{`<`}</span>
                        <a href="#" onClick={() => handleMonth('now')}>{Constants.THIS_MONTH}</a>
                        <span>{`>`}</span>
                        <a href="#" onClick={() => handleMonth('next')}>{Constants.NEXT_MONTH}</a>
                    </Div>
                    <LineDiv width="80%" margin="1px auto"></LineDiv>
                    <Div direction="column" width="100%" justify="flex-start" padding="0" margin="0" height="100px" style={{overflowY: "auto"}} >
                        { pointMonthHitory.length > 0 && pointMonthHitory.map((item, index) => {
                            return (
                                <Div key={index} justify="space-between" direction="row" width="100%" padding="0" margin="0">
                                    <Text str={`${item.sendName}さん`} fontSize="16px" color="#313131" />
                                    <Text str={`${item.chipAmount}pt`} fontSize="16px" color="#313131" />
                                </Div>
                            )
                        })}
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
                            <span>{pointData.saleData.normal && pointData.saleData.normal.value}</span>
                        </UnderlineDiv>
                        <UnderlineDiv style={{marginTop: ".5rem"}}>
                            <SubSpan2>{Constants.EARNED_SUBSCRIPTION_POINT}</SubSpan2>
                            <span>{pointData.saleData.subscription && pointData.saleData.subscription.value}</span>
                        </UnderlineDiv>
                    </Div>
                </Div>
                <Div width="80%" justify="space-between" alignItems="center" direction="row" padding="0.5rem" margin=".5rem 0">
                    <Div width="30%" justify="space-between" alignItems="center" direction="row" padding="0" margin="0">
                        <span>{Constants.CONVERTIBLE_POINT}</span>
                    </Div>
                    <Div width="60%" justify="space-between" alignItems="center" direction="row" padding="0" margin="0">
                        <Text str={`${availablePoint > 0 ? availablePoint : ''}`} fontSize="18px" color="#313131" />
                        <Btn text={Constants.POINT_CONVERSION} width="40%" padding=".8rem 1rem" margin="0 0 0 1rem" border={`1px solid ${theme_color}`} fontSize="14px" backcolor="transparent" color={theme_color} radius="5px" onClick={() => convertPoint()} />
                    </Div>
                </Div>
            </SubContent>
        )
    }


    return (
        <>
            <ModalTitle>{Constants.POINT_TITLE}</ModalTitle>
            <Div widht="100%" padding="0" margin="0" direction="column">
                <TabUl className="uk-flex-center" data-uk-tab="{connect:'#my-id'}">
                    <li><a href="#">{Constants.POINT_HISTORY}</a></li>
                    <li><a href="#">{Constants.WITHDRAWL_APPLICATION}</a></li>
                    <li><a href="#">{Constants.TIP_POINT_CONVERT}</a></li>
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
        </>
    );
}

