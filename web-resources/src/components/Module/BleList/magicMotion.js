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

const GenerateMode1 = (props) => {
    const modes = []
    for(var key in Constants.MAGIC_MODE_LIST) {
        modes.push(<option key={ key } value={ key }>{ Constants.MAGIC_MODE_LIST[key] }</option>)
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
                <StyledSelect className="uk-select" name="mode1" value={ props.mode1 } onChange={props.changed}>
                    { modes }
                </StyledSelect>
            </div>
        </React.Fragment>
    )
}

const GenerateMode2 = (props) => {
    const modes = []
    for(var key in Constants.MAGIC_MODE_LIST) {
        modes.push(<option key={ key } value={ key }>{ Constants.MAGIC_MODE_LIST[key] }</option>)
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
                <StyledSelect className="uk-select" name="mode2" value={ props.mode2 } onChange={props.changed}>
                    { modes }
                </StyledSelect>
            </div>
        </React.Fragment>
    )
}

const GeneratePower1 = (props) => {
    const powers = [<option key='1' value='1' >1</option>]
    for(var i = 10; i <= 100; i += 10) {
        powers.push(<option key={ i } value={ i }>{ i }</option>)
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
                <StyledSelect className="uk-select" name="power1" value={ props.power1 } onChange={props.changed}>
                    { powers }
                </StyledSelect>
                <span>%</span>
            </div>
        </React.Fragment>
    )
}
const GeneratePower2 = (props) => {
    const powers = [<option key='1' value='1' >1</option>]
    for(var i = 10; i <= 100; i += 10) {
        powers.push(<option key={ i } value={ i }>{ i }</option>)
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
                <StyledSelect className="uk-select" name="power2" value={ props.power2 } onChange={props.changed}>
                    { powers }
                </StyledSelect>
                <span>%</span>
            </div>
        </React.Fragment>
    )
}

