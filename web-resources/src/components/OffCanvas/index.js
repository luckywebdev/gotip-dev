import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Constants from '../../Constants';
import Btn from '../UI/btn';
import Anchor from '../UI/a';
import main from '../../store/actions/main';
import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)



const linkStyle = {
  // borderBottom: '2px solid #343130',
  padding: '3% 4%',
  position: 'relative'
}

const subUlStyle = {
  // backgroundColor: "#2C2928",
  marginBottom: "2%",
  // borderBottom: '1px solid #343130',
}

const menuList = [
    {
      id: 'home',
      name: 'ＧＯＴＩＰホーム',
      onClick: changePage.bind(this, 'home', ''),
      url: '',
      color: '#333',
      allowLevel: '1',
      parentID: '',
      child: []
    },
    {
      id: 'point_confirm',
      name: 'ポイント確認',
      onClick: changePage.bind(this, 'point_confirm', ''),
      url: '',
      color: '#333',
      allowLevel: '1',
      parentID: '',
      child: [
        {
          id: 'check_hat',
          name: 'ハットを確認する',
          onClick: changePage.bind(this, 'check_hat', 'point_confirm'),
          url: '',
          color: '#333',
          allowLevel: '2',
          parentID: 'point_confirm',
          child: []
        },
        {
          id: 'check_wallet',
          name: 'ウォレットを確認する',
          onClick: changePage.bind(this, 'check_wallet', 'point_confirm'),
          url: '',
          color: '#333',
          allowLevel: '1',
          parentID: 'point_confirm',
          child: []
        },
      ]
    },
    {
      id: 'point_buy',
      name: 'ポイント購入',
      onClick: changePage.bind(this, 'point_buy', ''),
      url: '',
      color: '#333',
      allowLevel: '1',
      parentID: '',
      child: [
        {
          id: 'point_buy',
          name: 'ポイント購入',
          onClick: changePage.bind(this, 'point_buy', 'point_buy'),
          url: '',
          color: '#333',
          allowLevel: '1',
          parentID: 'point_buy',
          child: []
        },
        {
          id: 'subscription',
          name: 'サブスクリプション',
          onClick: changePage.bind(this, 'subscription', 'point_buy'),
          url: '',
          color: '#333',
          allowLevel: '1',
          parentID: 'point_buy',
          child: []
        },
      ]
    },
    {
      id: 'setting',
      name: '設定',
      onClick: changePage.bind(this, 'setting', ''),
      url: '',
      color: '#333',
      allowLevel: '1',
      parentID: '',
      child: [
        {
          id: 'account',
          name: 'アカウント',
          onClick: changePage.bind(this, 'account', 'setting'),
          url: '',
          color: '#333',
          allowLevel: '1',
          parentID: 'setting',
          child: []
        },
        {
          id: 'search_category',
          name: '検索カテゴリー',
          onClick: changePage.bind(this, 'search_category', 'setting'),
          url: '',
          color: '#333',
          allowLevel: '1',
          parentID: 'setting',
          child: []
        },
        {
          id: 'privacy',
          name: 'プライバシーとセキュリティー',
          onClick: changePage.bind(this, 'privacy', 'setting'),
          url: '',
          color: '#333',
          allowLevel: '1',
          parentID: 'setting',
          child: []
        },
        {
          id: 'notification',
          name: '通知',
          onClick: changePage.bind(this, 'notification', 'setting'),
          url: '',
          color: '#333',
          allowLevel: '1',
          parentID: 'setting',
          child: []
        },
      ]
    },
    {
      id: 'followers',
      name: 'フォロワー',
      onClick: changePage.bind(this, 'followers', ''),
      url: '',
      color: '#333',
      allowLevel: '1',
      parentID: '',
      child: []
    },
    {
      id: 'following',
      name: 'フォロー中',
      onClick: changePage.bind(this, 'following', ''),
      url: '',
      color: '#333',
      allowLevel: '1',
      parentID: '',
      child: []
    },
    {
      id: 'cancel_account',
      name: '退会(アカウント削除)',
      onClick: cancelAccountHandler.bind(this),
      url: '',
      color: '#F3511E',
      allowLevel: '1',
      parentID: '',
      child: []
    },
    {
      id: 'logout',
      name: 'ログアウト',
      onClick: logOutHandler.bind(this),
      url: '',
      color: '#333',
      allowLevel: '1',
      parentID: '',
      child: []
    },
    {
      id: 'help',
      name: 'ヘルプ',
      onClick: changePage.bind(this, 'help', ''),
      url: '',
      color: '#333',
      allowLevel: '1',
      parentID: '',
      child: []
    }
  ]

