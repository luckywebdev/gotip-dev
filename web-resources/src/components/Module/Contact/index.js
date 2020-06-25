import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import withErrorHandler from '../../../hoc/WithErrorHandler/WithErrorHandler';
import { withRouter } from 'react-router-dom';
import contact from '../../../store/actions/contact';

import axios from '../../../axios-instance';
import Btn from '../../UI/btn';
import Text from '../../UI/text';
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import styled from 'styled-components';


const SheetContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding-left: 1em;
  padding-right: 1em;
  padding-top: 1em;
  padding-bottom: 1em;
  margin: auto;
  max-width: 768px;
`

const MessageTextArea = styled.textarea`
  padding: 0.5em;
  height: calc( 1.2em * 9 );
  line-height: 1.2em !important;
  font-size: 1em;
  resize: none;
`

const ProceedBtn = styled.button`
  background-color: #f21580;
  &:hover{
    background-color: rgba(242,21,128, 0.8);
  }
`

const LeftTh = styled.th`
  width: 8em;
`


const contactOptionDatas = [
  {
    title: 'ログインに関して'
  },
  {
    title: '仕様について'
  },
  {
    title: '不具合について'
  },
  {
    title: '要望'
  },
  {
    title: 'その他'
  }
]
class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      title: '',
      message: ''
    }
  }

  generateContactOptions = () => {
    return contactOptionDatas.map(data => {
      return <option value={ data.title }>{ data.title }</option>
    })
  }
  
  checkValuesSet = () => {
    try {
      if (!this.state.name) return true
      if (!this.state.email) return true
      if (!this.state.title) return true
      if (!this.state.message) return true
    } catch (err) {
      console.log('Contact mail form values check error.', err)
    }
    return false
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSelectChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  handleTextAreaInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value ? e.target.value : ''
    });
  }
  
  handleConfirmClick = (e) => {
    console.log("aaaaa");
    UIkit.modal(document.getElementById('modal-close-default')).show()
  }
  
  executeSendContactMail = (state) => {
    UIkit.modal(document.getElementById('modal-close-default')).hide();
    const { executeSendMail } = this.props;
    executeSendMail(state) 
  }

  render() {
    const disableState = this.checkValuesSet();
    const mailForm = (
      <form>
        <fieldset className='uk-fieldset'>
          {/* <legend className='uk-legend'>メール</legend> */}
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="form-contact-name">お名前</label>
            <div className="uk-form-controls">
              <input className="uk-input uk-width-1-2" id="form-contact-name" name="name" type="text" placeholder="問合　史郎" onChange={this.handleInput} value={ this.state.name } />
            </div>
          </div>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="form-contact-mail">メールアドレス</label>
            <div className="uk-form-controls">
              <input className="uk-input uk-width-2-3" id="form-contact-mail" name="email" type="email" placeholder="xxx@xx.x" uk-tooltip="title: 返信先メールアドレスをご入力ください。"  onInput={ this.handleInput } value={ this.state.email } />
            </div>
          </div>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="form-contact-title">お問い合わせ項目</label>
            <select className="uk-select" name="title" value={ this.state.title } onChange={ this.handleSelectChange }>
              { this.generateContactOptions() }
            </select>
            {/* <div className="uk-form-controls">
              <input className="uk-input uk-width-1-1" id="form-contact-title" name="title" type="text" placeholder="xxについて" uk-tooltip="title: お問い合わせのタイトルをご入力ください。;" onInput={ handleInput } value={ state.title } />
            </div> */}
          </div>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="form-contact-message">お問い合わせ内容</label>
            <div className="uk-form-controls">
              <MessageTextArea className="uk-input uk-width-1-1" rows="5" id="form-contact-message" name="message" placeholder="xxは〇〇でしょうか。教えてください。" uk-tooltip="title: お問い合わせ内容をご入力ください。;" onInput={ this.handleTextAreaInput } value={ this.state.message } />
            </div>
          </div>
        </fieldset>
        <Btn text='確認画面へ進む' color='#f21580' padding=".2rem .5rem" className='uk-width-1-1'　onClick={ this.handleConfirmClick } disabled={ disableState } />
      </form>
    )
    const contactInfo = (
      <div>
        <article className="uk-article">
        <h2 className="uk-heading-divider">お問い合わせ</h2>
          <p className="uk-article-meta">Contacts</p>
          <p className="uk-text-lead">ご不明な点などがございました際は、下記フォームよりご連絡ください。後日、担当者よりご返信させていただきます。</p>
        </article>
        <hr />
        { mailForm }
      </div>
    )
    return (
      <SheetContainer>
        { contactInfo }
        <div id="modal-close-default" uk-modal='true'>
          <div className="uk-modal-dialog uk-modal-body">
            <button className="uk-modal-close-default" type="button" uk-close='true'></button>
            <h2 className="uk-modal-title">お問い合わせ</h2>
            <p>内容をご確認ください。</p>
            <table className="uk-table uk-table-middle uk-table-divider">
              <thead>
                <tr>
                    <LeftTh className="uk-width-small">項目</LeftTh>
                    <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                    <td>お名前</td>
                    <td>{ this.state.name }</td>
                </tr>
                <tr>
                    <td>メールアドレス</td>
                    <td>{ this.state.email }</td>
                </tr>
                <tr>
                    <td>お問い合わせ項目</td>
                    <td>{ this.state.title }</td>
                </tr>
                <tr>
                    <td>お問い合わせ内容</td>
                    <td><Text str={ this.state.message } /></td>
                </tr>
              </tbody>
            </table>
            <div className="uk-modal-footer uk-text-right">
              <button className="uk-button uk-button-default uk-modal-close" type="button">修正</button>
              <ProceedBtn className="uk-button uk-button-primary" type="button" onClick={ this.executeSendContactMail.bind(this, this.state) }>送信</ProceedBtn>
            </div>
          </div>
        </div>
      </SheetContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  contactState: state.contact
});

const mapDispatchToProps = (dispatch) => ({
  changedValues: bindActionCreators(contact.changedValues, dispatch),
  executeSendMail: bindActionCreators(contact.executeSendMail, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(withRouter(Contact), axios));

