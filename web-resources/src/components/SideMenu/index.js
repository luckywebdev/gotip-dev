import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import main from '../../store/actions/main';

import * as Constants from '../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import Btn from '../UI/btn';
import Anchor from '../UI/a';
import { useHistory } from 'react-router';

const StyleSideMenu = styled.nav`
    width: 18%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-right: 1%;
    padding-top: 2%;
    align-self: stretch;
    background: #343130;
`
const linkStyle = {
    borderBottom: '2px solid #343130',
    padding: '3% 2% 3% 7%',
    position: 'relative',
    fontSize: '1rem'
}

const subUlStyle = {
    backgroundColor: "#2C2928",
    marginBottom: "2%",
    borderBottom: '1px solid #343130',
}

const badgeIcon = {
    position: "absolute",
    width: "25px",
    height: "25px",
    backgroundColor: "red",
    top: "-2px",
    right: "-2px",
    color: "#FFF",
    fontSize: "12px",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex"
  }

let dispatch;
export default (props) => {
    let applicationTemp = 0;
    let history = useHistory();
    dispatch = useDispatch();
    const mainState = useSelector( state => state.main );

    return (
        <StyleSideMenu>
            <div className="uk-width">
                <ul className="uk-nav-default uk-nav-parent-icon" uk-nav="false">
                    {
                        Constants.SIDE_MENU_LIST.map((item, index) => {
                            const open_class = history.location.pathname.includes(item.url) ? "uk-open" : "";
                            const parent_class = item.child.length > 0 ? "uk-parent" : ""
                            return (
                                <li className={`${open_class} ${parent_class}`} key={index} style={{marginBottom: "2%"}}>
                                    {
                                        item.child.length > 0 ? (
                                            <a href="#" style={ {...linkStyle, color: history.location.pathname.includes(item.url) ? "#D74A74" : "#FFF", borderLeft: history.location.pathname.includes(item.url) ? "2px solid #FF5285" : "none" }}>{item.name}</a>
                                        ) : (
                                            <a href="#" style={{...linkStyle, color: history.location.pathname.localeCompare(`${item.url}`) === 0 ? "#D74A74" : "#FFF", borderLeft: history.location.pathname.includes(item.url) ? "2px solid #FF5285" : "none" }} onClick={() => history.push(`${item.url}`)}>{item.name}</a>
                                        )
                                    }
                                    {item.child.length > 0 && (
                                        <ul className="uk-nav-sub" style={subUlStyle}>
                                        {
                                            item.child.map((subitem, subindex) => (
                                                <li key={subindex}>
                                                    <a href="#" style={{...linkStyle, lineHeight: "1.5", color: history.location.pathname.localeCompare(`${item.url}${subitem.url}`) == 0 ? "#D74A74" : "#FFF" }} onClick={() => history.push(`${item.url}${subitem.url}`)}>{`>  ${subitem.name}`}</a>
                                                </li>
                                            ))
                                        }
                                        </ul>
                                    )}
                                </li>
                            )
                        })
                    }
                    {
                        typeof mainState.user !== 'undefined' && mainState.user.auth_level >= 3 ? (
                            <li>
                                <a href="#" style={{...linkStyle, lineHeight: "1.5", color: history.location.pathname.localeCompare(`/admin/agent/news`) == 0 ? "#D74A74" : "#FFF" }} onClick={() => history.push(`/admin/agent/news`)}>{`>  管理ページへ`}</a>
                            </li>
                        ) : null
                    }
                </ul>
            </div>
        </StyleSideMenu>
    );
}

