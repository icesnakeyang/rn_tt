import React, {Component} from 'react'
import {
    createAppContainer,
    createBottomTabNavigator
} from 'react-navigation'
import PopularPage from "../pages/PopularPage";
import TrendingPage from "../pages/TrendingPage";
import FavoritePage from "../pages/FavoritePage";
import MyPage from "../pages/MyPage";
import Ionicons from 'react-native-vector-icons/Ionicons'

import {BottomTabBar} from "react-navigation";
import {connect} from "react-redux";

const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '最热',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={'md-star'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '收藏',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={'md-heart'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={'md-person'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    }
}

class DynamicTabNavigator extends Component<Props> {
    _TabNavigator() {
        if (this.Tabs) {
            return this.Tabs
        }
        const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS
        const tabs = {
            PopularPage,
            TrendingPage,
            FavoritePage,
            MyPage
        }
        this.Tabs = createAppContainer(
            createBottomTabNavigator(tabs, {
                tabBarComponent: props => {
                    return (
                        <TabBarComponent
                            theme={this.props.theme}
                            {...props}
                        />
                    )
                }
            })
        )
        return this.Tabs
    }

    render() {
        const Tab = this._TabNavigator()
        return (
            <Tab/>
        )
    }
}

class TabBarComponent extends Component {
    constructor(props) {
        super(props)
        this.theme = {
            tintColor: props.activeTintColor,
            updateTime: new Date().getTime()
        }
    }

    render() {
        return (
            <BottomTabBar
                {...this.props}
                activeTintColor={this.props.theme}
            />
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme.theme
})

export default connect(mapStateToProps)(DynamicTabNavigator)