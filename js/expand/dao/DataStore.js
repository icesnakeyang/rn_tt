import {AsyncStorage} from 'react-native'

export default class DataStore {
    fetchData(url) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).then((wrapData) => {
                console.log(1)
                if (wrapData && DataStore.checkTimeStampValid(wrapData.timestamp)) {
                    console.log(2)
                    resolve(wrapData)
                } else {
                    console.log(3)
                    this.fetchNetData(url).then((data) => {
                        resolve(this._wrapData(data))
                    }).catch((error) => {
                        reject(error)
                    })
                }
            }).catch((error) => {
                console.log(4)
                console.log(error)
                this.fetchNetData(url).then((data) => {
                    resolve(this._wrapData(data))
                }).catch((error) => {
                    reject(error)
                })
            })
        })
    }

    saveData(url, data, callback) {
        console.log('save to local')
        if (!data || !url) {
            return
        }
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
    }

    fetchLocalData(url) {
        console.log('fetch from local')
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(e)
                        console.error(e)
                    }
                } else {
                    reject(error)
                    console.error(error)
                }
            })
        })
    }

    fetchNetData(url) {
        return new Promise((resolve, reject) => {
            console.log('fetch from network')
            fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error('Network response error')
                })
                .then((responseData) => {
                    this.saveData(url, responseData)
                    resolve(responseData)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    _wrapData(data) {
        return {
            data: data,
            timestamp: new Date().getTime()
        }
    }

    static checkTimeStampValid(timestamp) {
        const currentDate = new Date()
        const targetDate = new Date()
        targetDate.setTime(timestamp)
        if (currentDate.getMonth() !== targetDate.getMonth()) {
            return false;
        }
        if (currentDate.getDate() !== targetDate.getDate()) {
            return false
        }
        if (currentDate.getHours() - targetDate.getHours() > 4) {
            return false
        }
        return true
    }
}