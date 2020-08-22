import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import main from '../../../store/actions/main';
import userEdit from '../../../store/actions/userEdit';

import ContentEditable from 'react-contenteditable';
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons';
UIkit.use(UIkitIcons);
import styled from 'styled-components';
import LineDiv from '../../UI/Divider';
import Anchor from '../../UI/a';

const UserMessageContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 3%;
`
const MessageBody = styled.div`
  width: 80%;
  white-sapce: wrap;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  &>div>p {
    margin: 0;
  }
`


class UserMessage extends Component {
  constructor(props) {
    super(props);
    this.contentEditable = React.createRef();
    this.state = {
      editable: false,
      html: "こんにちは。●●や●●でライブ配信やってます。\n 100ポイントで僕の◎◎◎が動きます。1000ポイントごとに変顔をします！ \n フォロー宜しくお願いします。"
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.userEdit.editResult !== nextProps.userEdit.editResult)
      return true;
    if(this.state.editable !== nextState.editable)
      return true;
    if(this.state.html !== nextState.html)
      return true;
    if(this.props.mainState.gettingState !== nextProps.mainState.gettingState)
      return true;
    if(typeof nextProps.mainState.user !== 'undefined' && typeof nextProps.mainState.user.profile !== 'undefined' && this.state.html !== nextProps.mainState.user.profile)
      return true;
    return false;
  }

  componentDidUpdate() {
    const { mainState } = this.props;
    if(typeof mainState.user !== 'undefined' && typeof mainState.user.profile !== 'undefined' && mainState.gettingState && mainState.user.profile !== '' && !this.state.editable){
      this.setState({
        html: mainState.user.profile
      });
    }
  }

  MessageEdit = () => {
    if(this.state.editable){
      let infoData = {
        profile: this.state.html,
      }
      const { updatePersonalInfo } = this.props;
      updatePersonalInfo(infoData);
    }
    this.setState({
      editable: !this.state.editable
    });
  }

  handleMsessageChange = (e) => {
    this.setState({
      html: e.target.value
    });
  }

  render() {
    const { mainState } = this.props;
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
    const contentEditables = this.state.editable ? "true" : "false";
    const editableText = this.state.editable ? "更新する" : "メッセージを編集する";
    let messageEdit = '';
    if(this.props.editable){
      messageEdit = (
        <div className="uk-flex uk-flex-right">
          { this.state.editable ? '' : <span style={{ fontSize: '12px', color: theme_color}} uk-icon="icon: pencil"></span> }
          <Anchor decoration="underline" text={editableText} color={theme_color} fontSize=".8rem" clicked={ this.MessageEdit } />
        </div>
      );
    }

    return(
      <UserMessageContent>
        <div className="uk-margin uk-text-justify uk-flex uk-flex-between uk-flex-middle">
          <span className="uk-text-normal uk-text-center uk-text-success" style={{color: theme_color}}>Message</span>
          <LineDiv width="80%"></LineDiv>
        </div>
        <MessageBody>
          <ContentEditable innerRef={this.contentEditable}
              html={this.state.html} // innerHTML of the editable div
              disabled={!this.state.editable}       // use true to disable editing
              onChange={this.handleMsessageChange} // handle innerHTML change
              style={{backgroundColor: `${this.state.editable ? '#F8F8F8' : 'transparent'}`, border: `${this.state.editable ? '1px solid #CCC' : 'none'}`, padding: "5px", fontSize: ".7rem"}}
              tagName='div'/>
        </MessageBody>
        { messageEdit }
      </UserMessageContent>
    )
  }

}

const mapStateToProps = (state) => ({
  mainState: state.main,
  userEdit: state.userEdit
});

const mapDispatchToProps = (dispatch) => ({
  getAccountInfo: bindActionCreators(main.getAccountInfo, dispatch),
  updatePersonalInfo: bindActionCreators(userEdit.updatePersonalInfo, dispatch),
  changeState: bindActionCreators(userEdit.changeState, dispatch ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserMessage);