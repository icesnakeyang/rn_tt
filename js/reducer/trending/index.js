import Types from '../../action/types'

const defaultState = {}
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.TRENDING_REFRESH_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.storeName],
                    items: action.items,
                    projectModes: action.projectModes,
                    isLoading: false,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex
                }
            }
        case Types.TRENDING_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.store],
                    isLoading: true,
                    hideLoadingMore: true
                }
            }
        case Types.TRENDING_REFRESH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    isLoading: false
                }
            }
        case Types.TRENDING_LOAD_MORE_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModes: action.projectModes,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex
                }
            }
        case Types.TRENDING_LOAD_MORE_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    pageIndex: action.pageIndex
                }
            }
        default:
            return state

    }

}