import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator
} from 'react-navigation'
import WelcomePage from "../pages/WelcomePage";
import HomePage from "../pages/HomePage";
import DetailPage from "../pages/DetailPage";
import {
    createReactNavigationReduxMiddleware,
    createReduxContainer
} from "react-navigation-redux-helpers";
import {connect} from "react-redux";
import FetchDemoPage from "../pages/FetchDemoPage";
import AsyncStorageDemoPage from "../pages/AsyncStorageDemoPage";
import DataStoreDemoPage from "../pages/DataStoreDemoPage";

export const rootCom = 'Init'

const InitNavigator = createStackNavigator({
    WelcomePage: {
        screen: WelcomePage
    }
})

const MainNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage
    },
    DetailPage: {
        screen: DetailPage
    },
    FetchDemoPage: {
        screen: FetchDemoPage
    },
    AsyncStorageDemoPage: {
        screen: AsyncStorageDemoPage
    },
    DataStoreDemoPage: {
        screen: DataStoreDemoPage
    }
})

export const RootNavigator = createSwitchNavigator({
    Init: InitNavigator,
    Main: MainNavigator
})

export const middleware = createReactNavigationReduxMiddleware(
    state => state.nav,
    'root'
)

const AppWithNavigationState = createReduxContainer(RootNavigator, 'root')

const mapStateToProps = state => ({
    state: state.nav
})

export default connect(mapStateToProps)(AppWithNavigationState)