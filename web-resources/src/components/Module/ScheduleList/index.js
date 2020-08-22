import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import editInformation from '../../../store/actions/editInformation';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons';
UIkit.use(UIkitIcons)
import styled, { keyframes } from 'styled-components';
import Card from '../../UI/Card';
import Text from '../../UI/text';
import Input from '../../UI/input';
import Btn from '../../UI/btn';
import Anchor from '../../UI/a';
import DivideLine from '../../UI/Divider';
import Div from '../../UI/div';
import Modal from '../../UI/Modal/Modal';

const keyFrameFadeInOut = keyframes`
  0% {
    color: rgba(255,255,255,1);
  }
  100% {
    color: rgba(255,255,255,0.4);
  }
`

const UlStyle = styled.ul`
  width: 95%;
  margin: auto;
  padding: 0;
  max-height: 150px;
  overflow-y: auto;
  li {
    width: 99%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: .5rem auto;
  }
`
const ScheduleEditSection = styled.div`
  width: 80%;
  margin: 2rem auto 1rem auto;
`
const ModalTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.5rem !important;
  font-weight: bolder;
  margin-top: 2%;
`
const ActiveDaySelect = styled.select`
  width: 20%;
  margin: 0;
  padding: .5rem .2rem;
  border: 1px solid #A3B5C1;
  border-radius: 5px;
  margin-right: .5rem;
  margin-left: .5rem;
  height: 50px;
  &:first-child{
    margin-left: 0;
  }
  &:focus {
    border: 1px solid #93B5C1;
  }
`
const RightMarginLabel = styled.label`
  margin-right: 1em;
`

const ErrorMsg = styled.div`
  color: red;
`;

const LoadingContainer = styled.div`
  user-select: none;
  margin: auto;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1050;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${ keyFrameFadeInOut } 1.4s ease-in-out 0s infinite alternate;
  &>span {
    display: inline-block;
    text-align: center;
  }
