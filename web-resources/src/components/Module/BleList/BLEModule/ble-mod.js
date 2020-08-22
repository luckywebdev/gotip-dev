//=================================================================
//  ble-mod.js
//  Web Bluetooth Control Module
//
//  Created by Gaku on 2020/03/20.
//  Copyright © 2020年 Beautiful Rain Sounds. All rights reserved.
//=================================================================

export default class {
    //constructor
    constructor() {
        this.GNBluetoothDevice = null;
        this.GNDataCharacteristic = {};
        this.GNHashUUID = {};
        this.GNHashUUID_lastConnected = "GN_DUMMY";
        this.GNReadValue = {};


        //機器固有値
        this.SYStopComm = "0x1e100000";

        this.MBBattLvlReadComm = "0x00";

        this.MMCount = [0, 0];
        this.MMTimer = [];
        this.MMCommInterval = 250; //コマンド発行間隔(mS)//アプリでの最小制御時間が平均250mSだった
        this.MMPattern = [];
        this.MMLastPattern = [];
        this.MMPattern["STOP"] = [0, -1];
        this.MMPattern["RED"] = [100, 100, 0, 0];
        this.MMPattern["LPURPLE"] = [100, 0];
        this.MMPattern["ORANGE"] = [100, 100, 0, 0, 100, 100, 0, 0, 100, 100, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0];
        this.MMPattern["LBLUE"] = [50, 0, 50, 0, 50, 0, 50, 50, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0];
        this.MMPattern["GREEN"] = [100, 0, 100, 0, 100, 0, 100, 100, 100, 100, 100, 0];
        this.MMPattern["YELLOW"] = [100, 0, 100, 0, 100, 0, 100, 0, 100, 100, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 100, 100, 0];
        this.MMPattern["BLUE"] = [100, 0, 100, 0, 100, 0, 100, 100, 100, 100, 100, 0];
        this.MMPattern["PURPLE"] = [100, 0, 100, 0, 100, 0, 100, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0];
        this.MMPattern["PINK"] = [100, 0, 100, 0, 100, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0];

        this.LVCount = 0;
        this.LVTimer = null;
        this.LVCommInterval = 600; //コマンド発行間隔(mS)//アプリでの最小制御時間は平均50mSだった
        this.LVPattern = [];
        this.LVLastPower = -1;
        this.LVPattern["STOP"] = [0, 0];
        this.LVPattern["PLUSE"] = [100, 0];
        this.LVPattern["WAVE"] = [25, 40, 55, 70, 100, 70, 55, 40, 25, 10, 10];
        this.LVPattern["FIREWORKS"] = [15, 30, 45, 60, 100, 100, 0];
        this.LVPattern["EARTHQUAKE"] = [30, 45, 60, 100, 70, 100, 70, 100, 100, 0];

        this.EGCommStr = null;
        this.EGTrNum = 0;
        this.isEGSetData = {};
        this.isEGNotify = false;
        this.EGComm = {
            "EG_OCR05ON": '0x732777',
            "EG_OCR05OFF": '0x742723',
            "EG_ROBOT": '0x4427D2'
        };
        //Egg本体にコマンド情報を送信必要な場合に通知されるコード(固有値)
        // Ex) EGResp{CommName: [command Response, Tranning Response, Illegal Response]}
        this.EGResp = {
            "EG_OCR05ON": ['08080000', '06010000', '06050000'],
            "EG_OCR05OFF": ['08080000', '06010000', '06050000'],
            "EG_ROBOT": ['08080000', '06010000', '06050000']
        }

        this.EGTraData = {
            "EG_OCR05ON": ['01123F00732777A600803DC541855074337A317B', '021283BE7483BE7483B37483BE7B32793374BFFF', '0312AAA2C4FD854F743974397483B37483BE7B83', 'FF0BBE7483B47439743973BE80'],
            "EG_OCR05OFF": ['01123F00742723A6008033C50785547B337483B3', '02127B337A337383B57A337B838F7A83B874BFFF', '0312AA79C52F855274397483B4743974397483C0', 'FF0B73377383C17383C179BE80'],
            "EG_ROBOT": ['011247004427d2a6008033c862822061834e6183', '02124dc3402361834e61834d61834e61834d6183',
            '03124961bfff8320c862822061834f61834dc345', '04122361834f61834d61834e61834e61834961be',
            'ff0180'
          ]
        };

        this.VZCount = 0;
        this.VZTimer = null;
        this.isVZFirstCount = true;
        this.CYCommInterval = {
            "STOP": 300,
            "WHITE": 1000,
            "LBLUE": 300,
            "PINK": 1000,
            "GREEN": 150,
            "YELLOW": 300,
            "BLUE": 200,
            "RED": 300
        };
        this.CYPattern = {};
        this.CYPattern["STOP"] = [0];
        this.CYPattern["WHITE"] = [-100];
        this.CYPattern["LBLUE"] = [100, -100];
        this.CYPattern["PINK"] = [100, -100];
        this.CYPattern["GREEN"] = [70, 70, 80, 80, 90, 100, -70, -70, -80, -80, -90, -100];
        this.CYPattern["YELLOW"] = [-40, -50, -60, -70, -80, -90, -100, -100, -100, -100, -100, -100, -100, -100, -1, -1];
        this.CYPattern["BLUE"] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
        this.CYPattern["RED"] = [100, 100, 100, 100, 100, -100];
        
        this.UFCommInterval = {
            "STOP": 300,
            "WHITE": 1000,
            "LBLUE": 1000,
            "PINK": 300,
            "GREEN": 1000,
            "YELLOW": 800,
            "BLUE": 400,
            "RED": 120
        };
        this.UFPattern = {};
        this.UFPattern["STOP"] = [0];
        this.UFPattern["WHITE"] = [-100];
        this.UFPattern["LBLUE"] = [100];
        this.UFPattern["PINK"] = [100, -100];
        this.UFPattern["GREEN"] = [100, -100];
        this.UFPattern["YELLOW"] = [50, 50, 50, -100];
        this.UFPattern["BLUE"] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 100, 100, 100, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, -10, -20, -30, -40, -50, -60, -70, -80, -90, -100, -100, -100, -100, -100, -90, -80, -70, -60, -50, -40, -30, -20, -10];
        this.UFPattern["RED"] = [100, -100, 100, -100, 100, -100, 100, -100, 100, -100, 100, -100, 100, -100, 100, -100, 100, -100, 100, -100, 100, -100];

                this.VZLastPower = -1;

