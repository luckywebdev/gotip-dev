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

const StyledSelect = styled.select`
  width: 30%;
  margin: 0;
  padding: .5rem .2rem;
  border: 1px solid #A3B5C1;
  border-radius: 5px;
  margin-right: .5rem;
  margin-left: .5rem;
  height: 50px;
  &:first-child{
    margin-left: 0;
  }
  &:focus {
    border: 1px solid #93B5C1;
  }

`
const ModalTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.5rem !important;
  font-weight: bolder;
  margin-top: 2%;
`

let dispatch;
var bleMod;

const GenerateSpeed = (props) => {
    const speeds = []
    for(var i = 0; i <= 100; i += 10) {
        speeds.push(<option key={ i } value={ i }>{ i }</option>)
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
            <div className="uk-form-control" style={divStyle} >
                <StyledSelect className="uk-select" name="speed" value={ props.speed } onChange={props.changed}>
                    { speeds }
                </StyledSelect>
            </div>
        </React.Fragment>
    )
}

var bleMod;
const Mabeee = (props) => {
    dispatch = useDispatch();
    const [speed, setSpeed] = useState(80);
    const [battLevel, setBattLevel] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [mabeeConnected, setMabeeConnected] = useState(false);
    const [modalState, setModalState] = useState('connecting');
    const [uuid, setUuid] = useState("");
    const [bleName, setBleName] = useState("");

    const bleState = useSelector( state => state.bleManage );
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";

    useEffect(() => {
        bleMod = new blem();
        bleMod.GNRead(bleMod.GNUuidStrs.MB_LNAME_RW);
    }, []);

    // reset 
    useEffect(() => {
        props.settingModal === "setting" ? setModalState('setting') : setModalState('connecting');
        console.log("modalState", modalState);
        //HTMLに値を表示
        bleMod.onGNScan = function (deviceName) {
            console.log("onGNScan==========>", deviceName);
            setDeviceName(deviceName);
            setMabeeConnected(true);    
        }
        
        bleMod.onGNConnectGATT = function (uuid) {
            console.log("onGNConnectGATT============>:" + uuid);
            setBleName(props.device);
            setUuid(bleMod.GNUuidStrs.MB_LNAME_RW);
            dispatch(bleManage.bleConnect({name: props.device, uuid: bleMod.GNUuidStrs.MB_LNAME_RW}));   
            if(document.getElementById('interval_data') !== null)
                document.getElementById('interval_data').innerHTML = uuid;
        };     
  
        bleMod.onGNRead = function (uuid, value) {
            console.log("onGNRead:==---->" + uuid);
            switch (uuid) {
                case bleMod.GNUuidStrs.MB_LNAME_RW:
                    console.log('Read_Data------>', value[uuid].strVal);
                    if(document.getElementById('interval_data') !== null)
                        document.getElementById('interval_data').innerHTML = value[uuid].strVal;
                    break;
                case bleMod.GNUuidStrs.MB_DEV_ID_R:
                    console.log('Device_ID------->', value[uuid].devid);
                    // document.getElementById('device-id').innerHTML = 'Devidce ID : ' + value[uuid].devid;
                    break;
                case bleMod.GNUuidStrs.MB_BTT_WN:
                    console.log('battery-level------->', value[uuid].battLevel);
                    setBattLevel(value[uuid].battLevel + 'V');
                    break;
                case bleMod.GNUuidStrs.MB_VER_R:
                    console.log('FW_Ver======>', value[uuid].fwVer);
                    console.log('HW_Ver======>', value[uuid].hwVer);
                    break;
                default:
                    break;
        
            }
        }
                
        bleMod.onGNWrite = function (uuid) {
            console.log("onGNWrite===-->");
            // document.getElementById('onGNError').innerHTML = "";
        }
        
        bleMod.onGNStartNotify = function (uuid) {
            console.log("onGNStartNotify===-->")
        }

        bleMod.onGNClear = function () {
            console.log("onGNClear------->");
        }

        bleMod.onGNReset = function () {
            console.log("onGNReset------>");
        }
                
        bleMod.onGNError = function (error) {
            console.log("mabeee_error=======>", error);
            // if(error !== "No Bluetooth Device" && error !== "Bluetooth Device is already disconnected")
            //     alert(error);
            // closeModal();
            // if(error !== null && error !== ""){
            //     bleMod.GNReset();
            // }
        } 
    }, [deviceName]);

    //リセットボタンの処理
    const activeHandler = () => {
        //selectorの内容をセット
        const command = bleMod.MBStartComm(speed);
        //セットしたコマンドを送信
        bleMod.GNWrite(bleMod.GNUuidStrs.MB_DUTY_RW, command);
    }

    //停止ボタンの処理
    const disactiveHandler = () => {
        const command = bleMod.MBStartComm('0');
        //セットしたコマンドを送信
        bleMod.GNWrite(bleMod.GNUuidStrs.MB_DUTY_RW, command);
    }

    //バッテリーボタンの処理
    const preparationBattery = () => {
        bleMod.GNStartNotify(bleMod.GNUuidStrs.MB_BTT_WN);
    }

    //バッテリーボタンの処理
    const getBatteryLevel = () => {
        console.log("batt-lvl-w", bleMod.GNUuidStrs.MB_BTT_WN);
        //0x00を送信することで、電池電圧がNotifyされる
        bleMod.GNWrite(bleMod.GNUuidStrs.MB_BTT_WN, bleMod.MBBattLvlReadComm);
    }

    //連続送信ボタンの処理
    const intervalHandler = () => {
        var count = 0;
        var countup = function () {
            console.log('Time:' + performance.now() + '/Times:' + count++);
            switch (count % 2) {
                case 0:
                    bleMod.GNWrite(bleMod.GNUuidStrs.MB_DUTY_RW, "0x0164000000");
                    break;
                default:
                    bleMod.GNRead(bleMod.GNUuidStrs.MB_LNAME_RW);
    
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
        setBattLevel("");
        setSpeed(70);
        dispatch(bleManage.bleRemove({device_name: bleName, uuid: uuid}));
    }

    const BLESettingHandler = () => {
        setModalState('setting');
    }

    const handleCancel = () => {
        setSpeed(70);
        setBattLevel('');
        dispatch(bleManage.bleSetting({device_name: bleName, uuid: uuid, device_speed: speed, device_battLevel: battLevel}));
        props.SettingChange();
    }

    const closeModal = () => {
        setSpeed(70);
        setBattLevel('');
        props.SettingChange();
    }

    const handleSetting = () => {
        dispatch(bleManage.bleSetting({device_name: bleName, uuid: uuid, device_speed: speed, device_battLevel: battLevel}));
        props.SettingChange();
    }


    const connectingModal = (
        mabeeConnected ? (
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
                        <Btn border="none" backcolor={theme_color} color="#FFF" width="45%" text={Constants.CONTROL_REQUEST} padding=".7em" onClick={() => closeModal()} ></Btn>
                        <Btn border="none" backcolor={theme_color} color="#FFF" width="45%" text={Constants.STARTTING} padding=".7em" onClick={() => handleCancel()} ></Btn>
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
                    {/* { generateSpeed } */}
                    <GenerateSpeed speed={speed} changed={ (e) => setSpeed(e.target.value) } />
                </Div>
                <Div width="90%" margin=".5rem 0 1rem 0" padding="0" justify="flex-start">
                    <Btn width="25%" radius="20px" id="sw-on" border="none" backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1rem 0 0" text={Constants.START} onClick={ () => activeHandler() } />
                    <Btn width="25%" radius="20px" id="sw-off" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding=".5rem 2rem" margin="0 1rem" text={Constants.STOP} onClick={ () => disactiveHandler() } />
                </Div>
                <Div width="90%" margin="1rem 0 0 0" padding="0" justify="flex-start">
                    <Text str="BATT-LVL : " color="#313131"></Text>
                    <Text str={battLevel} color="#313131"></Text>
                </Div>
                <Div width="90%" margin=".5rem 0 1rem 0" padding="0" justify="flex-start">
                    <Btn width="25%" radius="20px" id="batt-lvl" border="none" backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1rem 0 0" text={Constants.PREPARATION} onClick={() => preparationBattery() } />
                    <Btn width="25%" radius="20px" id="batt-lvl-w" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding=".5rem 2rem" margin="0 1rem" text={Constants.CALL} onClick={ () => getBatteryLevel() } />
                </Div>
                <Div width="90%" margin="1rem 0 0 0" padding="0" justify="flex-start">
                    <Text str="インターバル: " color="#313131"></Text>
                    <span id="interval_data"></span>
                </Div>
                <Div width="90%" margin=".5rem 0 1rem 0" padding="0" justify="flex-start">
                    {/* { generateInerval } */}
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


export default Mabeee;