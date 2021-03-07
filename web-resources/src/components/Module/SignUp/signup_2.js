import React, {Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons';
UIkit.use(UIkitIcons)
import InputMask from 'react-input-mask';

import styled from 'styled-components';
import registration from '../../../store/actions/registration';
import * as Constants from '../../../Constants';
import RowDiv from '../../UI/div';
import Btn from '../../UI/btn';
import Sheet from '../../Sheet';
import Input from '../../UI/input';

const SignupForm = styled.div`
    width: 90%;
    height: auto;
    padding: 10px 0px;
    margin: 20px auto;
    background-color: #FFF;
`;

const StyledLegend = styled.h3`
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  color: #30AA89 !important;
  text-align: center;
`
const LastRowDiv = styled(RowDiv)`
  margin-top: 60px !important;
`
const BirthDaySelect = styled.select`
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
const PrefectureSelect = styled.select`
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

const InputMaskStyle = {
  backgroundColor: "#FFF",
  border: "1px solid #A3B5C1",
  padding: "0rem 1rem",
  height: '50px',
  margin: '0px',
  width: '100%',
  boxShadow: 'none',
  outline: 'none',
  borderRadius: '5px',
  boxSizing: 'border-box'
}

var error_post = "";

class SignUpPanel_2 extends Component {
  constructor(props){
    super(props);
    this.state = {
      agency: '',
      family_name: '',
      given_name: '',
      surname: '',
      mei: '',
      prefecture: '',
      birthdate: {year: '', month: '', day: ''},
      sex: '',
      password: '',
      tel: '',
      post_code: '',
      county: '',
      town: '',
      fandi: '',
      building_room: '',
      errors: ''
    }
  }

  componentDidMount() {
    const params = this.props.match.params;
    if(Object.keys(params).length > 0 && params.constructor === Object){
      console.log("params-agentID", params);
      this.setState({
        agency: params.agentID,
        step: this.props.step
      })
    }
    else{
      this.setState({
        step: this.props.step
      })
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.registration.get_address_result !== this.props.registration.get_address_result && this.props.registration.get_address_result){
      const errors = {};
      errors.post_code = "";
      this.setState({
        prefecture: this.props.registration.prefecture,
        county: this.props.registration.county,
        town: this.props.registration.town,
        errors: errors
      }, function() {
        this.props.excuteGetAddressResultInit();
      })
    }
    else if(prevProps.registration.get_address_result !== this.props.registration.get_address_result && this.props.registration.get_address_result === false){
      error_post = "invalid postal code";
      const errors = {};
      errors.post_code = error_post;
      this.setState({
        errors: errors,
        prefecture: this.props.registration.prefecture,
        county: this.props.registration.county,
        town: this.props.registration.town
    }, function() {
        this.props.excuteGetAddressResultInit();
      })
    }
  }

  handleInput = (e) => {
    if(e.target.name !== 'tel' ){
      this.setState({
        [e.target.name]: e.target.value
      });
    }
    else if (e.target.name === 'tel' && e.target.value.length <= 10){
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  }

  handleSelectChange = (e) => {
    const birthdate = { ...this.state.birthdate, [e.target.name]: e.target.value };
    this.setState({
      ...this.state.birthdate, birthdate
    });
  }

  handlePrefectureSelectChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleGetAddress = () => {
    const {excuteGetAddress } = this.props;
    excuteGetAddress(this.state.post_code);
  }
  
  checkValuesSet = () => {
    try {
      let errors = {};
      let isValid = true;
      const regex = /^0/g;
      if (!this.state.family_name) {
        errors.family_name = "*姓を入力してください。";
        isValid = false;
      } 
      if (!this.state.given_name) {
        errors.given_name = "*名前を入力してください。";
        isValid = false;
      }
      if (!this.state.surname) {
        errors.surname = "*セイを入力してください。";
        isValid = false;
      }
      if (!this.state.mei) {
        errors.mei = "*メイを入力してください。";
        isValid = false;
      }
      if (!this.state.sex) {
        errors.gender = "*あなたの性別を選択してください。";
        isValid = false;
      }
      if(!this.state.birthdate.year || !this.state.birthdate.month || !this.state.birthdate.day) {
        errors.birthdate = "*誕生日を入力して下さい。";
        isValid = false;
      }
      if(this.state.birthdate.year && Constants.current_age(this.state.birthdate.year) < 18){
        errors.birthdate = "*18歳未満は登録できません。";
        isValid = false;
      }
      if (!this.state.prefecture) {
        errors.prefecture = "*都道府県を入力してください。";
        isValid = false;
      }
      if (!this.state.county) {
        errors.county = "*郡を入力してください。";
        isValid = false;
      }
      if (!this.state.tel || (!this.state.tel.match(/^\d{9,10}$/))) {
        errors.tel = "*有効な電話番号を入力してください。 電話番号は先頭の0を除いた9または10桁となります!!!。";
        isValid = false;
      }
      if (this.state.tel && regex.exec(this.state.tel) !== null) {
        errors.tel = "*有効な電話番号を入力してください。 電話番号は先頭の0を除いた9または10桁となります。";
        isValid = false;
      }
      if (!this.state.post_code) {
        errors.post_code = "*郵便番号を入力してください。";
        isValid = false;
      }
      this.setState({
        errors: errors
      })
      return isValid;
    } catch (err) {
      console.log('Registration values check error.', err)
      return false;

    }
  }
  
  handleNext = () => {
    const checkValidate = this.checkValuesSet();
    if(checkValidate) {
        const userData = {
          name: this.state.family_name + " " + this.state.given_name,
          ruby: this.state.surname + " " + this.state.mei,
          agent_id: this.state.agency,
          birthdate: this.state.birthdate,
          sex: this.state.sex,
          tel: this.state.tel,
          post_code: this.state.post_code,
          prefecture: this.state.prefecture,
          county: this.state.county,
          town: this.state.town,
          fandi: this.state.fandi,
          building_room: this.state.building_room,
          step: this.state.step
        }
        const { handleRegData } = this.props;
        handleRegData(userData);
    }
  }

  generateBirthDaySelect = (current) => {
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
        <div className="uk-form-label">生年月日</div>
        <div className="uk-form-control" style={divStyle} >
          <BirthDaySelect className="uk-select" name="year" value={ current.year } onChange={ this.handleSelectChange }>
            { yearArray }
          </BirthDaySelect>
          <span>年</span>
          <BirthDaySelect className="uk-select" name="month" value={ current.month } onChange={ this.handleSelectChange }>
            { monthArray }
          </BirthDaySelect>
          <span>月</span>
          <BirthDaySelect className="uk-select" name="day" value={ current.day } onChange={ this.handleSelectChange }>
            { dayArray }
          </BirthDaySelect>
          <span>日</span>
          <ErrorMsg>{this.state.errors.birthdate}</ErrorMsg>
        </div>
      </React.Fragment>
    )
  }

  generatePrefectures = (prefecture) => {
    const prefectures = [<option key={ 0 } value= { '' }>----</option>]
    Constants.PREFECTURES.forEach((item) => {
      prefectures.push(<option key={ item } value={ item }>{ item }</option>)
    })

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
        <div className="uk-form-label">{Constants.SIGNUP_2_PREFECTURES}</div>
        <div className="uk-form-control" style={divStyle} >
          <PrefectureSelect className="uk-select" name="prefecture" value={ prefecture } onChange={ this.handleInput }>
            { prefectures }
          </PrefectureSelect>
          <ErrorMsg>{this.state.errors.prefecture}</ErrorMsg>
        </div>
      </React.Fragment>
    )
  }


  render() {
    const registrationForm = (
      <form>

        <StyledLegend className="uk-legend uk-text-center uk-text-success uk-text-bold">{ Constants.SIGNUP_2_TITLE }</StyledLegend>
        <RowDiv className="uk-margin" justify="center" direction="column" alignItems="center" >
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="80%" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-agency">{ Constants.SIGNUP_2_AGENCY_CODE }</label>
                <div className="uk-form-controls" style={{width: '60%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-agency" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="agency" placeholder="0000000000" value={this.state.agency} changed={ this.handleInput } />
                </div>
            </RowDiv>
            <RowDiv className="uk-margin" justify="flex-start" direction="row" alignItems="center" width="80%" padding="0 1rem" >
              <RowDiv justify="center" direction="column" alignItems="flex-start" width="30%" margin="0" padding="0 .5rem 0 0" >
                  <label className="uk-form-label" htmlFor="form-reg-family_name">{ Constants.SIGNUP_2_FAMILY_NAME }</label>
                  <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                      <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-family_name" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="family_name" placeholder="鈴木" value={this.state.family_name} changed={ this.handleInput } />
                      <ErrorMsg>{this.state.errors.family_name}</ErrorMsg>
                 </div>
              </RowDiv>
              <RowDiv justify="center" direction="column" alignItems="flex-start" width="30%" margin="0" padding="0 0 0 .5rem" >
                  <label className="uk-form-label" htmlFor="form-reg-given_name">{Constants.SIGNUP_2_GIVEN_NAME}</label>
                  <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                      <Input type="text" elementType="input" className="uk-input uk-width" width="100%" backcolor="#FFF" border="1px solid #A3B5C1" id="form-reg-given_name" padding="0rem 1rem" name="given_name" placeholder="一郎" value={ this.state.given_name } changed={ this.handleInput } />
                      <ErrorMsg>{this.state.errors.given_name}</ErrorMsg>
                  </div>
              </RowDiv>
            </RowDiv>
            <RowDiv className="uk-margin" justify="flex-start" direction="row" alignItems="center" width="80%" padding="0 1rem" >
              <RowDiv justify="center" direction="column" alignItems="flex-start" width="30%" margin="0" padding="0 .5rem 0 0" >
                  <label className="uk-form-label" htmlFor="form-reg-surname">{ Constants.SIGNUP_2_SURNAME }</label>
                  <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                      <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-surname" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="surname" placeholder="スズキ" value={this.state.surname} changed={ this.handleInput } />
                      <ErrorMsg>{this.state.errors.surname}</ErrorMsg>
                  </div>
              </RowDiv>
              <RowDiv justify="center" direction="column" alignItems="flex-start" width="30%" margin="0" padding="0 0 0 .5rem" >
                  <label className="uk-form-label" htmlFor="form-reg-mei">{Constants.SIGNUP_2_MEI}</label>
                  <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                      <Input type="text" elementType="input" className="uk-input uk-width" width="100%" backcolor="#FFF" border="1px solid #A3B5C1" id="form-reg-mei" padding="0rem 1rem" name="mei" placeholder="イチロウ" value={ this.state.mei } changed={ this.handleInput } />
                      <ErrorMsg>{this.state.errors.mei}</ErrorMsg>
                  </div>
              </RowDiv>
            </RowDiv>
            <RowDiv className="uk-margin" justify="flex-start" direction="column" alignItems="flex-start" width="80%" padding="0 1rem" >
              { this.generateBirthDaySelect(this.state.birthdate) }
            </RowDiv>
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="80%" >
              <div className="uk-form-label">{Constants.SIGNUP_2_GENDER}</div>
              <div className="uk-form-controls" style={{width: '80%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                <RightMarginLabel><input className="uk-radio" type="radio" name="sex" value="male" onChange={ this.handleInput } checked={ this.state.sex === 'male' } />{Constants.SIGNUP_2_GENDER_MALE}</RightMarginLabel>
                <RightMarginLabel><input className="uk-radio" type="radio" name="sex" value="female" onChange={ this.handleInput }  checked={ this.state.sex === 'female' } />{Constants.SIGNUP_2_GENDER_FEMALE}</RightMarginLabel>
                <RightMarginLabel><input className="uk-radio" type="radio" name="sex" value="other" onChange={ this.handleInput }  checked={ this.state.sex === 'other' } />{Constants.SIGNUP_2_GENDER_OTHER}</RightMarginLabel>
                <ErrorMsg>{this.state.errors.gender}</ErrorMsg>
              </div>
            </RowDiv>
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="80%" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-tel">{ Constants.SIGNUP_2_PHONE }</label>
                <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <InputMask mask="9999999999" maskChar=""  name="tel" style={InputMaskStyle} placeholder="1234567890" value={this.state.tel} onChange={ this.handleInput } />
                    <ErrorMsg>{this.state.errors.tel}</ErrorMsg>
                </div>
            </RowDiv>
            <RowDiv className="uk-margin" justify="flex-start" direction="row" alignItems="center" width="80%" padding="0 1rem" >
              <RowDiv justify="center" direction="column" alignItems="flex-start" width="30%" margin="0" padding="0 .5rem 0 0" >
                  <label className="uk-form-label" htmlFor="form-reg-post_code">{ Constants.SIGNUP_2_POSTAL_CODE }</label>
                  <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                      <InputMask mask="999-9999" maskChar=" "  name="post_code" style={InputMaskStyle} placeholder="150-0001" value={this.state.post_code} onChange={ this.handleInput } />
                      <ErrorMsg>{this.state.errors.post_code}</ErrorMsg>
                  </div>
              </RowDiv>
              <RowDiv justify="center" direction="column" alignItems="flex-start" width="30%" margin="0" padding="0 0 0 .5rem" >
                  <label className="uk-form-label" htmlFor="form-reg-mei">&nbsp;</label>
                  <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <Btn text={ Constants.SEARCH_ADDRESS_BY_ZIP_CODE } color='#FFF' width="100%" padding=".5rem .5rem" className='uk-width-1-1' onClick={this.handleGetAddress} />
                  </div>
              </RowDiv>
            </RowDiv>
            <RowDiv className="uk-margin" justify="flex-start" direction="column" alignItems="flex-start" width="80%" padding="0 1rem" >
              { this.generatePrefectures(this.state.prefecture) }
            </RowDiv>

            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="80%" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-county">{ Constants.SIGNUP_2_COUNTY }</label>
                <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-county" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="county" placeholder="港区" value={this.state.county} changed={ this.handleInput } />
                    <ErrorMsg>{this.state.errors.county}</ErrorMsg>
                </div>
            </RowDiv>
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="80%" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-town">{ Constants.SIGNUP_2_TOWN }</label>
                <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-town" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="town" placeholder="六本木1丁目" value={this.state.town} changed={ this.handleInput } />
                </div>
            </RowDiv>
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="80%" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-fandi">{ Constants.SIGNUP_2_FANDI }</label>
                <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-fandi" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="fandi" placeholder="2番地" value={this.state.fandi} changed={ this.handleInput } />
                </div>
            </RowDiv>
            <RowDiv className="uk-margin" justify="center" direction="column" alignItems="flex-start" width="80%" padding="0 1rem" >
                <label className="uk-form-label" htmlFor="form-reg-building_room">{ Constants.SIGNUP_2_BUILDING_ROOM }</label>
                <div className="uk-form-controls" style={{width: '100%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                    <Input type="text" elementType="input" className="uk-input uk-width" width="100%" id="form-reg-building_room" backcolor="#FFF" border="1px solid #A3B5C1" padding="0rem 1rem" name="building_room" placeholder="森ビル" value={this.state.building_room} changed={ this.handleInput } />
                </div>
            </RowDiv>

        </RowDiv>
        <LastRowDiv className="uk-margin uk-align-center uk-text-center">
            <Btn text={ Constants.NEXT } color='#FFF' width="calc(80% - 2rem)" padding=".7rem 0" className='uk-width-1-1'　onClick={this.handleNext} />
        </LastRowDiv>

    </form>
    );

    return (
      <SignupForm className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
        <Sheet content={ registrationForm } />
      </SignupForm>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  handleRegData: bindActionCreators(registration.handleRegData, dispatch),
  excuteGetAddress: bindActionCreators(registration.excuteGetAddress, dispatch),
  excuteGetAddressResultInit: bindActionCreators(registration.excuteGetAddressResultInit, dispatch)
});

const mapStateToProps = (state) => ({
  registration: state.registration,
});



export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPanel_2);