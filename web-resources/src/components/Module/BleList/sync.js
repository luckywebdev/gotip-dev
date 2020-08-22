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

const GenerateMode = (props) => {
    const modes = []
    for(var key in Constants.SYNC_MODE_LIST) {
        modes.push(<option key={ key } value={ key }>{ Constants.SYNC_MODE_LIST[key] }</option>)
    }

    let divStyle = {
    width: '30%',
    marginTop: '.3rem',
    marginBottom: '.5rem',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
    }

    return (
        <React.Fragment>
            <div className="uk-form-control" style={divStyle} >
                <StyledSelect className="uk-select" name="mode" value={ props.mode } onChange={props.changed}>
                    { modes }
                </StyledSelect>
            </div>
        </React.Fragment>
    )
}
const GenerateInnPwr = (props) => {
    const innPwrs = []
    for(var i = 0; i <= 15; i++) {
        innPwrs.push(<option key={ i } value={ i }>{ i }</option>)
    }

    let divStyle = {
        width: '30%',
        marginTop: '.3rem',
        marginBottom: '.5rem',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }

    return (
        <React.Fragment>
            <div className="uk-form-control" style={divStyle} >
                <StyledSelect className="uk-select" name="innPwr" value={ props.innPwr } onChange={props.changed}>
                    { innPwrs }
                </StyledSelect>
            </div>
        </React.Fragment>
    )
}
const GenerateOutPwr = (props) => {
    const outPwrs = []
    for(var i = 0; i <= 15; i++) {
        outPwrs.push(<option key={ i } value={ i }>{ i }</option>)
    }

    let divStyle = {
    width: '30%',
    marginTop: '.3rem',
    marginBottom: '.5rem',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
    }

    return (
        <React.Fragment>
            <div className="uk-form-control" style={divStyle} >
                <StyledSelect className="uk-select" name="outPwr" value={ props.outPwr } onChange={props.changed}>
                    { outPwrs }
                </StyledSelect>
            </div>
        </React.Fragment>
    )
}

var bleMod;
const Sync = (props) => {
    dispatch = useDispatch();
    const [mode, setMode] = useState('振動');
    const [innPwr, setInnPwr] = useState(11);
    const [outPwr, setOutPwr] = useState(11);
    const [deviceName, setDeviceName] = useState("");
    const [syncConnected, setSyncConnected] = useState(false);
    const [modalState, setModalState] = useState('connecting');
    const [uuid, setUuid] = useState("");
    const [bleName, setBleName] = useState("");

    const bleState = useSelector( state => state.bleManage );
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";

    useEffect(() => {
        bleMod = new blem();
        bleMod.GNRead(bleMod.GNUuidStrs.SY_READ_RN);
    }, []);

    // reset 
    useEffect(() => {
        props.settingModal === "setting" ? setModalState('setting') : setModalState('connecting');
        console.log("modalState", modalState);
        //HTMLに値を表示
        bleMod.onGNScan = function (deviceName) {
            console.log("onGNScan==========>", deviceName);
            setDeviceName(deviceName);
            setSyncConnected(true);       
        }
        
        bleMod.onGNConnectGATT = function (uuid) {
            console.log("onGNConnectGATT============>:" + uuid);
            console.log('UUID Name : ' + uuid);
            console.log('Connect Status : Connected');
            setBleName(props.device);
            setUuid(bleMod.GNUuidStrs.SY_READ_RN);
            dispatch(bleManage.bleConnect({name: props.device, uuid: bleMod.GNUuidStrs.SY_READ_RN}));
        };     
  
        bleMod.onGNRead = function (uuid, value) {
            console.log("onGNRead:==---->" + uuid);
    
            let data = value[uuid].readData;
    
            let hex = {}
            hex[0] = data.getUint32(0, false).toString(16)
            hex[1] = data.getUint32(4, false).toString(16)
        
        
            console.log('Read Data : 0x' + ('00000000' + hex[0]).slice(-8) + ('00000000' + hex[1]).slice(-8));
        
            if(document.getElementById('interval_data') !== null)
                document.getElementById('interval_data').innerHTML = value[uuid].status;

            console.log('Device Status  : ' + value[uuid].status);
            console.log('Battery Level : ' + value[uuid].battLevel + '%');
        
            console.log('Connect Status : Read Data');  
                  
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
            console.log("sync_error=======>", error);
            // if(error !== "No Bluetooth Device" && error !== "Bluetooth Device is already disconnected")
            //     alert(error);
            // closeModal();
        } 
    }, [deviceName]);

    //リセットボタンの処理
    const activeHandler = () => {
        //selectorの内容をセット
        const command = bleMod.SYSetMoveCommand(mode, outPwr, innPwr)
        //セットしたコマンドを送信
        bleMod.GNWrite(bleMod.GNUuidStrs.SY_WRITE_RW, command);
        //4byte:コマンド,2byte:なし,2byte:強度 　0x0f030022
        //停止コマンド：0x1e100000　　後ろ2byteはなくても動作する
    }

    //停止ボタンの処理
    const disactiveHandler = () => {
        bleMod.GNWrite(bleMod.GNUuidStrs.SY_WRITE_RW, bleMod.SYStopComm);
    }

    //連続送信ボタンの処理
    const intervalHandler = () => {
        var count = 0;
        var countup = function () {
            console.log('Time:' + performance.now() + '/Times:' + count++);
            switch (count % 2) {
                case 0:
                    bleMod.GNWrite(bleMod.GNUuidStrs.SY_WRITE_RW, "0x0f030022");
                    break;
                default:
                    bleMod.GNRead(bleMod.GNUuidStrs.SY_READ_RN);
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
        setMode('vibe');
        setInnPwr(5);
        setOutPwr(5);
        dispatch(bleManage.bleRemove({device_name: bleName, uuid: uuid}));
    }

    const BLESettingHandler = () => {
        setModalState('setting');
    }

    const handleCancel = () => {
        setMode('vibe');
        setInnPwr(5);
        setOutPwr(5);
        dispatch(bleManage.bleSetting({ device_name: bleName, uuid: uuid, device_mode: mode, device_innPwr: innPwr, device_outPwr: outPwr}));
        props.SettingChange();
    }

    const closeModal = () => {
        setMode('vibe');
        setInnPwr(5);
        setOutPwr(5);
        props.SettingChange();
    }

    const handleSetting = () => {
        dispatch(bleManage.bleSetting({ device_name: bleName, uuid: uuid, device_mode: mode, device_innPwr: innPwr, device_outPwr: outPwr}));
        props.SettingChange();
    }


    const connectingModal = (
        syncConnected ? (
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
                    <Text str="モード" color="#313131"></Text>
                </Div>
                <Div width="90%" margin="1rem 0 0 0" padding="0" justify="flex-start" direction="row">
                    {/* { generateSpeed } */}
                    <GenerateMode mode={mode} changed={ (e) => setMode(e.target.value) } />
                    <GenerateOutPwr outPwr={outPwr} changed={ (e) => setOutPwr(e.target.value) } />
                    <GenerateInnPwr innPwr={innPwr} changed={ (e) => setInnPwr(e.target.value) } />
                </Div>
                <Div width="90%" margin=".5rem 0 1rem 0" padding="0" justify="flex-start">
                    <Btn width="25%" radius="20px" id="sw-on" border="none" backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1rem 0 0" text={Constants.START} onClick={ () => activeHandler() } />
                    <Btn width="25%" radius="20px" id="sw-off" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding=".5rem 2rem" margin="0 1rem" text={Constants.STOP} onClick={ () => disactiveHandler() } />
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