var dispatch;
export default (props) => {
  dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState("home");
  const [parentItem, setParentItem] = useState("");
  const [authLevel, setAuthLevel] = useState(1);
  const mainState = useSelector( state => state.main );
  useEffect(() => {
    if(typeof mainState.user !== 'undefined'){
        setAuthLevel(mainState.user.auth_level);
    }
  }, [mainState.user]);

  useEffect(() => {
    if(typeof mainState.selectedItem !== 'undefined'){
      setSelectedItem(mainState.selectedItem);
      setParentItem(mainState.parentItem);
    }
  }, [mainState.selectedItem]);


  return (
    <div id="offcanvas-slide" uk-offcanvas="overlay: true" >
      <div className="uk-offcanvas-bar" style={{ zIndex: "10000", backgroundColor: "#FFF" }}>        
        <button className="uk-offcanvas-close" style={{color: '#999'}} type="button" uk-close="true"></button>
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <ul className="uk-nav-default uk-nav-parent-icon" uk-nav="false">
            {
              menuList.map((item, index) => {
                const open_class = (item.parentID === '' && selectedItem.includes(item.id)) ? "uk-open" : "";
                const parent_class = item.child.length > 0 ? "uk-parent" : "";
                return (
                  <>
                  { Number(authLevel) >= Number(item.allowLevel) && (
                    <li className={`${open_class} ${parent_class}`} key={index} style={{marginBottom: "2%", borderLeft: (item.parentID === '' && selectedItem.includes(item.id)) ? "2px solid #FF5285" : "none"}}>
                    {
                      item.child.length > 0 ? (
                          <a href="#" style={{...linkStyle, color: (parentItem !== '' && parentItem.includes(item.id)) ? "#D74A74" : item.color, borderLeft: (parentItem !== '' && parentItem.includes(item.id)) ? "2px solid #FF5285" : "none" }}><span style={{display: "inline-flex"}}>{item.name}</span></a>
                      ) : (
                          <a href="#" style={{...linkStyle, color: selectedItem.localeCompare(`${item.id}`) === 0 ? "#D74A74" : item.color, borderLeft: (item.parentID === '' && selectedItem.includes(item.id)) ? "2px solid #FF5285" : "none" }} onClick={item.onClick }><span style={{display: "inline-flex"}}>{item.name}</span></a>
                      )
                    }
                    {item.child.length > 0 && (
                      <ul className="uk-nav-sub" style={subUlStyle}>
                      {
                        item.child.map((subitem, subindex) => {
                          return (
                            <div key={subindex}>
                              {Number(authLevel) >= Number(subitem.allowLevel) && (
                                <li key={subindex}>
                                  <a href="#" style={{...linkStyle, lineHeight: "1.5", color: selectedItem.localeCompare(`${subitem.id}`) === 0 ? "#D74A74" : subitem.color }} onClick={ subitem.onClick}><span style={{display: "inline-flex"}}>{`>  ${subitem.name}`}</span></a>
                                </li>
                              )}
                            </div>
                          )
                        })                                              
                      }
                      </ul>
                    )}
                    </li>
                  )}
                  </>
                )
              })
            }
        </ul>
        </div>

        {/* <div style={{display: 'flex', flexDirection: 'column'}}>
        {
            menuList.map((item, index) => {
              return(
                <span key={`${index}-menu`}>
                    <Anchor text={ item.name } color={`${item.color} !important`} clicked={item.onClick !== null ? item.onClick : null} />
                </span>
              )
            })
        }
        </div>         */}

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

function changePage(id, parentID = '') {
  console.log("sidemenu1===>", id, parentID);
  if(dispatch){
    console.log("sidemenu2====>", id, parentID);
    dispatch(main.changePage(id, parentID));
  }
}
