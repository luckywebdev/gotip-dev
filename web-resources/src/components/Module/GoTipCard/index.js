import React from 'react';
import styled from 'styled-components';
import Text from '../../UI/text';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../store/actions/main';

let dispatch

export default (props) => {
  dispatch = useDispatch()

  const state = useSelector( state => state.main );
  const gotipShows = () => {
    let gotip_show_state = state.show_state;
    if(gotip_show_state === undefined)
      gotip_show_state = false;
    dispatch(actions.gotipShow(!gotip_show_state));
  };

  const CardStyle = styled.div`
    width: ${props.width ? props.width : 'auto' };
    height: ${props.height ? props.height : 'auto' };
    padding: 20px;
    position: absolute;
    bottom:10%;
    right: 10%;
    background-color: ${props.backColor ? props.backColor : 'rgba(0, 0, 0, 0.85)' };
    border-radius: ${props.radius ? props.radius : '7px' };
  `
  const CloseBtn = styled.span`
    width: 20px;
    height: 20px;
    background-color: #EA497B;
    border-radius: 50%;
    padding: 5px;
    color: #FFF;
    cursor: pointer;
    position: absolute;
    top: -10px;
    right: -10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    z-index: 1000;
    &:hover {
      opacity: .9;
    }
  `

    const pointList = props.children.map(item => {
      return item;
    });

    return (
      <CardStyle className="uk-card uk-card-body" >
        <CloseBtn onClick={ gotipShows }>X</CloseBtn>
        <div className="uk-flex uk-flex-between uk-margin-top">
          <Text color="#FFF" str="所持ポイント" margin="0 1rem" />
          <Text color="#FFF" str="5932Pt" margin="0 1rem" />
        </div>
        {pointList}
        <div className="uk-flex uk-flex-center uk-margin">
          <a className="uk-link-muted" href="#" uk-icon="icon: plus"></a>
          <a className="uk-link-muted" href="#">チャージする</a>
        </div>
      </CardStyle>
    );
}

