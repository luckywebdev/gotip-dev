export default {
    updatePersonalInfo: (personal_data) => {
      return { type: 'UPDATE_PERSONAL_INFO', payload: personal_data }
    },
    updatePersonalInfoSuccess: (payload) => {
      return { type: 'UPDATE_PERSONAL_INFO_SUCCESS', payload }
    },
    changeState: (payload_data) => {
      return { type: 'CHANGE_STATE', payload: payload_data }
    },
    uploadImage: (imageData) => {
      return {type: 'UPLOAD_PHOTO', payload: imageData}
    },
    updateSnsInfo: (sns_info) => {
      return {type: 'UPDATE_SNS_INFO', payload: sns_info}
    }
  }