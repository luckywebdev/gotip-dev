import React, {useState, useEffect} from 'react';
import * as Constants from '../../Constants';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../store/actions/main';

import Modal from '../UI/Modal/Modal';
import PointConfirm from '../ModalComponent/pointConfirm';

var dispatch;
export default (props) => {
  dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState("home");
  const [showContent, setShowContent] = useState(false);
  const [parentItem, setParentItem] = useState("");

  const mainState = useSelector( state => state.main );

  useEffect(() => {
    if(typeof mainState.selectedItem !== 'undefined'){
      setSelectedItem(mainState.selectedItem);
      setParentItem(mainState.parentItem);
    }
  }, [mainState.selectedItem]);

  useEffect(() => {
    if(selectedItem !== 'home'){
        setShowContent(true);
    }
  }, [selectedItem, parentItem]);

  const closeContent = () => {
    setShowContent(false);
    setSelectedItem('home');
    setParentItem('');
    dispatch(actions.changePage('home', ''));

  }

  const modalContent = () => {
    if(selectedItem !== 'home'){
      switch(selectedItem){
        case 'check_hat':
          return (<PointConfirm />);
          break;
        default:
          break;
      }
    }
  }

  return (
    <Modal width="60%" show={showContent} modalClosed={() => closeContent()}>
        { modalContent() }
    </Modal>
    )
}