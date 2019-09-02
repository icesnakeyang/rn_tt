import Types from '../types'
import DataStore, {FLAG_STORAGE} from "../../expand/dao/DataStore";
import {handleData} from "../ActionUtil";

export function onLoadPopularData(storeName, url, pageSize) {
    return dispatch => {
        dispatch({
            type: Types.POPULAR_REFRESH,
            storeName: storeName
        })
        let dataStore = new DataStore()
        dataStore.fetchData(url, FLAG_STORAGE.flag_popular)
            .then(data => {
                handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize)
            })
            .catch(error => {
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error
                })
            })
    }

}

export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callBack) {
    return dispatch => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callBack === 'function') {
                    callBack('no more')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModes: dataArray
                })
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes: dataArray.slice(0, max)
                })
            }
        }, 500)
    }
}