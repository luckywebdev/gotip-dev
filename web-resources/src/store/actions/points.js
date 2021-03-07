export default {
    getPoints: (uid) => {
        return { type: 'REFRESH_POINTS', payload: uid }
    },
    convertPoints: (availablePoints) => {
        return { type: 'CONVERT_POINTS', payload: availablePoints}
    }
}