`

var loadingMessage = null;
var add_edit_flag = 'add';
class ScheduleList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDetailModal: false,
      showEditModal: false,
      showAddModal: false,
      title: '',
      message: '',
      notify: '',
      attached_image: '',
      activeDate: {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: ''
      },
      uploadFile: '',
      fileContent: {},
      errors: {},
    }
    this.HandleAddModal = this.HandleAddModal.bind(this);
    this.generateActiveDaySelect = this.generateActiveDaySelect.bind(this);
    this.generateActiveTimeSelect = this.generateActiveTimeSelect.bind(this);
  }

  componentDidMount() {
    let currentDate = new Date();

    if(this.state.activeDate.year === '' || this.state.activeDate.month === '' || this.state.activeDate.day === ''){
      this.setState({
        activeDate: {...this.state.activeDate, year: currentDate.getFullYear(), month: (currentDate.getMonth() + 1), day: currentDate.getDate(), hour: Constants.addZero(currentDate.getHours()), minute: Constants.addZero(currentDate.getMinutes())}
      })
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState){
    if(prevProps.mainState.loadingMessage !== this.props.mainState.loadingMessage && loadingMessage) {
      return "add_close";
    }
    else if(this.props.mainState.postedInfo && this.props.mainState.postedInfo !== prevProps.mainState.postedInfo) {
      return "edit_show"
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(snapshot === "add_close") {
      this.HandleAddModal();
      loadingMessage = null;
    }
    else if(snapshot === "edit_show") {
      loadingMessage = null;
      add_edit_flag = 'update';
      this.setState({
        title: this.props.mainState.postedInfo.title,
        message: this.props.mainState.postedInfo.message,
        notify: this.props.mainState.postedInfo.notify,
        activeDate: this.props.mainState.postedInfo.activeDate,
      })
    }
    
  }

  handleSelectChange = (e) => {
    const activeDate = { ...this.state.activeDate, [e.target.name]: e.target.value };
    this.setState({
      activeDate : activeDate
    });
  }


  generateActiveDaySelect = () => {
    let currentDate = new Date();
    let thisYear = new Date().getFullYear()
    if (!thisYear) thisYear = 2020
    const yearArray = [<option key={ 0 }>----</option>]
    for (let year = 1900; year < thisYear + 1; year++) {
      yearArray.push(<option key={ year }>{ year }</option>)
    }
  
    const monthArray = [<option key={ 0 }>--</option>]
    for (let month = 1; month < 13; month++) {
      monthArray.push(<option key={ month }>{ month }</option>)
    }
  
    const dayArray = [<option key={ 0 }>--</option>]
    for (let day = 1; day < 32; day++) {
      dayArray.push(<option key={ day }>{ day }</option>)
    }

    let divStyle = {
      width: '80%',
      marginTop: '.3rem',
      marginBottom: '.5rem',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }

    return (
      <React.Fragment>
        <div className="uk-form-label" style={{color: '#A3B5C1'}}>{Constants.ACTIVATE_DATE}</div>
        <div className="uk-form-control" style={divStyle} >
          <ActiveDaySelect className="uk-select" name="year" value={ this.state.activeDate.year !== '' ? this.state.activeDate.year : currentDate.getFullYear() } onChange={ this.handleSelectChange }>
            { yearArray }
          </ActiveDaySelect>
          <span>年</span>
          <ActiveDaySelect className="uk-select" name="month" value={ this.state.activeDate.month !== '' ? this.state.activeDate.month : currentDate.getMonth() + 1 } onChange={ this.handleSelectChange }>
            { monthArray }
          </ActiveDaySelect>
          <span>月</span>
          <ActiveDaySelect className="uk-select" name="day" value={ this.state.activeDate.day !== '' ? this.state.activeDate.day : currentDate.getDate() } onChange={ this.handleSelectChange }>
            { dayArray }
          </ActiveDaySelect>
          <span>日</span>
          <ErrorMsg>{this.state.errors.activeDate}</ErrorMsg>
        </div>
      </React.Fragment>
    )
  }

  generateActiveTimeSelect = () => {
    let currentDate = new Date();
    const hourArray = [<option key={ 24 }>--</option>]
    for (let hour = 0; hour < 24; hour++) {
      hourArray.push(<option key={ hour }>{ Constants.addZero(hour) }</option>)
    }
  
    const minuteArray = [<option key={ 60 }>--</option>]
    for (let min = 0; min < 60; min++) {
      minuteArray.push(<option key={ min }>{ Constants.addZero(min) }</option>)
    }

    
    let divStyle = {
      width: '80%',
      marginTop: '.3rem',
      marginBottom: '.5rem',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }

    return (
      <React.Fragment>
        <div className="uk-form-control" style={divStyle} >
          <ActiveDaySelect className="uk-select" name="hour" value={ this.state.activeDate.hour !== '' ? this.state.activeDate.hour : Constants.addZero(currentDate.getHours()) } onChange={ this.handleSelectChange }>
            { hourArray }
          </ActiveDaySelect>
          <span>時</span>
          <ActiveDaySelect className="uk-select" name="minute" value={ this.state.activeDate.minute !== '' ? this.state.activeDate.minute : Constants.addZero(currentDate.getMinutes()) } onChange={ this.handleSelectChange }>
            { minuteArray }
          </ActiveDaySelect>
          <span>分</span>
          <ErrorMsg>{this.state.errors.activeDate}</ErrorMsg>
        </div>
      </React.Fragment>
    )
  }

  HandleDetailModal = () => {
    this.setState({
      showDetailModal: !this.state.showDetailModal
    });
  }

  HandleAddModal = () => {
    add_edit_flag = 'add';

    this.setState({
      showAddModal: !this.state.showAddModal,
      showDetailModal: !this.state.showDetailModal,
      editFlag: 'add',
    });
  }

  HandleEditModal = () => {
    add_edit_flag = 'update';

    this.setState({
      showAddModal: !this.state.showAddModal,
      showDetailModal: !this.state.showDetailModal,
      editFlag: 'update',
    });
    loadingMessage = true;
  }

  handleInput = (e) => {
    console.log("add_edit_flag", add_edit_flag);
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onClickFileUpload = () => {
    document.getElementById("uploadFileTag").click();
  }

  onChangeHandler = (e) => {
    this.setState({
        uploadFile: e.target.files[0].name,
        fileContent: e.target.files[0]
    })
  }

  updatePostInfo = (postedTime) => {
    this.setState({
      postedTime: postedTime
    })
    const  { executeGetPostedInfo } = this.props;
    executeGetPostedInfo(postedTime)
    this.HandleEditModal();
  }

  handleScheduleSave = () => {
    const { executePost } = this.props;
    executePost(this.state);
    loadingMessage = true;
    console.log("schedule_data", this.state);
  }

  HandleDeletData = (postedTime) => {
    const { executeDelete } = this.props;
    executeDelete(postedTime);
    this.HandleAddModal();
  }

  render() {
    let edit = '';
    const { mainState } = this.props;
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
    let newInfoData = [];
    if(typeof mainState.newInfo !== 'undefined'){
      newInfoData = mainState.newInfo.sort(Constants.compare);
    }

    if(this.props.editable){
      edit = (
        <Btn color="#FFF" fontSize=".8rem" border="none" padding=".5rem 1rem" backcolor={theme_color} radius="20px" btnType="rounded" text={Constants.CHANGE} onClick={this.HandleDetailModal} />
        );
    }

    return(
      <Card width="100%" margin="10px" height="300px">
        <h4 className="uk-text-bold uk-flex uk-flex-between uk-flex-middle"><span>{ Constants.SCHEDULE_TITLE }</span></h4>
        <UlStyle>
          {
            typeof newInfoData !== 'undefined' && newInfoData.length > 0 ? (
              newInfoData.map((res, index) => {
                if(index < 5){
                  return (
                    <li key={index}>
                      <Div padding="0" margin="0" justify="flex-start" style={{flexWrap: "nowrap", textOverflow: "ellipsis"}}>
                        <Text fontSize='.7rem' str={Constants.getPostInfoDate(res.activeDate)}></Text>
                      {/* </Div>
                      <Div padding="0" margin="0" justify="flex-start" style={{flexWrap: "nowrap", textOverflow: "ellipsis"}}> */}
                        <Text fontSize='.7rem' str={res.title}></Text>
                      </Div>
                    </li>
                  )
                }
              })
            ) : ''
          }
        </UlStyle>
        <div className="uk-flex uk-flex-center" style={{position: 'absolute', bottom: '20px', left: "50%", transform: "translateX(-50%)"}}>
          {edit}
        </div>

        <Modal width="50%" show={this.state.showDetailModal} modalClosed={this.HandleDetailModal}>
          {
            mainState.loadingMessage !== null ? (
              <LoadingContainer>
                <span>
                  <div uk-spinner={ `ratio: 2 };` } />
                  <br />
                  <br />
                  { mainState.loadingMessage }
                </span>
              </LoadingContainer>
            ) : ''
          }
          <ModalTitle>{Constants.SCHEDULE_EDIT_TITLE}</ModalTitle>
          <ScheduleEditSection>
            {
              typeof newInfoData !== 'undefined' && newInfoData.length > 0 ? (
                newInfoData.map((res, index) => {
                  return (
                    <Div width="90%" margin=".1rem auto" padding=".5rem" justify="space-between" key={index}>
                      <Div width="70%" margin="0rem" padding="0" justify="flex-start">
                        <Text fontSize='.8rem' str={Constants.getPostInfoDate(res.activeDate)} color="#313131"></Text>
                        <Text fontSize='.8rem' color="#313131" str={res.title}></Text>
                      </Div>
                      <Div width="30%" margin="0rem" padding="0" justify="flex-end">
                        <Anchor href="#" decoration="none" color={theme_color} text={Constants.EDIT} clicked={ this.updatePostInfo.bind(this, res.key) } />
                      </Div>
                    </Div>
                  )
                })
              ) : ''
            }
            <Div width="100%" margin="1rem 0rem" padding="0" justify="center">
              <Anchor href="#" decoration="none" color={theme_color} text={Constants.NEW_SCHEDULE_ADD} clicked={this.HandleAddModal} />
            </Div>
            <DivideLine width="80%" />
          </ScheduleEditSection>

          <div className="uk-flex uk-flex-center uk-margin-top">
            <Btn width="25%" radius="20px" backcolor={theme_color} padding=".5rem 2rem" margin="1.5rem auto .5rem auto" text={Constants.CLOSE} btnType="rounded" onClick={this.HandleDetailModal} />
          </div>
        </Modal>

        <Modal width="50%" show={this.state.showAddModal} modalClosed={this.HandleAddModal}>
          {
            mainState.loadingMessage !== null ? (
              <LoadingContainer>
                <span>
                  <div uk-spinner={ `ratio: 2 };` } />
                  <br />
                  <br />
                  { mainState.loadingMessage }
                </span>
              </LoadingContainer>
            ) : ''
          }
          <ModalTitle>{Constants.SCHEDULE_EDIT_TITLE}</ModalTitle>
          <ScheduleEditSection>
            <Div className="uk-margin" justify="center" direction="column" alignItems="center" >
              <Div className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="100%" padding="0 1rem" >
                  <label className="uk-form-label" htmlFor="form-reg-title" style={{color: '#A3B5C1'}} >{ Constants.TITLE }</label>
                  <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                      <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-title" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="title" placeholder="" value={this.state.title} changed={ this.handleInput } />
                      <ErrorMsg>{this.state.errors.title}</ErrorMsg>
                  </div>
              </Div>
              <Div className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="100%" padding="0 1rem" >
                { this.generateActiveDaySelect() }
              </Div>
              <Div className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="100%" padding="0 1rem" >
                { this.generateActiveTimeSelect() }
              </Div>
              <Div className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="100%" padding="0 1rem" >
                  <label className="uk-form-label" htmlFor="form-reg-message" style={{color: '#A3B5C1'}}>{ Constants.DETAIL }</label>
                  <div className="uk-form-controls" style={{width: '60%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                      <textarea className="uk-textarea" value={ this.state.message } style={{width: '100%', resize: 'none', border: '1px solid #A3B5C1'}} id="form-reg-message" name="message" rows="5" onChange={this.handleInput}></textarea>
                      <ErrorMsg>{this.state.errors.message}</ErrorMsg>
                  </div>
              </Div>
              <Div className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="100%" padding="0 1rem" >
                  <label className="uk-form-label" htmlFor="form-reg-uploadFileTag" style={{color: '#A3B5C1'}}>{ Constants.ATTACHED_IMAGE }</label>
                  <div className="uk-form-controls" style={{width: '60%', marginTop: '.6rem', marginBottom: '.8rem'}}>
                    <Btn text={ Constants.UPLOAD_FILE } color='#FFF' fontWeight="400" fontSize=".8rem" backcolor={theme_color} padding=".4rem .5rem" margin=".3rem 1rem .3rem 0rem" onClick={this.onClickFileUpload} className='uk-width-1-1' />
                    <Text color="#313131" str={this.state.uploadFile} textAlign="left" fontSize=".8rem" margin=".5rem 0" />
                    <input type="file" name="file" id="uploadFileTag" style={{display: "none"}} onChange={this.onChangeHandler}/>
                    <ErrorMsg>{this.state.errors.attached_image}</ErrorMsg>
                  </div>
              </Div>
              <Div className="uk-margin" justify="flex-start" direction="row" alignItems="center" width="100%" padding="0 1rem" >
                <div className="uk-form-label" style={{color: '#A3B5C1'}}>{Constants.NOTIFICATION_SETTING}</div>
                <div className="uk-form-controls" style={{width: '80%', marginTop: '.3rem', marginBottom: '.5rem', marginLeft: '1rem'}}>
                  <RightMarginLabel><input className="uk-radio" type="radio" name="notify" value="1" style={{marginRight: '1rem'}} onChange={ this.handleInput } checked={ this.state.notify === '1' } />{Constants.NOTICE}</RightMarginLabel>
                  <RightMarginLabel><input className="uk-radio" type="radio" name="notify" value="0" style={{marginRight: '1rem'}} onChange={ this.handleInput }  checked={ this.state.notify === '0' } />{Constants.DO_NOT_NOTIFY}</RightMarginLabel>
                  <ErrorMsg>{this.state.errors.notify}</ErrorMsg>
                </div>
              </Div>
            </Div>
            <DivideLine width="80%" />
          </ScheduleEditSection>

          <div className="uk-flex uk-flex-center uk-margin-top">
            <Btn width="25%" radius="20px" backcolor="transparent" color={theme_color} border={`1px solid ${theme_color}`} padding=".5rem 2rem" margin="1.5rem 1rem .5rem 1rem" text={Constants.CANCEL} btnType="rounded" onClick={this.HandleAddModal} />
            <Btn width="25%" radius="20px" backcolor={theme_color} padding=".5rem 2rem" margin="1.5rem 1rem .5rem 1rem" text={Constants.REGISTRATION} btnType="rounded" onClick={this.handleScheduleSave} />
          </div>
          {
            add_edit_flag === 'update' ? (
              <div className="uk-flex uk-flex-center uk-margin-top">
                <Btn width="25%" backcolor="transparent" padding=".5rem 2rem" margin="1.5rem 1rem .5rem 1rem" border="none" color="red" text={Constants.DELETE} onClick={this.HandleDeletData.bind(this, this.state.postedTime)} />
              </div>
            ) : ''
          }
        </Modal>

      </Card>
    )
  }

}

const mapStateToProps = (state) => ({
  mainState: state.main,
});

const mapDispatchToProps = (dispatch) => ({
  executePost: bindActionCreators(editInformation.executePost, dispatch),
  executeGetPostedInfo: bindActionCreators(editInformation.executeGetPostedInfo, dispatch),
  executeDelete: bindActionCreators(editInformation.executeDelete, dispatch),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleList);