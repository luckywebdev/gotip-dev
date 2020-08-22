import React, { useEffect, useState } from 'react';
import * as Constants from '../../../Constants';
import blem from './BLEModule/ble-mod';
import { useSelector, useDispatch } from 'react-redux';

import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled from 'styled-components';
import Text from '../../UI/text';
import Btn from '../../UI/btn';
import Anchor from '../../UI/a';
import Div from '../../UI/div';
import bleManage from '../../../store/actions/bleManage';

const ModalTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.5rem !important;
  font-weight: bolder;
  margin-top: 2%;
`

let dispatch;
var bleMod;

const Sync = (props) => {
    dispatch = useDispatch();
    const [deviceName, setDeviceName] = useState("");
    const [eggConnected, setEggConnected] = useState(false);
    const [modalState, setModalState] = useState('connecting');
    const [uuid, setUuid] = useState("");
    const [bleName, setBleName] = useState("");

    const bleState = useSelector( state => state.bleManage );
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";

    useEffect(() => {
        bleMod = new blem();
        bleMod.GNStartNotify(bleMod.GNUuidStrs.EG_CHAR1_RWN);
    }, []);

    // reset 
    useEffect(() => {
        props.settingModal === "setting" ? setModalState('setting') : setModalState('connecting');
        console.log("modalState", modalState);
        //HTMLに値を表示
        bleMod.onGNScan = function (deviceName) {
            console.log("onGNScan==========>", deviceName);
            setDeviceName(deviceName);
            setEggConnected(true);       
        }
        
        bleMod.onGNConnectGATT = function (uuid) {
            console.log("onGNConnectGATT============>:" + uuid);
            console.log('UUID Name : ' + uuid);
            console.log('Connect Status : Connected');
            setBleName(props.device);
            setUuid(bleMod.GNUuidStrs.EG_CHAR1_RWN);
            dispatch(bleManage.bleConnect({name: props.device, uuid: bleMod.GNUuidStrs.EG_CHAR1_RWN}));
        };  
        
        bleMod.onGNDisconnect = function () {
            console.log("onGNDisconnect======>");
            console.log('Status : DisConnected');
        }
        
  
        bleMod.onGNRead = function (uuid, value) {
            console.log("onGNRead:==---->" + uuid);
            if(document.getElementById('interval_data') !== null)
                document.getElementById('interval_data').innerHTML = value[uuid].strVal;
            console.log('Battery Level : ' + value[uuid].battLevel + '%');

        }
                
        bleMod.onGNWrite = function (uuid) {
            console.log("onSyncWrite===-->");
            console.log('Connect Status : Sended command');        
        }
        
        bleMod.onGNClear = function () {
            console.log("onGNClear------->");
        }

        bleMod.onGNReset = function () {
            console.log("onGNReset------>");
        }
                
        bleMod.onGNError = function (error) {
            console.log("egg_error======>", error);
            // if(error !== "No Bluetooth Device" && error !== "Bluetooth Device is already disconnected")
            //     alert(error);
            // closeModal();
        } 
    }, [deviceName]);

    //リセットボタンの処理
    const activeHandler = () => {
        //セットしたコマンドを送信
        console.log(bleMod.EGComm.EG_OCR05ON);
        bleMod.GNWrite(bleMod.GNUuidStrs.EG_CHAR9_RW, bleMod.EGComm.EG_OCR05ON);
    }

    //停止ボタンの処理
    const disactiveHandler = () => {
        bleMod.GNWrite(bleMod.GNUuidStrs.EG_CHAR9_RW, bleMod.EGComm.EG_OCR05OFF);
    }

    const turnLeftHandler = () => {
        bleMod.GNWrite(bleMod.GNUuidStrs.EG_CHAR9_RW, bleMod.EGComm.EG_ROBOT);
    }

    //連続送信ボタンの処理
    const intervalHandler = () => {
        var count = 0;
        var countup = function () {
            console.log('Time:' + performance.now() + '/Times:' + count++);
            switch (count % 3) {
                case 0:
                    bleMod.GNWrite(bleMod.GNUuidStrs.EG_CHAR9_RW, bleMod.EGComm.EG_OCR05ON);
                    break;
                case 1:
                    bleMod.GNWrite(bleMod.GNUuidStrs.EG_CHAR9_RW, bleMod.EGComm.EG_ROBOT);
                    break;
                case 2:
                    bleMod.GNWrite(bleMod.GNUuidStrs.EG_CHAR9_RW, bleMod.EGComm.EG_OCR05OFF);
                    break;
            }
            var id = setTimeout(countup, 100);
            if (count > 5) {
                clearTimeout(id); //idをclearTimeoutで指定している
            }
        }
    
        countup();
    }

    const resetState = () => {
        bleMod.GNReset();
        dispatch(bleManage.bleRemove({device_name: bleName, uuid: uuid}));

    }

    const BLESettingHandler = () => {
        setModalState('setting');
    }

    const handleCancel = () => {
        dispatch(bleManage.bleSetting({device_name: bleName, uuid: uuid}));
        props.SettingChange();
    }

    const closeModal = () => {
        props.SettingChange();
    }

    const handleSetting = () => {
        dispatch(bleManage.bleSetting({device_name: bleName, uuid: uuid}));
        props.SettingChange();
    }


    const connectingModal = (
        eggConnected ? (
            <React.Fragment>
                <ModalTitle>{Constants.BLE_CONNECT}</ModalTitle>
                <Div width="100%" direction="column" alignItems="center" justify="flex-start" margin="1rem 0" padding="1rem" >
                    <Div width="100%" margin="1rem 0rem" padding="0" justify="center">
                        <Text str={Constants.BLE_CONNECT_SUCCESS} width="100%" color={theme_color} />
                    </Div>
                    <Div width="80%" margin="1rem auto" padding="0" justify="flex-start" direction="row" alignItems="center" margin="2rem 4rem">
                        <Btn border={`1px solid ${theme_color}`} backcolor="transparent" color={theme_color} radius="1px" width="10%" text={Constants.CONNECTING_STATE} />
                        <Text str={`${props.device}(${deviceName})`} width="80%" color="#313131" />
                    </Div>
                    <Div width="80%" margin="1rem auto" padding="0" justify="center">
                        <Btn border="none" backcolor={theme_color} color="#FFF" width="100%" padding=".8rem" onClick={() => BLESettingHandler()} ><span uk-icon="cog"></span><span>{Constants.DEVICE_SETTING_CHANGE}</span></Btn>
                    </Div>
                    <Div width="80%" margin="1rem auto" padding="0" justify="space-between" alignItems="center" direction="row">
                        <Btn border="none" backcolor={theme_color} color="#FFF" width="45%" text={Constants.CONTROL_REQUEST} padding=".7em" onClick={ () => closeModal() }></Btn>
                        <Btn border="none" backcolor={theme_color} color="#FFF" width="45%" text={Constants.STARTTING} padding=".7em" onClick={ () => handleCancel() } ></Btn>
                    </Div>
                </Div>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <ModalTitle>{Constants.BLE_CONNECT}</ModalTitle>
                <Div width="100%" margin="1rem 0rem" padding="0" justify="center">
                    <Text str={`${props.device}(${deviceName})に接続中`} width="100%" color="#313131" />
                </Div>
            </React.Fragment>
        )
    );

    const settingModal = (
        <React.Fragment>
        <ModalTitle>{Constants.BLE_SETTING}</ModalTitle>
            <Div width="100%" margin="0rem" padding="0" direction="column" justify="flex-start" alignItems="center">
                <Div width="90%" margin="1rem 0" padding="0" justify="space-between" alignItems="center">
                    <span>
                        <Btn width="20%" radius="3px" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding=".5rem 2rem" margin="0 1.5rem 0 0" text={Constants.CONNECTING_STATE} />
                        <Text str={bleState.device_name} color="#313131"></Text>
                    </span>
                    <Anchor href="#" decoration="underline" color={theme_color} text={Constants.RESET} id="resetBtn" onClick={ () => resetState() } />
                </Div>
                <Div width="90%" margin="1rem 0 0 0" padding="0" justify="flex-start">
                    <Text str="電源" color="#313131"></Text>
                </Div>
                <Div width="90%" margin=".5rem 0 1rem 0" padding="0" justify="flex-start">
                    <Btn width="25%" radius="20px" id="sw-on" border="none" backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1rem 0 0" text={Constants.POWER_ON} onClick={ () => activeHandler() } />
                    <Btn width="25%" radius="20px" id="sw-off" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding=".5rem 2rem" margin="0 1rem" text={Constants.POWER_OFF} onClick={ () => disactiveHandler() } />
                </Div>
                <Div width="90%" margin=".5rem 0 1rem 0" padding="0" justify="flex-start">
                    <Btn width="25%" radius="20px" id="sw-on" border="none" backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1rem 0 0" text={Constants.TURN_LEFT} onClick={ () => turnLeftHandler() } />
                </Div>
                <Div width="90%" margin="1rem 0 0 0" padding="0" justify="flex-start">
                    <Text str="インターバル: " color="#313131"></Text>
                    <span id="interval_data"></span>
                </Div>
                <Div width="90%" margin=".5rem 0 1rem 0" padding="0" justify="flex-start">
                    <Btn width="25%" radius="20px" id="interval" border="none" backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1rem 0 0" text="インターバル" onClick={ () => intervalHandler() } />
                </Div>
                <Div width="90%" margin="2rem 0" padding="0" justify="center">
                    <Btn width="30%" radius="20px" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding="1rem 2rem" margin="0 1rem" text={Constants.CANCEL} onClick={ () => handleCancel() } />
                    <Btn width="30%" radius="20px" border="none" backcolor={theme_color} color="#FFF" padding="1rem 2rem" margin="0 1rem" text={Constants.UPDATE_CONTENT} onClick={ () => handleSetting() } />
                </Div>
            </Div>
        </React.Fragment>
    )

    return (
        <div>
        {
            modalState === "connecting" ? connectingModal : settingModal
        }
      </div>

    );

}


export default Sync;