var bleMod;
const MagicMotion = (props) => {
    dispatch = useDispatch();
    const [mode1, setMode1] = useState('RED');
    const [mode2, setMode2] = useState('RED');
    const [power1, setPower1] = useState(60);
    const [power2, setPower2] = useState(60);
    const [deviceName, setDeviceName] = useState("");
    const [magicConnected, setMagicConnected] = useState(false);
    const [modalState, setModalState] = useState('connecting');
    const [uuid, setUuid] = useState("");
    const [bleName, setBleName] = useState("");

    const bleState = useSelector( state => state.bleManage );
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";

    useEffect(() => {
        bleMod = new blem();
        bleMod.GNRead(bleMod.GNUuidStrs.MM_MNAME_R);
        bleMod.MMPatternStop(bleMod.GNUuidStrs.MM_POWER_W, 0);
        bleMod.MMPatternStop(bleMod.GNUuidStrs.MM_POWER_W, 1);
    }, []);

    // reset 
    useEffect(() => {
        props.settingModal === "setting" ? setModalState('setting') : setModalState('connecting');
        console.log("modalState", modalState);
        //HTMLに値を表示
        bleMod.onGNScan = function (deviceName) {
            console.log("onGNScan==========>", deviceName);
            setDeviceName(deviceName);
            setMagicConnected(true);       
        }
        
        bleMod.onGNConnectGATT = function (uuid) {
            console.log("onGNConnectGATT============>:" + uuid);
            console.log('UUID Name : ' + uuid);
            console.log('Connect Status : Connected');
            setBleName(props.device);
            setUuid(bleMod.GNUuidStrs.MM_MNAME_R);
            dispatch(bleManage.bleConnect({name: props.device, uuid: bleMod.GNUuidStrs.MM_MNAME_R}));
        };     
  
        bleMod.onGNRead = function (uuid, value) {
            console.log("onGNRead:==---->" + uuid);
            switch (uuid) {
                case this.GNUuidStrs.MM_MNAME_R:
                    console.log('ManName : ' + value[uuid].strVal);
                    if(document.getElementById('interval_data') !== null)
                        document.getElementById('interval_data').innerHTML = value[uuid].strVal;
    
                    break;
                case bleMod.GNUuidStrs.MM_MNUM_R:
                    //            console.log("MamName" + )
                    console.log('Device ID : ' + value[uuid].manNum);
                    break;
                case bleMod.GNUuidStrs.MM_FWVER_R:
                    console.log('FW Ver : ' + value[uuid].strVal);
                    break;
                case bleMod.GNUuidStrs.MM_HWVER_R:
                    console.log('HW Ver : ' + value[uuid].strVal);
                    break;
                case bleMod.GNUuidStrs.MM_BTT_RN:
                    console.log('Battery Level : ' + value[uuid].battLevel + '%');
                    break;
        
            }
            
        }
                
        bleMod.onGNWrite = function (uuid) {
            console.log("onSyncWrite===-->");
            console.log('Connect Status : Sended command');        
        }

        bleMod.onGNStartNotify = function (uuid) {
            console.log("onGNStartNotify")
        }        
        
        bleMod.onGNClear = function () {
            console.log("onGNClear------->");
        }

        bleMod.onGNReset = function () {
            console.log("onGNReset------>");
        }
                
        bleMod.onGNError = function (error) {
            // if(error !== "No Bluetooth Device" && error !== "Bluetooth Device is already disconnected")
            //     alert(error);
            // closeModal();
            console.log("magic_error======>", error);
        } 
    }, [deviceName]);

    //リセットボタンの処理
    const activeHandler = (index) => {
        if(index == 1){
            bleMod.MMPatternStart(bleMod.GNUuidStrs.MM_POWER_W, bleMod.MMPattern[mode1], power1, 0);//1-100
        }
        else{
            bleMod.MMPatternStart(bleMod.GNUuidStrs.MM_POWER_W, bleMod.MMPattern[mode2], power2, 1);//1-100
        }
    }

    //停止ボタンの処理
    const disactiveHandler = (index) => {
        //ボタンをアクティブ
        //    onBtn.disable = false;
        //bleMod.MMPattern(0);//0で繰り返し停止
        bleMod.MMPatternStop(bleMod.GNUuidStrs.MM_POWER_W, index - 1);
    }

    //連続送信ボタンの処理
    const intervalHandler = () => {
        var count = 0;
        var countup = function () {
            console.log('Time:' + performance.now() + '/Times:' + count++);
            switch (count % 2) {
                case 0:
                    bleMod.GNWrite(bleMod.GNUuidStrs.MM_POWER_W, "0x0bff040a6363000408226400");
                    break;
                default:
                    bleMod.GNWrite(bleMod.GNUuidStrs.MM_POWER_W, "0x0bff040a6363000408016400");
    
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
        setMode1('RED');
        setMode2('RED');
        setPower1(100);
        setPower2(100);
        dispatch(bleManage.bleRemove({device_name: bleName, uuid: uuid}));
    }

    const BLESettingHandler = () => {
        setModalState('setting');
    }

    const handleCancel = () => {
        setMode1('RED');
        setMode2('RED');
        setPower1(100);
        setPower2(100);
        dispatch(bleManage.bleSetting({device_name: bleName, uuid: uuid, device_mode1: mode1, device_mode2: mode2, device_power1: power1, device_power1: power2}));
        props.SettingChange();
    }

    const closeModal = () => {
        setMode1('RED');
        setMode2('RED');
        setPower1(100);
        setPower2(100);
        props.SettingChange();
    }

    const handleSetting = () => {
        dispatch(bleManage.bleSetting({ device_name: bleName, uuid: uuid, device_mode1: mode1, device_mode2: mode2, device_power1: power1, device_power1: power2 }));
        props.SettingChange();
    }


    const connectingModal = (
        magicConnected ? (
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
                    <Text str="未接続時は接続のみ実行" color="#313131"></Text>
                </Div>
                <Div width="90%" margin="1rem 0 0 0" padding="0" justify="flex-start" direction="row">
                    <GenerateMode1 mode={mode1} changed={ (e) => setMode1(e.target.value) } />
                    <GeneratePower1 power1={power1} changed={ (e) => setPower1(e.target.value) } />
                </Div>
                <Div width="90%" margin=".5rem 0 1rem 0" padding="0" justify="flex-start">
                    <Btn width="25%" radius="20px" id="sw-on" border="none" backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1rem 0 0" text={Constants.START} onClick={ () => activeHandler(1) } />
                    <Btn width="25%" radius="20px" id="sw-off" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding=".5rem 2rem" margin="0 1rem" text={Constants.STOP} onClick={ () => disactiveHandler(1) } />
                </Div>
                <Div width="90%" margin="1rem 0 0 0" padding="0" justify="flex-start" alignItems="flex-start" direction="column">
                    <Text str="Subモーター(Eidolonのみ有効)" color="#313131"></Text>
                    <Text str="ただし、コマンド送信間隔が近接するため誤動作の可能性あり" color="#313131"></Text>
                </Div>
                <Div width="90%" margin="1rem 0 0 0" padding="0" justify="flex-start" direction="row">
                    <GenerateMode2 mode={mode2} changed={ (e) => setMode2(e.target.value) } />
                    <GeneratePower2 power2={power2} changed={ (e) => setPower2(e.target.value) } />
                </Div>
                <Div width="90%" margin=".5rem 0 1rem 0" padding="0" justify="flex-start">
                    <Btn width="25%" radius="20px" id="sw-on" border="none" backcolor={theme_color} color="#FFF" padding=".5rem 2rem" margin="0 1rem 0 0" text={Constants.START} onClick={ () => activeHandler(2) } />
                    <Btn width="25%" radius="20px" id="sw-off" border={ `1px solid ${theme_color}` } backcolor="transparent" color={theme_color} padding=".5rem 2rem" margin="0 1rem" text={Constants.STOP} onClick={ () => disactiveHandler(2) } />
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


export default MagicMotion;