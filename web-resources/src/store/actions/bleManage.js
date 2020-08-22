export default {
    bleConnect: (device) => {
      return { type: 'BLE_CONNECT', payload: device }
    },
    bleConnectSuccess: (payload) => {
      return { type: 'BLE_CONNECT_SUCCESS', payload }
    },
    bleSetting: (device) => {
      return { type: 'BLE_SETTING', payload: device }
    },
    bleRemove: (device) => {
      return { type: 'BLE_REMOVE', payload: device }
    }
}