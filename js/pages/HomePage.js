import React, {Component} from 'react'
import {BackHandler} from 'react-native'
import {NavigationActions} from "react-navigation";
import DynamicTabNavigator from "../navigators/DynamicTabNavigator";
import NavigationUtil from "../navigators/NavigationUtil";
import {connect} from "react-redux";

class HomePage extends Component<Props> {
    componentDidMount() {
        BackHandler.addEventListener(
            'hardwareBackPress', this.onBackPress
        )
    }

    componentWillUnmount() {
        BackHandler.removeEventListener(
            'hardwareBackPress', this.onBackPress
        )
    }

    onBackPress = () => {
        const {dispatch, nav} = this.props
        console.log(nav)
        if (nav.routes[1].index === 0) {
            return false
        }
        dispatch(NavigationActions.back())
        return true
    }

    render() {
        NavigationUtil.navigation = this.props.navigation
        return (
            <DynamicTabNavigator/>
        )
    }
}

const mapStateToProps=state=>({
    nav:state.nav
})
export default connect(mapStateToProps)(HomePage)