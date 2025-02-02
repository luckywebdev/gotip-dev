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
  width: 70%;
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

const GenerateType = (props) => {
    const types = []
    for(var key in Constants.VORZE_TYPE_LIST) {
        types.push(<option key={ key } value={ key }>{ Constants.VORZE_TYPE_LIST[key] }</option>)
    }

    let divStyle = {
        width: '50%',
        marginTop: '.3rem',
        marginBottom: '.5rem',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }

    return (
        <React.Fragment>
            <div className="uk-form-control" style={divStyle} >
                <StyledSelect className="uk-select" name="typeSel" value={ props.typeSel } onChange={props.changed}>
                    { types }
                </StyledSelect>
            </div>
        </React.Fragment>
    )
}
const GenerateMode = (props) => {
    const modes = []
    for(var key in Constants.VORZE_MODE_LIST) {
        modes.push(<option key={ key } value={ key }>{ Constants.VORZE_MODE_LIST[key] }</option>)
    }

    let divStyle = {
    width: '100%',
    marginTop: '.3rem',
    marginBottom: '.5rem',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", width: "40%"}}>
            <div className="uk-form-label">パターン</div>
            <div className="uk-form-control" style={divStyle} >
                <StyledSelect className="uk-select" name="mode" value={ props.mode } onChange={props.changed}>
                    { modes }
                </StyledSelect>
            </div>
        </div>
    )
}
const GeneratePower = (props) => {
    const powers = []
    for(var i = 20; i <= 100; i += 10) {
        powers.push(<option key={ i } value={ i }>{ i }</option>)
    }

    let divStyle = {
        width: '100%',
        marginTop: '.3rem',
        marginBottom: '.5rem',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", width: "40%"}}>
            <div className="uk-form-label">強度</div>
            <div className="uk-form-control" style={divStyle} >
                <StyledSelect className="uk-select" name="power" value={ props.power } onChange={props.changed}>
                    { powers }
                </StyledSelect>
                <span>%</span>
            </div>
        </div>
    )
}

