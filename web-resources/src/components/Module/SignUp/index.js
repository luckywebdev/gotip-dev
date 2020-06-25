import React, {Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createBrowserHistory } from "history";
import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import styled from 'styled-components';
import main from '../../../store/actions/main'
import login from '../../../store/actions/login'
import registration from '../../../store/actions/registration'
import RowDiv from '../../UI/div';
import Btn from '../../UI/btn';
import Sheet from '../../Sheet';
import LoadingCover from '../../UI/loadingCover';

const SignupForm = styled.div`
  max-width: 650px;
  width: 60%;
  height: auto;
  // position: absolute;
  // top: 50%;
  // transform: translateY(-45%);
  padding: 10px 0px;
  margin: auto;
  margin-bottom: 20px;
`;

const StyledLegend = styled.legend`
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  color: #30AA89 !important;
`
const LastRowDiv = styled(RowDiv)`
  margin-top: 60px !important;
`
const BirthDaySelect = styled.select`
  width: auto;
  margin: auto;
`

const RightMarginLabel = styled.label`
  margin-right: 1em;
`

const ProceedBtn = styled.button`
  background-color: #f21580;
  &:hover{
    background-color: rgba(242,21,128, 0.8);
  }
`

const ErrorMessage = styled.div`
  color: red;
`


class SignUpPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      userid: '',
      name: '',
      ruby: '',
      nickname: '',
      email: '',
      birthdate: {year: '', month: '', day: ''},
      sex: '',
      password: '',
      loadingMessage: '',
      color: 'rgba(48, 170, 137, 1)'
    }
    this.history = createBrowserHistory();
  }

  componentDidUpdate() {
    const { loginState } = this.props;
    if(loginState.isLoading) {
      UIkit.modal(document.getElementById('registration-modal')).hide();
      this.props.history.push(loginState.historyRedirect)
    }
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSelectChange = (e) => {
    const birthdate = { ...this.state.birthdate, [e.target.name]: e.target.value };
    this.setState({
      ...this.state.birthdate, birthdate
    });
  }
    
  handleRegistrationClick = (e) => {
    UIkit.modal(document.getElementById('registration-modal')).show()
  }
  
  handleRegistrationExecuteClick = (state, isNewRegistration) => {
    const { executeRegister } = this.props;
    executeRegister(state, isNewRegistration);
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
          </div>
      </React.Fragment>
    )
  }
  
  checkValuesSet = (isNew) => {
    try {
      if (!this.state.name || !this.state.ruby || !this.state.sex) return "1"
      if (isNaN(this.state.birthdate.year)) return "2"
      if (isNaN(this.state.birthdate.month)) return "3"
      if (isNaN(this.state.birthdate.day)) return "4"
      if (!this.state.userid || this.state.userid.match(/[^0-9 a-z]/) && isNew) return "5"
      if (!this.state.email || this.state.email.indexOf('@') === -1) return "6"
      if (!this.state.password || this.state.password.length < 6) return "7"
      //if (!state.tel) return true
    } catch (err) {
      console.log('Registration values check error.', err)
    }
    return false
  }
  
  checkAvailability = (userId) => {
    const { checkUserId } = this.props;
    checkUserId(userId);
  }
  

  render() {
    const { mainState } = this.props;
    const isNew = true;
    const checkValuesSet = this.checkValuesSet(isNew);
    console.log("signup", checkValuesSet + this.state);
    const registrationForm = (
      <form>
        <fieldset className="uk-fieldset">

            <StyledLegend className="uk-legend uk-text-center uk-text-success uk-text-bold">会員登録</StyledLegend>

            <RowDiv className="uk-margin" justifyContent="center" direction="column" alignItems="flex-start" >
              <label className="uk-form-label" htmlFor="form-reg-userid">ユーザーID</label>
              <div className="uk-form-controls" style={{width: '80%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                <input className="uk-input uk-width" id="form-reg-userid" name="userid" type="text" placeholder="ユーザーID" uk-tooltip={ isNew ? "title: ユーザーIDは1~36文字の半角英数をご入力ください;" : null } value={ this.state.userid } onInput={ this.handleInput } onChange={ isNew ? this.checkAvailability.bind(null, this.state.userid) : null } readOnly={ !isNew } />
                { this.state.isUidAvailable === false ? <ErrorMessage>ご入力いただいたユーザーIDは既に使用されています。</ErrorMessage> : null }
              </div>
              <label className="uk-form-label" htmlFor="form-reg-name">お名前</label>
              <div className="uk-form-controls" style={{width: '80%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                <input className="uk-input uk-width" id="form-reg-name" name="name" type="text" placeholder="山田　太郎" uk-tooltip="title: 苗字とお名前をご入力ください。;" value={ this.state.name } onChange={ this.handleInput } />
              </div>
              <label className="uk-form-label" htmlFor="form-reg-ruby">フリガナ</label>
              <div className="uk-form-controls" style={{width: '80%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                <input className="uk-input uk-width" id="form-reg-ruby" name="ruby" type="text" placeholder="ヤマダ　タロウ" uk-tooltip="title: フリガナをご入力ください。;" value={ this.state.ruby }  onChange={ this.handleInput } />
              </div>
              <label className="uk-form-label" htmlFor="form-reg-nickname">ニックネーム(表示名)</label>
              <div className="uk-form-controls" style={{width: '80%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                <input className="uk-input uk-width" id="form-reg-nickname" name="nickname" type="text" placeholder="ニックネーム" uk-tooltip="title: 表示に使われるお名前をお決めください。;" value={ this.state.nickname } onChange={ this.handleInput } />
              </div>
            </RowDiv>
            <RowDiv className="uk-margin" justifyContent="center" direction="column" alignItems="flex-start">
              <div className="uk-form-label">性別</div>
              <div className="uk-form-controls" style={{width: '80%', marginTop: '.3rem', marginBottom: '.5rem'}} uk-tooltip="title: 性別をお選びください。;pos: top-left">
                <RightMarginLabel><input className="uk-radio" type="radio" name="sex" value="male" onChange={ this.handleInput } checked={ this.state.sex === 'male' } />男性</RightMarginLabel>
                <RightMarginLabel><input className="uk-radio" type="radio" name="sex" value="female" onChange={ this.handleInput }  checked={ this.state.sex === 'female' } />女性</RightMarginLabel>
              </div>
            </RowDiv>

            <RowDiv className="uk-margin uk-grid-small uk-child-width-auto uk-grid" justifyContent="center" direction="column" alignItems="flex-start">
              { this.generateBirthDaySelect(this.state.birthdate) }
            </RowDiv>

            <RowDiv className="uk-margin" justifyContent="center" direction="column" alignItems="flex-start">
              <label className="uk-form-label" htmlFor="form-reg-mail">メールアドレス</label>
              <div className="uk-form-controls" style={{width: '80%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                <input className="uk-input uk-width" id="form-reg-mail" name="email" type="email" placeholder="xxx@xx.x" uk-tooltip="title: メールアドレスはログインに利用されます。"  value={ this.state.email } onChange={ this.handleInput } />
              </div>
            </RowDiv>

            <RowDiv className="uk-margin uk-text-center"  justifyContent="center" direction="column" alignItems="flex-start">
              <label className="uk-form-label" htmlFor="form-reg-password">{ isNew ? '' : '新' }パスワード</label>
              <div className="uk-form-controls" style={{width: '80%', marginTop: '.3rem', marginBottom: '.5rem'}}>
                <input className="uk-input uk-width" id="form-reg-password" name="password" type="password" value={this.state.password} placeholder="6文字以上のパスワードをご入力ください" uk-tooltip="title: セキュリティ向上のため、パスワードは8文字以上英数混合をお勧めいたします。"  onChange={ this.handleInput } />
              </div>
            </RowDiv>
            <LastRowDiv className="uk-margin uk-align-center uk-text-center">
              <Btn text={ isNew ? '確認画面へ進む' : '会員情報変更' } color='#FFF' className='uk-width-1-1'　onClick={this.handleRegistrationClick} disabled={ checkValuesSet } />
            </LastRowDiv>

        </fieldset>
    </form>
    );

    return (
      <SignupForm className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
        <Sheet content={ registrationForm } />

        <div id="registration-modal" uk-modal='true'>
          <div className="uk-modal-dialog uk-modal-body">
            <button className="uk-registration-modal" type="button" uk-close='true'></button>
            <h2 className="uk-modal-title">{ isNew ? '会員登録' : '会員情報変更' }</h2>
            <p>以下の内容で{ isNew ? '' : '再' }登録いたします。</p>
            <table className="uk-table uk-table-middle uk-table-divider">
              <thead>
                  <tr>
                      <th className="uk-width-small">項目</th>
                      <th>内容</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>ユーザーID</td>
                      <td>{ this.state.userid }</td>
                  </tr>
                  <tr>
                      <td>お名前</td>
                      <td>{ this.state.name }</td>
                  </tr>
                  <tr>
                      <td>フリガナ</td>
                      <td>{ this.state.ruby }</td>
                  </tr>
                  <tr>
                      <td>ニックネーム</td>
                      <td>{ this.state.nickname }</td>
                  </tr>
                  <tr>
                      <td>性別</td>
                      <td>{ this.state.sex ? this.state.sex === 'male' ? '男性' : '女性' : '未選択' } </td>
                  </tr>
                  <tr>
                      <td>生年月日</td>
                      <td>{ `${this.state.birthdate.year}/${this.state.birthdate.month}/${this.state.birthdate.day}` }</td>
                  </tr>
                  <tr>
                      <td>メールアドレス</td>
                      <td>{ this.state.email }</td>
                  </tr>
                  <tr>
                      <td>{ isNew ? 'ログイン' : '新しい' }パスワード</td>
                      <td>{ this.state.password ? '*'.repeat(this.state.password.length) : '' }</td>
                  </tr>
                  {/* <tr>
                      <td>携帯電話</td>
                      <td>{ state.tel ? state.tel : '設定無し' }</td>
                  </tr> */}
              </tbody>
            </table>
            <div className="uk-modal-footer uk-text-right">
              <button className="uk-button uk-button-default uk-modal-close" type="button">修正</button>
              <ProceedBtn className="uk-button uk-button-primary" type="button" onClick={ this.handleRegistrationExecuteClick.bind(null, this.state, isNew) }>登録</ProceedBtn>
            </div>
          </div>
          <LoadingCover text={ mainState.loadingMessage ? mainState.loadingMessage : null } />

        </div>

      </SignupForm>
    );
  }
}

const mapStateToProps = (state) => ({
  regState: state.registration,
  mainState: state.main,
  loginState: state.login
});

const mapDispatchToProps = (dispatch) => ({
  checkUserId: bindActionCreators(registration.checkUserId, dispatch),
  executeRegister: bindActionCreators(registration.executeRegister, dispatch),
});


export default  connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPanel);