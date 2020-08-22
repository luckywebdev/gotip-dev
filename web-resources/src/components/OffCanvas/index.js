import React from 'react';
import { useDispatch } from 'react-redux';
import * as Constants from '../../Constants';
import Btn from '../UI/btn';
import Anchor from '../UI/a';
import main from '../../store/actions/main';
import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
const menuList = [
    {
      id: 'profile_update',
      name: '登録情報変更 ',
      onClick: null,
      url: '',
      color: '#333'
    },
    {
      id: 'category_update',
      name: '登録カテゴリ編集 ',
      onClick: null,
      url: '',
      color: '#333'
    },
    {
      id: 'follower_list',
      name: 'フォロワー一覧 ',
      onClick: null,
      url: '',
      color: '#333'
    },
    {
      id: 'cancel_account',
      name: '退会(アカウント削除)',
      onClick: cancelAccountHandler.bind(this),
      url: '',
      color: '#F3511E'
    },
    {
      id: 'logout',
      name: 'ログアウト',
      onClick: logOutHandler.bind(this),
      url: '',
      color: '#333'
    }
  ]

var dispatch;
export default (props) => {
    dispatch = useDispatch();

    return (
        <div id="offcanvas-slide" uk-offcanvas="overlay: true" >
            <div className="uk-offcanvas-bar" style={{ zIndex: "10000", backgroundColor: "#FFF" }}>        
                <button className="uk-offcanvas-close" style={{color: '#999'}} type="button" uk-close="true"></button>
        
                <div style={{display: 'flex', flexDirection: 'column'}}>
                {
                    menuList.map((item, index) => {
                        return(
                        <span key={`${index}-menu`}>
                            <Anchor text={ item.name } color={`${item.color} !important`} clicked={item.onClick !== null ? item.onClick : null} />
                        </span>
                        )
                    })
                }
                </div>        
            </div>
            <div id="cancel_modal" uk-modal="false">
              <div className="uk-modal-dialog uk-modal-body">
                  <p>このアカウントを削除します。</p>
                  <p className="uk-text-right">
                    <button className="uk-button uk-button-primary" type="button" id="yes_btn" style={{width: "20%", borderRadius: "5px", backgroundColor: "#30AA89", marginRight: "2%"}}>{Constants.YES_BTN}</button>
                    <button className="uk-button uk-button-default uk-modal-close" type="button" style={{width: "20%", borderRadius: "5px"}}>{Constants.NO_BTN}</button>
                  </p>
              </div>
          </div>
        </div>
    )
}

function logOutHandler() {
  console.log("logout===>")
  if(dispatch){
    dispatch(main.executeLogout())
  }
}

function cancelAccountHandler() {
  if(dispatch){
    UIkit.modal("#cancel_modal").show();
    UIkit.util.on('#yes_btn', 'click', function(e){
      e.preventDefault();
      dispatch(main.executeCancelAccount(localStorage.getItem('uid')));
      UIkit.modal("#cancel_modal").hide();
    })
  }
}