var bleMod;
const Lovense = (props) => {
    dispatch = useDispatch();
    const [mode, setMode] = useState('WHITE');
    const [power, setPower] = useState(60);
    const [typeSel, setTypeSel] = useState("CYC");
    const [deviceName, setDeviceName] = useState("");
    const [vorzeConnected, setVorzeConnected] = useState(false);
    const [modalState, setModalState] = useState('connecting');
    const [uuid, setUuid] = useState("");
    const [bleName, setBleName] = useState("");

    const bleState = useSelector( state => state.bleManage );
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";

    useEffect(() => {
        bleMod = new blem();
        bleMod.GNRead(bleMod.GNUuidStrs.VZ_MODEL_R);
    }, []);

    // reset 
    useEffect(() => {
        props.settingModal === "setting" ? setModalState('setting') : setModalState('connecting');
        console.log("modalState", modalState);
        //HTMLに値を表示
        bleMod.onGNScan = function (deviceName) {
            console.log("onGNScan==========>", deviceName);
            setDeviceName(deviceName);
            setVorzeConnected(true);       
        }
        
        bleMod.onGNConnectGATT = function (uuid) {
            console.log("onGNConnectGATT============>:" + uuid);
            console.log('UUID Name : ' + uuid);
            console.log('Connect Status : Connected');
            setBleName(props.device);
            setUuid(bleMod.GNUuidStrs.VZ_MODEL_R);
            dispatch(bleManage.bleConnect({name: props.device, uuid: bleMod.GNUuidStrs.VZ_MODEL_R}));
        };     
  
        bleMod.onGNRead = function (uuid, value) {
            console.log("onGNRead:==---->" + uuid);
            switch (uuid) {
                case this.GNUuidStrs.VZ_MODEL_R:
                    if(document.getElementById('interval_data') !== null)
                        document.getElementById('interval_data').innerHTML = uuid;
                    break;
                case this.GNUuidStrs.MX_READ_N:
                    console.log('Battery Level : ' + value[uuid].battLevel + "%");
                    break;
            }
        }
                
        bleMod.onGNWrite = function (uuid) {
            console.log("onSyncWrite===-->");
            console.log('UUID Name : ' + uuid);
            console.log('Connect Status : Sended command');        
        }

        bleMod.onGNStartNotify = function (uuid) {
            console.log("onGNStartNotify===>")
        }
        
        bleMod.onGNClear = function () {
            console.log("onGNClear------->");
        }

        bleMod.onGNReset = function () {
            console.log("onGNReset------>");
        }
                
        bleMod.onGNError = function (error) {
            console.log("vorze====>", error);
            // if(error !== "No Bluetooth Device" && error !== "Bluetooth Device is already disconnected")
            //     alert(error);
            // closeModal();
        } 
    }, [deviceName]);

    //リセットボタンの処理
    const activeHandler = () => {
        let typeUUID = bleMod.GNUuidStrs.VZ_COMM_W;
        bleMod.VZPatternStart(bleMod.GNUuidStrs[typeUUID], mode, power, typeSel);
        // bleMod.VZPatternStart(bleMod.GNUuidStrs[typeUUID], bleMod.VZPattern[modeStr], bleMod.VZCommInterval[modeStr],powerVal, typeName);
        
        //★★★パターンは自作も可能★★★
        // bleMod.LVPatternStart(bleMod.GNUuidStrs.VZ_COMM_W, [30, 30, 60, 60, 90, 90, 0], powerVal, typeName);
    }

    //停止ボタンの処理
    const disactiveHandler = () => {
        let typeUUID = bleMod.GNUuidStrs.VZ_COMM_W;
        bleMod.VZPatternStop(bleMod.GNUuidStrs[typeUUID], typeSel);
    }

    //連続送信ボタンの処理
    const intervalHandler = () => {
        let typeUUID = bleMod.GNUuidStrs.VZ_COMM_W;
        var count = 0;
        var countup = function () {
            console.log('Time:' + performance.now() + '/Times:' + count++);
            switch (count % 2) {
                case 0:
                    bleMod.VZPatternStart(bleMod.GNUuidStrs[typeUUID], mode, power, typeSel);
                    break;
                default:
                    bleMod.VZPatternStop(bleMod.GNUuidStrs[typeUUID], typeSel);
    
            }
            var id = setTimeout(countup, 200);
            if (count > 6) {
                clearTimeout(id); //idをclearTimeoutで指定している
            }
        }
    
        countup();
    }

    const resetState = () => {
        bleMod.GNReset();
        setTypeSel('CYC');
        setMode('WHITE');
        setPower(60);
        dispatch(bleManage.bleRemove({device_name: bleName, uuid: uuid}));
    }

    const BLESettingHandler = () => {
        setModalState('setting');
    }

    const handleCancel = () => {
        setTypeSel('CYC');
        setMode('WHITE');
        setPower(60);
        dispatch(bleManage.bleSetting({ device_name: bleName, uuid: uuid, device_mode: mode, device_power: power, device_type: typeSel}));
        props.SettingChange();
    }

    const closeModal = () => {
        setTypeSel('CYC');
        setMode('WHITE');
        setPower(60);
        props.SettingChange();
    }

    const handleSetting = () => {
        dispatch(bleManage.bleSetting({ device_name: bleName, uuid: uuid, device_mode: mode, device_power: power, device_type: typeSel}));
        props.SettingChange();
    }


    const connectingModal = (
        vorzeConnected ? (
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
                    <Text str="機種選択(機種変更時は、リセットが必要です)" color="#313131"></Text>
                </Div>
                <Div width="90%" margin="1rem 0 0 0" padding="0" justify="flex-start" direction="row">
                    <GenerateType typeSel={typeSel} changed={ (e) => setTypeSel(e.target.value) } />
                </Div>
                <Div width="90%" margin="1rem 0 0 0" padding="0" justify="flex-start">
                    <Text str="未接続時は接続のみ実行" color="#313131"></Text>
                </Div>
                <Div width="90%" margin="1rem 0 0 0" padding="0" justify="flex-start" direction="row">
                    <GenerateMode mode={mode} changed={ (e) => setMode(e.target.value) } />
                    <GeneratePower power={power} changed={ (e) => setPower(e.target.value) } />
                </Div>
                <Div width="90%" margin=".5rem 0 1rem 0" padding="0" justify="flex-start">
                    <Btn width="25%" radius="20px" id="sw-on" border="none" backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1rem 0 0" text={Constants.START} onClick={ () => activeHandler(1) } />
                    <Btn width="25%" radius="20px" id="sw-off" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding=".5rem 2rem" margin="0 1rem" text={Constants.STOP} onClick={ () => disactiveHandler(1) } />
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


export default Lovense;