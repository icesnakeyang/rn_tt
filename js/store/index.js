import {middleware} from "../navigators/AppNavigator";
import {applyMiddleware, createStore} from "redux";
import reducers from '../reducer'
import thunk from 'redux-thunk'

const logger = store => next => action => {
    if (typeof action === 'function') {
    } else {
    }
    const result = next(action)
}

const middlewares = [
    middleware,
    logger,
    thunk
]

export default createStore(reducers, applyMiddleware(...middlewares))