        //delegate
        this.onGNScan = function (deviceName) {
            console.log("onGNScan");
        };
        this.onGNConnectGATT = function (uuid) {
            console.log("onGNConnectGATT");
        };
        this.onGNRead = function (uuid, value) {
            console.log("onGNRead")
        }
        this.onGNWrite = function (uuid) {
            console.log("onGNWrite");
        };
        this.onGNStartNotify = function (uuid) {
            console.log("onGNStartNotify");
        };
        this.onGNStopNotify = function (uuid) {
            console.log("onGNStopNotify");
        };
        this.onGNDisconnect = function () {
            console.log("onGNDisconnect");
        };
        this.onGNClear = function () {
            console.log("onGNClear");
        };
        this.onGNReset = function () {
            console.log("onGNReset");
        };
        this.onGNError = function (error) {
            console.log("onGNError");
        };


        this.GNUuidStrs = {
            "SY_READ_RN": "SY_READ_RW",
            "SY_WRITE_RW": "SY_WRITE_RW",
            "MB_LNAME_RW": "MB_LNAME_RW",
            "MB_DUTY_RW": "MB_DUTY_RW",
            "MB_DEV_ID_R": "MB_DEV_ID_R",
            "MB_VER_R": "MB_VER_R",
            "MB_BTT_WN": "MB_BTT_WN",
            "MM_BTT_RN": "MM_BTT_RN",
            "MM_MNAME_R": "MM_MNAME_R",
            "MM_MNUM_R": "MM_MNUM_R",
            "MM_FWVER_R": "MM_FWVER_R",
            "MM_HWVER_R": "MM_HWVER_R",
            "MM_POWER_W": "MM_POWER_W",
            "LS_READ_N": "LS_READ_N",
            "LS_WRITE_W": "LS_WRITE_W",
            "MX_READ_N": "MX_READ_N",
            "MX_WRITE_W": "MX_WRITE_W",
            "MX_PWRITE_W": "MX_PWRITE_W",
            "EG_CHAR1_RWN": "EG_CHAR1_RWN",
            //            "EG_CHAR2_RW": "EG_CHAR2_RW",
            //            "EG_CHAR3_RW": "EG_CHAR3_RW",
            //            "EG_CHAR4_RW": "EG_CHAR4_RW",
            //            "EG_CHAR5_RW": "EG_CHAR5_RW",
            //            "EG_CHAR6_RW": "EG_CHAR6_RW",
            "EG_CHAR7_RW": "EG_CHAR7_RW",
            //            "EG_CHAR8_RW": "EG_CHAR8_RW",
            "EG_CHAR9_RW": "EG_CHAR9_RW",
            //            "EG_CHARA_RW": "EG_CHARA_RW",
            //            "EG_CHARB_RW": "EG_CHARB_RW",
            //            "EG_CHARC_RW": "EG_CHARC_RW",
            //            "EG_CHARD_RW": "EG_CHARD_RW",
            //            "EG_CHARE_RW": "EG_CHARE_RW",
            //            "EG_CHARF_RW": "EG_CHARF_RW",
            "VZ_COMM_W": "VZ_COMM_W",
            "VZ_MODEL_R": "VZ_MODEL_R",
            "VZ_SPEC_R": "VZ_SPEC_R",
            "VZ_FWVER_R": "VZ_FWVER_R",
            "VZ_DFUCTL_W": "VZ_DFUCTL_W",
            "VZ_DEVICE_R": "VZ_DEVICE_R",
            "GT_SYS_ID_R": "GT_SYS_ID_R",
            "GT_MOD_NUM_R": "GT_MOD_NUM_R",
            "GT_SER_NUM_R": "GT_SER_NUM_R",
            "GT_FW_REV_R": "GT_FW_REV_R",
            "GT_HW_REV_R": "GT_HW_REV_R",
            "GT_SW_REV_R": "GT_SW_REV_R",
            "GT_MAN_NAME_R": "GT_MAN_NAME_R",
            "GT_REG_CER_R": "GT_REG_CER_R",
            "GT_PNP_ID_R": "GT_PNP_ID_R",
            "GT_BAT_LVL_R": "GT_BAT_LVL_R"
        }

