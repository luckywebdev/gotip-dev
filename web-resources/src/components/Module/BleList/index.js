import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Constants from '../../../Constants';
import bleManage from '../../../store/actions/bleManage';
import Sync from './sync';
import Mabeee from './mabeee';
import MagicMotion from './magicMotion';
import Lovense from './lovense';
import Egg from './egg';
import Vorze from './vorze';

import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled from 'styled-components';
import Card from '../../UI/Card';
import Text from '../../UI/text';
import Btn from '../../UI/btn';
import Anchor from '../../UI/a';
import DivideLine from '../../UI/Divider';
import Div from '../../UI/div';
import Modal from '../../UI/Modal/Modal';

const UlStyle = styled.ul`
  width: 90%;
  margin: auto;
  padding: 0;
  list-style: none;
  max-height: 150px;
  overflow-y: auto;
  li {
    width: 99%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .5rem;
  }
`
const BLEDeviceEditSection = styled.div`
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
const ErrorMsg = styled.div`
  color: red;
`;

let dispatch;
var connectingBLE = '';

export default (props) => {
  // bleMod = new blem();
  dispatch = useDispatch();
  const mainState = useSelector( state => state.main );
  const bleState = useSelector( state => state.bleManage );
  const [settingModal, setSettingModal] = useState('connecting');
  const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";
  const [connectedBle, setConnectedBle] = useState([]);
  const [stateValue, setStateValue] = useState({showEditableModal: false, showAddModal: false, showSettingModal: false, searched: false, connected: false, device: ''});

  useEffect(() => {
    if(bleState.device_list.length > 0){
      setConnectedBle(connectedBle => [connectedBle, ...bleState.device_list]);
    }
  }, [bleState.device_list.length])

  const EditableChange = () => {
    setStateValue({...stateValue,
      showEditableModal: !stateValue.showEditableModal
    });
  }
  const AddChange = () => {
    if(stateValue.showAddModal){
      setStateValue({...stateValue,
        showAddModal: !stateValue.showAddModal,
        searched: false,
        connected: false
      });
    }
    else{
      setStateValue({...stateValue, showAddModal: !stateValue.showAddModal})
    }
  }

  const BLEDeviceSearchHandler = () => {
    setStateValue({...stateValue, searched: true});
  }

  const BLEConnectingHandler = (device) => {
    console.log("bleConnecting", settingModal, device);
    setStateValue({...stateValue, device: device, connected: true});
    switch(device){
      case "We-Vibe Sync":
        connectingBLE = (<Sync SettingChange={SettingChange} settingModal={settingModal} device={ device } />) // bleMod.GNUuidStrs.SY_READ_RN;
        break;
      case "MaBeee":
        connectingBLE =  (<Mabeee SettingChange={SettingChange} settingModal={settingModal} device={ device } />) // bleMod.GNUuidStrs.MB_LNAME_RW;
        break;
      case "MagicMotion":
        connectingBLE = (<MagicMotion SettingChange={SettingChange} settingModal={settingModal} device={ device } />) //bleMod.GNUuidStrs.MM_MNAME_R;
        break;
      case "Lovense":
        connectingBLE = (<Lovense SettingChange={SettingChange} settingModal={settingModal} device={ device } />) //bleMod.GNUuidStrs.LS_READ_N;
        break;
      case "Egg":
        connectingBLE = (<Egg SettingChange={SettingChange} settingModal={settingModal} device={ device } />) //bleMod.GNUuidStrs.EG_CHAR1_RWN;
        break;
      case "Vorze":
        connectingBLE = (<Vorze SettingChange={SettingChange} settingModal={settingModal} device={ device } />) //bleMod.GNUuidStrs.VZ_COMM_W;
        break;
      default:
        break;
    }
  }

  const SettingChange = () => {
    setStateValue({...stateValue,
      showAddModal: false,
      searched: false,
      connected: false
    });
  setSettingModal('connecting');
  }

  const showSettingModal = (deviceName) => {
    setSettingModal('setting');
    setStateValue({...stateValue, connected: true, device: deviceName, showAddModal: true});
    switch(deviceName){
      case "We-Vibe Sync":
        connectingBLE = (<Sync SettingChange={SettingChange} settingModal={settingModal} device={ deviceName } />) // bleMod.GNUuidStrs.SY_READ_RN;
        break;
      case "MaBeee":
        connectingBLE =  (<Mabeee SettingChange={SettingChange} settingModal={settingModal} device={ deviceName } />) // bleMod.GNUuidStrs.MB_LNAME_RW;
        break;
      case "MagicMotion":
        connectingBLE = (<MagicMotion SettingChange={SettingChange} settingModal={settingModal} device={ deviceName } />) //bleMod.GNUuidStrs.MM_MNAME_R;
        break;
      case "Lovense":
        connectingBLE = (<Lovense SettingChange={SettingChange} settingModal={settingModal} device={ deviceName } />) //bleMod.GNUuidStrs.LS_READ_N;
        break;
      case "Egg":
        connectingBLE = (<Egg SettingChange={SettingChange} settingModal={settingModal} device={ deviceName } />) //bleMod.GNUuidStrs.EG_CHAR1_RWN;
        break;
      case "Vorze":
        connectingBLE = (<Vorze SettingChange={SettingChange} settingModal={settingModal} device={ deviceName } />) //bleMod.GNUuidStrs.VZ_COMM_W;
        break;
      default:
        break;
    }

    console.log("settingModal", settingModal, stateValue.device);
    // AddChange();
  }

  const bleItemCheck = (item) => {
    let f;
    var filteredElements = connectedBle.filter((ble, index) => { f = index; return ble.device_name === item; });
    if (!filteredElements.length) {
        return false;
    }
    else{
      return true;
    }
  }

  const searchingBLE = (
      <div>
        <ModalTitle>{Constants.BLE_CONNECT}</ModalTitle>
         <Div width="100%" margin="1rem 0rem" padding="0" justify="center">
            <Text str={Constants.BLE_ADD_INSTRUCTION} width="100%" color="#313131" />
          </Div>

          {
            stateValue.searched ? (
              <BLEDeviceEditSection style={{border: "1px solid #313131", padding: ".8rem 1rem"}} >
                {
                  Constants.BLE_DEVICE_LIST.map(item => {
                    return (
                      <Div width="90%" margin=".1rem auto" padding=".5rem" justify="space-between" key={item.DeviceId}>
                        <Div width="70%" margin="0rem" padding="0" justify="flex-start">
                          <Text str={item.DeviceName} color="#313131"></Text>
                        </Div>
                        <Div width="30%" margin="0rem" padding="0" justify="flex-end">
                          <Anchor href="#" decoration="none" color={theme_color} text={Constants.CONNECTING} clicked={() => BLEConnectingHandler(item.DeviceName)} />
                        </Div>
                      </Div>
                    )
                  })
                }
              </BLEDeviceEditSection>
            ) : (
              <Div width="100%" margin="1rem 0rem" padding="0" justify="center">
                <Btn padding=".5rem 1rem" fontSize="1rem" backcolor={theme_color} text={Constants.DEVICE_CONNECT} onClick={() => BLEDeviceSearchHandler() } />
                <ErrorMsg id="onGNError"></ErrorMsg>
              </Div>
            )
          }
      </div>
    )

    let edit = '';
    let add = '';
    if(props.editable){
      edit = (
        <Anchor margin="0" decoration="underline" text={Constants.CHANGE} color={theme_color} fontSize=".8rem" clicked={EditableChange} />
      );
      add = (
        <Btn fontSize=".8rem" btnType="rounded" margin="0" backcolor={theme_color} border="none" padding=".5rem 1rem" text={Constants.ADD_DEVICE} onClick={AddChange} />
        );
    }

    const bleTitle = (typeof mainState.user !== 'undefined' && typeof mainState.user.name !== 'undefined' && Object.keys(mainState.user).length > 0 && mainState.user.constructor === Object) ? mainState.user.name.nickname + "の所有機器一覧" : "BLE機器一覧"
    return (
      <Card width="100%" margin="10px" height="300px">
        <h4 className="uk-text-bold uk-flex uk-flex-between uk-flex-middle"><span>{bleTitle}</span> { edit }</h4>
        <UlStyle>
          {
            Constants.BLE_DEVICE_LIST.map(item => {
              return (
                <li key={item.DeviceId}>
                  <Text fontSize=".7rem" str={item.DeviceName}></Text>
                  <span>
                    {props.editable ? (<span uk-icon="cog" onClick={(connectedBle.length > 0 && bleItemCheck(item.DeviceName)) ? () => showSettingModal(item.DeviceName) : null}></span>) : ''}
                    {
                      (connectedBle.length > 0 && bleItemCheck(item.DeviceName)) ? (
                        <Btn color="#FFF" fontSize=".7rem" backcolor="transparent" margin="0 0 0 .5rem" border={`1px solid ${theme_color}`} color={theme_color} radius="5px" btnType="rounded" text="接続中" />
                      ) : (
                        <Btn radius="5px" fontSize=".7rem" btnType="rounded" margin="0 0 0 .5rem" text="未接続" disabled />
                      )
                    }
                  </span>
                </li>
              )
            })

          }
        </UlStyle>
        <div className="uk-flex uk-flex-center" style={{position: 'absolute', bottom: '20px', left: "50%", transform: "translateX(-50%)"}}>
          { add }
        </div>

        <Modal width="50%" show={stateValue.showAddModal} modalClosed={AddChange}>
          {
            stateValue.connected ? connectingBLE : searchingBLE
          }
        </Modal>

        <Modal width="50%" show={stateValue.showEditableModal} modalClosed={EditableChange}>
          <ModalTitle>{Constants.BLE_LIST_TITLE}</ModalTitle>
          <BLEDeviceEditSection>
            {
              Constants.BLE_DEVICE_LIST.map(item => {
                return (
                  <Div width="90%" margin=".1rem auto" padding=".5rem" justify="space-between" key={item.DeviceId}>
                    <Div width="70%" margin="0rem" padding="0" justify="flex-start">
                      <Text str={item.DeviceName} color="#313131"></Text>
                    </Div>
                    <Div width="30%" margin="0rem" padding="0" justify="flex-end">
                      <Anchor href="#" decoration="none" color="#9B9B9B" text={Constants.DELETE} />
                    </Div>
                  </Div>
                )
              })
            }
            <Div width="100%" margin="1rem 0rem" padding="0" justify="center">
              <Anchor href="#" decoration="none" color={theme_color} text="新しい機器を追加する" />
            </Div>
            <DivideLine width="80%" />
          </BLEDeviceEditSection>

          <div className="uk-flex uk-flex-center uk-margin-top">
            <Btn width="25%" radius="20px" backcolor={theme_color} padding=".5rem 2rem" margin="1.5rem auto .5rem auto" text={Constants.UPDATE_CONTENT} btnType="rounded" />
          </div>
        </Modal>
      </Card>
    );

}

// export default BleList;