import Types from '../types'
import DataStore from "../../expand/dao/DataStore";

export function onLoadPopularData(storeName, url) {
    console.log(storeName)
    console.log(url)
    return dispatch => {
        dispatch({
            type: Types.POPULAR_REFRESH,
            storeName: storeName
        })
        let dataStore = new DataStore()
        dataStore.fetchData(url)
            .then(data => {
                console.log(data)
                handleData(dispatch, storeName, data)
            })
            .catch(error => {
                console.log(error)
                dispatch({
                    type: Types.LOAD_POPULAR_FAIL,
                    storeName,
                    error
                })
            })
    }

}

function handleData(dispatch, storeName, data) {
    console.log(data.data.items)
    dispatch({
        type: Types.LOAD_POPULAR_SUCCESS,
        item: data && data.data && data.data.items,
        storeName
    })
}