        //サービス、キャラクタリスティっくを準備
        this.GNSetUUID("GN_DUMMY", "00001800-0000-1000-8000-00805f9b34fb", "00001800-0000-1000-8000-00805f9b34fb");
        this.GNSetUUID(this.GNUuidStrs.SY_READ_RN, "f000bb03-0451-4000-b000-000000000000", "f000b000-0451-4000-b000-000000000000");
        this.GNSetUUID(this.GNUuidStrs.SY_WRITE_RW, "f000bb03-0451-4000-b000-000000000000", "f000c000-0451-4000-b000-000000000000");
        this.GNSetUUID(this.GNUuidStrs.MB_LNAME_RW, "b9f54000-d813-46c6-8b61-b453ee2c74d9", "b9f54001-d813-46c6-8b61-b453ee2c74d9");
        this.GNSetUUID(this.GNUuidStrs.MB_DEV_ID_R, "b9f54000-d813-46c6-8b61-b453ee2c74d9", "b9f54002-d813-46c6-8b61-b453ee2c74d9");
        this.GNSetUUID(this.GNUuidStrs.MB_VER_R, "b9f54000-d813-46c6-8b61-b453ee2c74d9", "b9f54003-d813-46c6-8b61-b453ee2c74d9");
        this.GNSetUUID(this.GNUuidStrs.MB_DUTY_RW, "b9f5ff00-d813-46c6-8b61-b453ee2c74d9", "b9f53006-d813-46c6-8b61-b453ee2c74d9");
        this.GNSetUUID(this.GNUuidStrs.MB_BTT_WN, "b9f5ff00-d813-46c6-8b61-b453ee2c74d9", "b9f51001-d813-46c6-8b61-b453ee2c74d9");
        this.GNSetUUID(this.GNUuidStrs.MM_BTT_RN, "0000180f-0000-1000-8000-00805f9b34fb", "00002a19-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.MM_MNAME_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a29-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.MM_MNUM_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a24-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.MM_FWVER_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a26-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.MM_HWVER_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a27-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.MM_POWER_W, "78667579-7b48-43db-b8c5-7928a6b0a335", "78667579-a914-49a4-8333-aa3c0cd8fedc")
        this.GNSetUUID(this.GNUuidStrs.LS_READ_N, "53300001-0023-4bd4-bbd5-a6920e4c5653", "53300003-0023-4bd4-bbd5-a6920e4c5653")
        this.GNSetUUID(this.GNUuidStrs.LS_WRITE_W, "53300001-0023-4bd4-bbd5-a6920e4c5653", "53300002-0023-4bd4-bbd5-a6920e4c5653")
        this.GNSetUUID(this.GNUuidStrs.MX_READ_N, "42300001-0023-4bd4-bbd5-a6920e4c5653", "42300003-0023-4bd4-bbd5-a6920e4c5653")
        this.GNSetUUID(this.GNUuidStrs.MX_WRITE_W, "42300001-0023-4bd4-bbd5-a6920e4c5653", "42300002-0023-4bd4-bbd5-a6920e4c5653")
        this.GNSetUUID(this.GNUuidStrs.MX_PWRITE_W, "42300001-0023-4bd4-bbd5-a6920e4c5653", "42300002-0023-4bd4-bbd5-a6920e4c5653")
        this.GNSetUUID(this.GNUuidStrs.EG_CHAR1_RWN, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fff1-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHAR2_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fff2-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHAR3_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fff3-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHAR4_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fff4-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHAR5_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fff5-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHAR6_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fff6-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.EG_CHAR7_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fff7-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHAR8_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fff8-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.EG_CHAR9_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fff9-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHARA_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fffa-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHARB_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fffb-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHARC_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fffc-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHARD_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fffd-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHARE_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000fffe-0000-1000-8000-00805f9b34fb")
        //        this.GNSetUUID(this.GNUuidStrs.EG_CHARF_RW, "0000fff0-0000-1000-8000-00805f9b34fb", "0000ffff-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.VZ_COMM_W, "40ee1111-63ec-4b7f-8ce7-712efd55b90e", "40ee2222-63ec-4b7f-8ce7-712efd55b90e")
        this.GNSetUUID(this.GNUuidStrs.VZ_MODEL_R, "40ee1111-63ec-4b7f-8ce7-712efd55b90e", "40ee3333-63ec-4b7f-8ce7-712efd55b90e")
        this.GNSetUUID(this.GNUuidStrs.VZ_SPEC_R, "40ee1111-63ec-4b7f-8ce7-712efd55b90e", "40ee4444-63ec-4b7f-8ce7-712efd55b90e")
        this.GNSetUUID(this.GNUuidStrs.VZ_FWVER_R, "40ee0200-63ec-4b7f-8ce7-712efd55b90e", "40ee0201-63ec-4b7f-8ce7-712efd55b90e")
        this.GNSetUUID(this.GNUuidStrs.VZ_DFUCTL_W, "40ee0200-63ec-4b7f-8ce7-712efd55b90e", "40ee0202-63ec-4b7f-8ce7-712efd55b90e")
        this.GNSetUUID(this.GNUuidStrs.VZ_DEVICE_R, "40ee0200-63ec-4b7f-8ce7-712efd55b90e", "40ee0203-63ec-4b7f-8ce7-712efd55b90e")
        this.GNSetUUID(this.GNUuidStrs.GT_SYS_ID_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a23-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.GT_MOD_NUM_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a24-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.GT_SER_NUM_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a25-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.GT_FW_REV_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a26-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.GT_HW_REV_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a27-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.GT_SW_REV_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a28-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.GT_MAN_NAME_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a29-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.GT_REG_CER_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a2a-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.GT_PNP_ID_R, "0000180a-0000-1000-8000-00805f9b34fb", "00002a50-0000-1000-8000-00805f9b34fb")
        this.GNSetUUID(this.GNUuidStrs.GT_BAT_LVL_R, "0000180f-0000-1000-8000-00805f9b34fb", "00002a19-0000-1000-8000-00805f9b34fb")
    }


    GNSetUUID(name, serviceUUID, characteristicUUID) {
        // console.log('Execute : GNSetUUID');
        // console.log(this.GNHashUUID);
        this.GNHashUUID[name] = {
            'serviceUUID': serviceUUID,
            'characteristicUUID': characteristicUUID
        };
    }

    //Scan 周辺機器を検索
    GNScan(uuid) {
        return (this.GNBluetoothDevice ? Promise.resolve() : this.GNRequestDevice(uuid))
            .catch(error => {
                console.log('Error : ' + error);
                this.onGNError(error);
            });
    }

    GNScanDevice() {
        if (this.GNBluetoothDevice) {
            console.log('Info : Use webBLE -> beforeChangeReset');
            this.GNReset();
        }

        this.GNRequestDevice()
        .then((res) => {
            console.log("scan_result", res);
        })
        .catch(error => {
            console.log('Error : ' + error);
            this.onGNError(error);
        });
    }


    //requestDevice
    GNRequestDevice(uuid) {
        console.log('Execute : GNRequestDevice');
        return navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                //            filters: [
                //                {name: 'Sync'}//,
                ////                {namePrefix: 'Sync'},
                ////                {services: "f000bb03-0451-4000-b000-000000000000"}
                //            ],
                //                optionalServices: [this.GNHashUUID[uuid].serviceUUID]//この記述は、複数のサービスがある場合対応できないと思われる。
                optionalServices: [this.GNHashUUID["SY_READ_RW"].serviceUUID, this.GNHashUUID["MB_LNAME_RW"].serviceUUID, this.GNHashUUID["MB_DUTY_RW"].serviceUUID, this.GNHashUUID["MM_BTT_RN"].serviceUUID, this.GNHashUUID["MM_MNAME_R"].serviceUUID, this.GNHashUUID["MM_POWER_W"].serviceUUID, this.GNHashUUID["LS_READ_N"].serviceUUID, this.GNHashUUID["MX_READ_N"].serviceUUID, this.GNHashUUID["EG_CHAR1_RWN"].serviceUUID, this.GNHashUUID["VZ_COMM_W"].serviceUUID, this.GNHashUUID["VZ_FWVER_R"].serviceUUID]
            })
            .then(device => {
                console.log("requestDevice=======>", device);
                this.GNBluetoothDevice = device;
                this.GNBluetoothDevice.addEventListener('gattserverdisconnected', this.onGNDisconnect);
                this.onGNScan(this.GNBluetoothDevice.name);
            });
    }

    GNConnectGATT(uuid) {
        if (!this.GNBluetoothDevice) {
            let error = "No Bluetooth Device";
            console.log('Error : ' + error);
            this.onGNError(error);
            return;
        }
        console.log('INFO : conn?' + this.GNBluetoothDevice.gatt.connected + '/chr?' + uuid);
        if (this.GNBluetoothDevice.gatt.connected && this.GNDataCharacteristic) {
            console.log('INFO : lastuuid:' + this.GNHashUUID_lastConnected + '/currentuuid:' + uuid);
            //uuidが前回と同じか、前回のサービスと同じ場合
            if (this.GNHashUUID_lastConnected == uuid || this.GNHashUUID[this.GNHashUUID_lastConnected].serviceUUID == this.GNHashUUID[uuid].serviceUUID) {
                console.log('INFO : Promise.resolve()');
                return Promise.resolve();
            } else {
                console.log('Info : 違うCharacteristic');
            }
        }
        this.GNHashUUID_lastConnected = uuid;

        console.log('Execute : connect');
        return this.GNBluetoothDevice.gatt.connect()
            .then(server => {
                console.log('Execute : getPrimaryService' + uuid);
                return server.getPrimaryService(this.GNHashUUID[uuid].serviceUUID);
            })
            .then(service => {
                console.log('Execute : getCharacteristic');
                let promiseItems = [];
                for (let uuidStr in this.GNUuidStrs) {
                    //console.log(`INF0-FOR1:` + this.GNHashUUID[this.GNUuidStrs[uuidStr]].serviceUUID);
                    if (this.GNHashUUID[uuid].serviceUUID == this.GNHashUUID[this.GNUuidStrs[uuidStr]].serviceUUID) {
                        console.log(`INF0-FOR2:` + uuidStr);
                        promiseItems.push(service.getCharacteristic(this.GNHashUUID[this.GNUuidStrs[uuidStr]].characteristicUUID)
                            .then(characteristic => {
                                this.GNSetChar(this.GNUuidStrs[uuidStr], characteristic);
                            }));
                    }
                }
                console.log(`INF0-FOR-ALL:` + promiseItems);
                return Promise.all(promiseItems)
            })
            .catch(error => {
                console.log('ErrorC : ' + error);
                this.onGNError(error);
            });
    }

    GNSetChar(uuid, characteristic) {
        console.log('Log : ' + uuid + characteristic);
        this.GNDataCharacteristic[uuid] = characteristic;
        this.GNDataCharacteristic[uuid].addEventListener('characteristicvaluechanged', this.GNDataChanged(this, uuid));
        switch (uuid) {
            case this.GNUuidStrs.EG_CHAR1_RWN:
                if (!this.isEGNotify) {
                    this.isEGNotify = true;
                    console.log('Execute : startNotifications');
                    this.GNDataCharacteristic[this.GNUuidStrs.EG_CHAR1_RWN].startNotifications();
                }
        }
        this.onGNConnectGATT(uuid);
    }

    //webBLEでのイベントは注意が必要(本来はReadの時も呼ばれるはずだが、WebBLEでは呼ばれない)
    GNDataChanged(self, uuid) {

        return function (event) {
            console.log("EVENT : Change Value :" + uuid);
            switch (uuid) {
                case self.GNUuidStrs.MB_BTT_WN:
                    self.GNReadValue[uuid] = {
                        battLevel: (event.target.value.getUint8(0) * 0.0141).toFixed(2)
                    };
                    self.onGNRead(uuid, self.GNReadValue);
                    break;

                case self.GNUuidStrs.LS_READ_N:
                case self.GNUuidStrs.MX_READ_N:
                    let hexVal = event.target.value;
                    console.log(`INFO: ${hexVal.getUint8(0).toString(16)}${hexVal.getUint8(1).toString(16)}`)
                    if (hexVal.getUint8(0) >= 48 && hexVal.getUint8(0) <= 57) {
                        let battStr = "";
                        let bitCnt = 0;
                        while (hexVal.getUint8(bitCnt) != 59) {
                            battStr += String.fromCharCode(hexVal.getInt8(bitCnt));
                            bitCnt += 1;
                        }
                        console.log(`LV_CHGVAL:${battStr}%`);
                        self.GNReadValue[uuid] = {
                            battLevel: battStr
                        };

                        self.onGNRead(uuid, self.GNReadValue);
                    }

                    break;
                case self.GNUuidStrs.EG_CHAR1_RWN:
                    console.log("INFO:EggDataChanged");
                    console.log("EGG:" + event.target.value);
                    self.EGSetData(uuid, event.target.value);
                    break;


            }
        }
    }

    GNRead(uuid) {
        //webBLE対応
        if (this.GNBluetoothDevice && this.isGNWebBLE(uuid)) {
            console.log('Info : Use webBLE -> beforeChangeReset');
            this.GNReset();
        }
        return (this.GNScan(uuid))
            .then((res) => {
                console.log("gnscann_res", res);
                return this.GNConnectGATT(uuid);
            })
            .then((res) => {
                console.log('Execute : readValue==>', res);
                return this.GNDataCharacteristic[uuid].readValue();
            })
            .then(value => {
                console.log('Execute : process Read Value:' + uuid);
                switch (uuid) {
                    case this.GNUuidStrs.MB_LNAME_RW:
                    case this.GNUuidStrs.MM_MNAME_R:
                    case this.GNUuidStrs.MM_FWVER_R:
                    case this.GNUuidStrs.MM_HWVER_R:
                        console.log('Info Val: ' + new TextDecoder("utf-8").decode(value));
                        this.GNReadValue[uuid] = {
                            strVal: new TextDecoder("utf-8").decode(value)
                        };
                        break;
                    case this.GNUuidStrs.SY_READ_RN:
                        console.log('Info Val :' + value);
                        //動作状態取得
                        let devStatStr = this.syncGetDeviceStatus(value);
                        //バッテリー情報取得
                        let battLvl = this.syncGetBattStatus(value);
                        this.GNReadValue[uuid] = {
                            readData: value,
                            status: devStatStr,
                            battLevel: battLvl
                        };
                        break;
                    case this.GNUuidStrs.MB_DEV_ID_R:
                        const hexDev = [];
                        hexDev[0] = value.getUint32(0, false).toString(16);
                        hexDev[1] = value.getUint32(4, false).toString(16);
                        let str = '0x' + ('00000000' + hexDev[0]).slice(-8) + ('00000000' + hexDev[1]).slice(-8);
                        console.log('Info Val :' + str);
                        this.GNReadValue[uuid] = {
                            devid: str
                        };
                        break;
                    case this.GNUuidStrs.MB_VER_R:
                        const hexVer = [];
                        hexVer[0] = value.getUint8(0, false).toString(16);
                        hexVer[1] = value.getUint8(2, false).toString(16);
                        console.log('Info Val FW:' + hexVer[0] + ' HW:' + hexVer[1]);
                        this.GNReadValue[uuid] = {
                            fwVer: hexVer[0],
                            hwVer: hexVer[1]
                        };
                        break;
                    case this.GNUuidStrs.MM_MNUM_R:
                        const MMMNum = []
                        MMMNum[0] = value.getUint32(0, false).toString(16);
                        const MMMNamestr = '0x' + ('00000000' + MMMNum[0]).slice(-8);
                        console.log('Info Val :' + MMMNamestr);
                        this.GNReadValue[uuid] = {
                            manNum: MMMNamestr
                        };
                        break;
                    case this.GNUuidStrs.MM_BTT_RN:
                        this.GNReadValue[uuid] = {
                            battLevel: value.getUint8(0)
                        };
                        break;
                    case this.GNUuidStrs.EG_CHAR1_RWN:
                        console.log("EGGonRead")
                        this.GNReadValue[uuid] = {
                            eggval: "EggVal"
                        };
                        break;
                    case this.GNUuidStrs.GT_BAT_LVL_R:
                        console.log("EGG_Bat_Lvl")
                        this.GNReadValue[uuid] = {
                            battLevel: value.getUint8(0)
                        }
                        break;
                }
                console.log("READ VAL :", uuid, this.GNReadValue);
                this.onGNRead(uuid, this.GNReadValue);
            })
            .catch(error => {
                console.log('Error : ' + error);
                this.onGNError(error);
            });
    }

    GNWrite(uuid, moveCommand) {
        //webBLE対応
        if (this.GNBluetoothDevice && this.isGNWebBLE(uuid)) {
            console.log('Info : Use webBLE -> beforeChangeReset');
            this.GNReset();
        }
        return (this.GNScan(uuid))
            .then(() => {
                return this.GNConnectGATT(uuid);
            })
            .then(() => {
                console.log('Execute : writeValue', moveCommand, this.EGtrainingpoint);
                var dataView = null;
                switch (uuid) {
                    case this.GNUuidStrs.SY_WRITE_RW:
                        var buffer = new ArrayBuffer(4);
                        var dataView = new DataView(buffer);
                        dataView.setUint32(0, moveCommand);
                        break;
                    case this.GNUuidStrs.MB_DUTY_RW:
                        var buffer = new ArrayBuffer(5);
                        var dataView = new DataView(buffer);
                        dataView.setUint32(0, moveCommand);
                        break;
                    case this.GNUuidStrs.MB_BTT_WN:
                        var buffer = new ArrayBuffer(1);
                        var dataView = new DataView(buffer);
                        dataView.setUint8(0, moveCommand);
                        break;
                    case this.GNUuidStrs.MM_POWER_W:
                    case this.GNUuidStrs.MX_PWRITE_W:
                        var buffer = new ArrayBuffer(12);
                        var dataView = new DataView(buffer);
                        dataView.setUint32(0, '0x' + moveCommand.substr(2, 8));
                        dataView.setUint32(4, '0x' + moveCommand.substr(10, 8));
                        dataView.setUint32(8, '0x' + moveCommand.substr(18, 8));
                        console.log("INFO WDATA : " + dataView.getUint32(0).toString(16) + dataView.getUint32(4).toString(16) + dataView.getUint32(8).toString(16));
                        break;
                    case this.GNUuidStrs.LS_WRITE_W:
                    case this.GNUuidStrs.MX_WRITE_W:
                        var buffer = new ArrayBuffer(11);
                        var dataView = new DataView(buffer);
                        dataView.setUint32(0, '0x' + moveCommand.substr(2, 8));
                        dataView.setUint32(4, '0x' + moveCommand.substr(10, 8));
                        dataView.setUint16(8, '0x' + moveCommand.substr(18, 4));
                        dataView.setUint8(10, '0x' + moveCommand.substr(22, 2));
                        console.log("INFO WDATA : " + dataView.getUint32(0).toString(16) + dataView.getUint32(4).toString(16) + dataView.getUint16(8).toString(16) + dataView.getUint8(10).toString(16));
                        break;
                    case this.GNUuidStrs.EG_CHAR7_RW:
                        dataView = this.GNStr2DataView(moveCommand);
                        break;
                    case this.GNUuidStrs.EG_CHAR9_RW:
                        for (const key in this.EGComm) {
                            if (this.EGComm[key] == moveCommand) {
                                console.log("KEY", key, "VAL:", this.EGComm[key]);
                                this.EGCommStr = key;
                            }
                        }
                        dataView = this.GNStr2DataView(moveCommand);
                        break;
                    case this.GNUuidStrs.VZ_COMM_W:
                        dataView = this.GNStr2DataView(moveCommand);
                        break;

                }
                console.log("WRITE", uuid, dataView)
                return this.GNDataCharacteristic[uuid].writeValue(dataView, true);
                //return this.GNDataCharacteristic.writeValue(dataView, {
                //  response: 'auto'
                //});
            })
            .then(() => {
                console.log('Execute : onGNWrite');
                this.onGNWrite(uuid);
            })
            .catch(error => {
                console.log('Error : ' + error);
                this.onGNError(error);
            });
    }

    GNStartNotify(uuid) {
        //webBLE対応
        if (this.GNBluetoothDevice && this.isGNWebBLE(uuid)) {
            console.log('Info : Use webBLE -> beforeChangeReset');
            this.GNReset();
        }
        this.isEGNotify = true;
        return (this.GNScan(uuid))
            .then(() => {
                return this.GNConnectGATT(uuid);
            })
            .then(() => {
                console.log('Execute : startNotifications');
                this.GNDataCharacteristic[uuid].startNotifications();
            })
            .then(() => {
                this.onGNStartNotify(uuid);
            })
            .catch(error => {
                console.log('Error : ' + error);
                this.onGNError(error);
            });
    }

    GNStopNotify(uuid) {
        //webBLE対応
        if (this.GNBluetoothDevice && this.isGNWebBLE(uuid)) {
            console.log('Info : Use webBLE -> beforeChangeReset');
            this.GNReset();
        }
        this.isEGNotify = false;
        return (this.GNScan(uuid))
            .then(() => {
                return this.GNConnectGATT(uuid);
            })
            .then(() => {
                console.log('Execute : stopNotifications');
                this.GNDataCharacteristic.stopNotifications();
            })
            .then(() => {
                this.onGNStopNotify(uuid);
            })
            .catch(error => {
                console.log('Error : ' + error);
                this.onGNError(error);
            });
    }

    GNDisconnect() {
        if (!this.GNBluetoothDevice) {
            var error = "No Bluetooth Device";
            console.log('Error : ' + error);
            this.onGNError(error);
            return;
        }

        if (this.GNBluetoothDevice.gatt.connected) {
            console.log('Execute : disconnect');
            //Egg初期化
            this.isEGNotify = false;
            this.EGCommStr = null;
            this.GNBluetoothDevice.gatt.disconnect();
        } else {
            var error = "Bluetooth Device is already disconnected";
            console.log('Error : ' + error);
            this.onGNError(error);
            return;
        }
    }

    GNClear() {
        console.log('Excute : Clear Device and Characteristic');
        this.GNBluetoothDevice = null;
        this.GNDataCharacteristic = [];
        this.GNHashUUID_lastConnected = "GN_DUMMY";
        this.onGNClear();
    }

    //reset
    GNReset() {
        console.log('Excute : reset');
        this.GNDisconnect(); //GNDisconnect() is not Promise Object
        this.GNClear();
        this.onGNReset();
    }

    GNStr2DataView(commStr) {
        const regPatt = /^0x/
        if (commStr.search(/^0x/) == 0) {
            commStr = commStr.slice(2 - commStr.length)
        }
        let bitLength = commStr.length / 2;
        let buffer = new ArrayBuffer(bitLength);
        let dataView = new DataView(buffer);
        for (let n = 0; n < bitLength; n++) {
            dataView.setUint8(n, '0x' + commStr.substr((n * 2), 2));
        }
        return dataView;
    }



    //========== webBLE関連 ==========//
    isGNWebBLE(uuid) {
        var userAgent = window.navigator.userAgent;
               console.log('Info userAgent : ' + userAgent);
        if ((userAgent.indexOf('iPhone') != -1 || userAgent.indexOf('iPad') != -1) && this.GNHashUUID_lastConnected != uuid) {
            //接続状態で、iPhone,iPadから接続している場合(webBLEを使用している場合)
            console.log('Info : Use webBLE');
            if (this.GNHashUUID[this.GNHashUUID_lastConnected].serviceUUID == this.GNHashUUID[uuid].serviceUUID) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    //========== Sync関数 ==========//
    SYSetMoveCommand(modeStr, outPwr, innPwr) {
        console.log('Execute : setCommand');
        console.log('COMM STR :' + modeStr + outPwr + innPwr)
        let buffer = new ArrayBuffer(4);
        let syncDataview = new DataView(buffer);

        switch (modeStr) {
            case "vibe":
                syncDataview.setUint16(0, 0x0f03);
                break;
            case "pulse":
                syncDataview.setUint16(0, 0x0f05);
                break;
            case "wave":
                syncDataview.setUint16(0, 0x0f07);
                break;
            case "echo":
                syncDataview.setUint16(0, 0x0f06);
                break;
            case "crest":
                syncDataview.setUint16(0, 0x0f12);
                break;
            case "tide":
                syncDataview.setUint16(0, 0x0f08);
                break;
            case "surf":
                syncDataview.setUint16(0, 0x0f0e);
                break;
            case "chachacha":
                syncDataview.setUint16(0, 0x0f0d);
                break;
            default:
                syncDataview.setUint16(0, 0x0f01); //振動弱
                break;
        }
        let syncLo4 = parseInt(outPwr).toString(16);
        let syncUp4 = parseInt(innPwr).toString(16);
        let syncPower = syncUp4 + syncLo4;

        console.log('syncPower :' + syncPower);

        syncDataview.setUint8(3, parseInt(syncPower, 16));

        //        this.moveCommand = syncDataview
        console.log('Command Return :' + syncDataview.getUint32(0, false).toString(16));
        return (syncDataview.getUint32(0, false))
    }

    //動作状態取得
    syncGetDeviceStatus(data) {
        //状態
        let devStat = data.getUint8(0, false);
        console.log('STATUS : ' + devStat);
        switch (devStat) {
            case 1:
                console.log('動作中')
                return ('working');
            case 2:
                console.log('充電中')
                return ('charging');
            case 4:
                console.log('使用可能')
                return ('available');
            default:
                console.log('状態不明')
                return ('unknown');
        }

    }

    //バッテリー情報取得
    syncGetBattStatus(data) {
        //バッテリー残量
        let battStat = data.getUint8(3, false);
        //バッテリー値：0x00 - 0xffのため、パーセント表示値を計算
        let battLvl = (battStat / 0xff * 100).toFixed()
        console.log('BATT LVL HEX : ' + battStat.toString(16) + '%');
        console.log('BATT LVL : ' + battStat / 2.55 + '%')
        console.log('BATT LVL INT : ' + battLvl + '%')
        return (battLvl);
    }


    //========== MaBeee関数 ==========//
    MBStartComm(power) {
        console.log('Execute : MaBeeeStartCommand');
        console.log('INFO VAL : ' + power);
        let commStr = "0x01";
        //calPower (max64)
        let pwrComm = parseInt(power, 10).toString(16);
        pwrComm = ('0' + pwrComm).slice(-2);
        commStr = commStr + pwrComm + "0000";
        return commStr;
    }


    //========== MagicMotion関数 ==========//
    MMStartComm(power, motorNum) {
        console.log('Execute : MagicMStartCommand');
        console.log('INFO VAL : ' + power);
        let preCommStr = "0x0bff040a6363000408";
        let sufCommStr = ["6400", "6401"];
        let commStr = "";
        if (power > 0) {
            //0x0c - 0x33 を　1から100%で強さを振り分ける。
            let maxVal = (0x33 - 0x0c).toString(10); //Max値-Min値
            //        let pwrComm = parseInt((maxVal / 100 * parseInt(power, 10)) , 16);
            let pwrComm = parseInt((maxVal / 100 * power), 10)
            pwrComm = (pwrComm + 0x0c).toString(16);;
            pwrComm = ('0' + pwrComm).slice(-2)
            console.log("POWER:" + pwrComm);
            commStr = preCommStr + pwrComm + sufCommStr[motorNum];
        } else if (power == 0) {
            commStr = preCommStr + "01" + sufCommStr[motorNum];
        } else {
            commStr = preCommStr + "00" + sufCommStr[motorNum];
        }
        console.log("COMM:" + power + "," + commStr);
        return commStr;
    }

    //ループパターンを開始（連打防止対策）
    MMPatternStart(uuid, mode, powerVal, motorNum) {
        clearTimeout(this.MMTimer[motorNum]);
        this.MMRoop(uuid, mode, powerVal, motorNum);
    }

    //ループパターンを生成
    MMRoop(uuid, mode, powerVal, motorNum) {
        if (this.GNBluetoothDevice == null || uuid != this.GNHashUUID_lastConnected) {
            console.log("BT未接続のため接続のみ行う");
            this.GNWrite(uuid, this.MMStartComm(0, 0));
            return;
        }
        console.log("INTERVAL:" + this.MMCount[motorNum]);
        if (this.MMCount[motorNum] == mode.length || this.MMCount[motorNum] == null) {
            this.MMCount[motorNum] = 0;
            if (mode == this.MMPattern.STOP) {
                console.log("ストップコマンドのため、ループを抜ける");
                return; //ストップコマンドの場合は、ループを抜ける
            }

        }
        this.MMTimer[motorNum] = setTimeout(() => {
            //コマンドの衝突を軽減するため、同じコマンドは送信しないようにする
            if ((mode[this.MMCount[motorNum] % mode.length] * powerVal) != this.MMLastPattern[motorNum]) {
                this.GNWrite(uuid, this.MMStartComm(mode[this.MMCount[motorNum] % mode.length] * powerVal / 100, motorNum));
                this.MMLastPattern[motorNum] = mode[this.MMCount[motorNum] % mode.length] * powerVal;
            } else {
                console.log("同じコマンド")
            }
            console.log("Fire:" + this.MMCount[motorNum]);
            this.MMCount[motorNum]++
            this.MMRoop(uuid, mode, powerVal, motorNum);
        }, this.MMCommInterval);
    }

    //ループパターンを停止
    MMPatternStop(uuid, motorNum) {
        if (this.GNBluetoothDevice == null || uuid != this.GNHashUUID_lastConnected) {
            console.log("BT未接続のため接続のみ行う");
            this.GNWrite(uuid, this.MMStartComm(0, 0));
            return;
        }
        clearTimeout(this.MMTimer[motorNum]);
        this.MMTimer[motorNum] = null;
        this.MMCount[motorNum] = 0;
        this.MMRoop(uuid, this.MMPattern.STOP, 100, motorNum); //停止コマンド(powerが100は、コマンド値をそのまま渡したいため)
        console.log("INTERVAL_STOP:" + this.MMTimer);
    }

    //========== Lavense関数 ==========//
    LVStartComm(power) {
        console.log('Execute : LavenseStartCommand');
        console.log('INFO VAL : ' + power);
        let preCommStr = "0x566962726174653a";
        let sufCommStr = "3b";
        let commStr = "";
        if (power > 0) {
            //0から100%までを２０段階に強さを振り分ける。
            console.log(`power ${power}`);
            let pwrStr = parseInt(power / 5);
            pwrStr = '00' + pwrStr;
            pwrStr = pwrStr.slice(-2).toString(10);
            let pwrComm = pwrStr.charCodeAt(0).toString(16) + pwrStr.charCodeAt(1).toString(16);
            console.log("POWER:" + pwrComm);
            commStr = preCommStr + pwrComm + sufCommStr;
        } else {
            commStr = preCommStr + "30" + sufCommStr;
        }
        console.log("COMM:" + power + "," + commStr);
        return commStr;
    }

    //Max動作コマンド
    MXStartComm(power) {
        console.log('Execute : MaxStartCommand');
        console.log('INFO VAL : ' + power);
        let preCommStr = "0x4169723a4c6576656c3a";
        let sufCommStr = "3b";
        let commStr = "";
        if (power > 0) {
            let pwrComm = power.toString(10).charCodeAt(0).toString(16);
            console.log("POWER:" + pwrComm);
            commStr = preCommStr + pwrComm + sufCommStr;
        } else {
            commStr = preCommStr + "30" + sufCommStr;
        }
        console.log("COMM:" + power + "," + commStr);
        return commStr;
    }

    //ループパターンを開始（連打防止対策）
    LVPatternStart(uuid, mode, powerVal, speedRatio) {
        clearTimeout(this.LVTimer);
        this.LVRoop(uuid, mode, powerVal, speedRatio);
    }

    //ループパターンを生成
    LVRoop(uuid, mode, powerVal, speedRatio) {
        if (this.GNBluetoothDevice == null) {
            console.log("BT未接続のため接続のみ行う");
            this.GNWrite(uuid, this.LVStartComm(0));
            return;
        }
        console.log("INTERVAL:" + this.LVCount);
        if (this.LVCount == mode.length || this.LVCount == null) {
            this.LVCount = 0;
            if (mode == this.LVPattern.STOP) {
                console.log("ストップコマンドのため、ループを抜ける");
                return; //ストップコマンドの場合は、ループを抜ける
            }

        }
        this.LVTimer = setTimeout(() => {
            //コマンドの衝突を軽減するため、同じコマンドは送信しないようにする
            if ((mode[this.LVCount % mode.length] * powerVal) != this.LVLastPower) {
                this.GNWrite(uuid, this.LVStartComm(mode[this.LVCount % mode.length] * powerVal / 100));
                this.LVLastPower = mode[this.LVCount % mode.length] * powerVal;
            } else {
                console.log("同じコマンド")
            }
            console.log("Fire:" + this.LVCount);
            this.LVCount++
            this.LVRoop(uuid, mode, powerVal, speedRatio);
        }, this.LVCommInterval * speedRatio);
    }

    //ループパターンを停止
    LVPatternStop(uuid, speedRatio) {
        if (this.GNBluetoothDevice == null) {
            console.log("BT未接続のため接続のみ行う");
            this.GNWrite(uuid, this.LVStartComm(0));
            return;
        }
        clearTimeout(this.LVTimer);
        this.LVTimer = null;
        this.LVCount = 0;
        this.LVRoop(uuid, this.LVPattern.STOP, 100, speedRatio); //停止コマンド(powerが100は、コマンド値をそのまま渡したいため)
        console.log("INTERVAL_STOP:" + this.LVTimer);
    }

    //========== Egg関数 ==========//
    EGSetData(uuid, resValue) {
        let value = ('00000000' + resValue.getUint32(0).toString(16)).slice(-8);
        console.log("SetData", uuid, this.EGCommStr, value, this.isEGSetData[this.EGCommStr]);
        //実行コマンド発行時(EG_CHAR9_RW)もトレーニングモードで帰ってくるため、ループを止めるための処理。
        if (this.isEGSetData[this.EGCommStr]) {
            //学習済みのEggをリセットされた場合にも動作するように、直ぐに学習なしフラグとする
            //学習フラグが何であれ、学習済みの場合は、以下のswitchでヒットしないため、再学習されることはない。
            this.isEGSetData[this.EGCommStr] = false;
            return;
        }
        switch (value) {
            case this.EGResp[this.EGCommStr][0]:
            case this.EGResp[this.EGCommStr][1]:
                //                console.log("INFO: SetTrainningData", this.EGTrNum, this.EGTraData[this.EGCommStr].length)
                //情報表示。onGNErrorで代用
                let progress = Math.round(this.EGTrNum / this.EGTraData[this.EGCommStr].length * 100);
                this.onGNError("Eggへデータ転送中です。しばらくお待ちください。<BR>" + progress + "%")

                if (this.EGTrNum < this.EGTraData[this.EGCommStr].length) {
                    this.GNWrite(this.GNUuidStrs.EG_CHAR7_RW, "0x" + this.EGTraData[this.EGCommStr][this.EGTrNum]);
                    this.EGTrNum += 1;
                } else {
                    this.GNWrite(this.GNUuidStrs.EG_CHAR9_RW, this.EGComm[this.EGCommStr]);
                    this.EGTrNum = 0;
                    this.isEGSetData[this.EGCommStr] = true;
                }
                //this.EGblockTime(100); // 1秒間処理をブロックする
                break;
            case this.EGResp[this.EGCommStr][2]:
                this.EGTrNum = 0;
                this.isEGSetData[this.EGCommStr] = false;
                this.onGNError("データ転送に失敗しました。コマンドを再実行してください。初回のみデータ転送に数秒かかる場合があります。")
                break;
        }
    }

    //========== VORZE関数 ==========//
    //ループパターンを開始（連打防止対策）
    VZPatternStart(uuid, modeStr, powerVal, typeName) {
        clearTimeout(this.VZTimer);
        this.isVZFirstCount = true;
        this.VZRoop(uuid, modeStr, powerVal, typeName);
    }

    //ループパターンを生成
    VZRoop(uuid, modeStr, powerVal, typeName) {
        if (this.GNBluetoothDevice == null) {
            console.log("BT未接続のため接続のみ行う");
            this.GNWrite(uuid, this.VZStartComm(0, typeName));
            return;
        }
        let mode = [];
        let ajustIntaval = 0;

        switch (typeName) {
            case "CYC":
                mode = this.CYPattern[modeStr];
                //周波数が変わるパターンに対応
                switch (modeStr) {
                    case "LBLUE":
                    case "PINK":
                    case "RED":
                        var interval = 100 / powerVal * this.CYCommInterval[modeStr];
                        break;
                    default:
                        var interval = this.CYCommInterval[modeStr];
                        break;
                }
                break;
            case "UFO":
                mode = this.UFPattern[modeStr];
                switch (modeStr) {
                    case "PINK":
//                    
                        var interval = 100 / powerVal * this.UFCommInterval[modeStr];
                        break;
                    case "RED":
//                        console.log("POW:")
                        var interval = parseInt(Math.pow(1.2, this.VZCount) * this.UFCommInterval[modeStr]);
                        break;
                    default:
                        var interval = this.UFCommInterval[modeStr];
                        break;
                }
                break;
        }

        console.log("INTERVAL_Cnt(VZ):" + this.VZCount);
        if (this.VZCount == mode.length || this.VZCount == null) {
            this.VZCount = 0;
            if (mode == this.CYPattern.STOP || mode == this.UFPattern.STOP) {
                console.log("ストップコマンドのため、ループを抜ける");
                return; //ストップコマンドの場合は、ループを抜ける
            }
        }

        //初回のみ待ち時間を短くする。動作コマンド処理の分岐を避けるため、初回のみインターバル時間を短くする
        if (this.isVZFirstCount) {
            ajustIntaval = interval - 100;
            this.isVZFirstCount = false;
        }
        this.VZTimer = setTimeout(() => {
            //コマンドの衝突を軽減するため、同じコマンドは送信しないようにする
            if ((mode[this.VZCount % mode.length] * powerVal) != this.VZLastPower) {
                this.GNWrite(uuid, this.VZStartComm(mode[this.VZCount % mode.length] * powerVal / 100, typeName));
                this.VZLastPower = mode[this.VZCount % mode.length] * powerVal;
            } else {
                console.log("同じコマンド")
            }
            console.log("Fire:" + this.LVCount);
            this.VZCount++
            this.VZRoop(uuid, modeStr, powerVal, typeName);
        }, (interval - ajustIntaval));
    }

    //動作コマンドを生成
    VZStartComm(power, typeName) {
        //正回転　0 − 127(0x00 - 0x79)　/　逆回転　0 - −127(0x80 - 0xff)
        console.log('Execute : StartCommand(VZ)');
        console.log('INFO VAL(VZ) : ' + power);
        let commStr = "";
        switch (typeName) {
            case "CYC":
                commStr = "0x0101";
                break;
            case "UFO":
                commStr = "0x0201";
                break;
        }
        power = parseInt(power);

        if (power <= 1 && power >= -1 && power != 0) {
            commStr += "80"; //急停止コマンド
        }
        if (power >= 0) {
            //0から127
            console.log(`powerPLUS ${power}`);
            commStr += ('00' + power.toString(16)).slice(-2);

        } else {
            //-127から0
            let pwr = -(power) + 128; //逆回転：マイナスをとって0x80を加える
            //            pwr = -(parseInt(power)) + 128;//逆回転：マイナスをとって0x80を加える
            console.log('powerMINUS', pwr, ('00' + pwr.toString(16)).slice(-2));
            commStr += ('00' + pwr.toString(16)).slice(-2);
        }
        console.log("POWER(VZ):", power, commStr);
        return commStr;
    }

    //ループパターンを停止
    VZPatternStop(uuid, typeName) {
        if (this.GNBluetoothDevice == null) {
            console.log("BT未接続のため接続のみ行う");
            this.GNWrite(uuid, this.VZStartComm(0));
            return;
        }
        clearTimeout(this.VZTimer);
        this.VZTimer = null;
        this.VZCount = 0;
        this.VZRoop(uuid, "STOP", 100, typeName); //停止コマンド(powerが100は、コマンド値をそのまま渡したいため)
        console.log("INTERVAL_STOP:" + this.VZTimer);
    }

    /*EGblockTime(timeout) {
        const startTime = Date.now();
        while (true) {
            const diffTime = Date.now() - startTime;
            if (diffTime >= timeout) {
                return; // 指定時間経過したら関数の実行を終了
            }
        }
    }*/

}
