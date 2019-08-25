import Types from '../../action/types'

const defaultState = {}
export default function onAction(state = defaultState, action) {
    console.log(action)
    switch (action.type) {
        case Types.LOAD_POPULAR_SUCCESS:
            console.log('success')
            console.log(action)
            console.log([action.storeName])
            console.log(action.item)
            return {
                ...state,
                [action.storeName]: {
                    ...[action.storeName],
                    item: action.item,
                    isLoading: false
                }
            }
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.store],
                    isLoading: true
                }
            }
        case Types.LOAD_POPULAR_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    isLoading: false
                }
            }
        default:
            return state

    }

}