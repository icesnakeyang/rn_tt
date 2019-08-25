import {rootCom, RootNavigator} from '../navigators/AppNavigator'
import {combineReducers} from "redux";
import theme from './theme'
import popular from './popular'

const navState = RootNavigator.router.getStateForAction(
    RootNavigator.router.getActionForPathAndParams(rootCom)
)

const navReducer = (state = navState, action) => {
    const nextState = RootNavigator.router.getStateForAction(action, state)
    return nextState || state
}

const index = combineReducers({
    nav: navReducer,
    theme: theme,
    popular: popular
})

export default index