import React, {Component} from 'react'
import {
    createAppContainer,
    createMaterialTopTabNavigator
} from 'react-navigation'
import {
    View,
    Text,
    StyleSheet,
    Button,
    FlatList,
    RefreshControl,
    ActivityIndicator, DeviceInfo
} from 'react-native'
import NavigationUtil from "../navigators/NavigationUtil";
import {connect} from "react-redux";
import actions from "../action";
import Toast from "react-native-easy-toast";
import NavigationBar from "../common/NavigationBar";
import {onLoadMoreTrending, onRefreshTrending} from "../action/trending";
import TrendingItem from "../common/TrendingItem";

const URL = 'https://github.com/trending/'
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'red'
export default class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.tabNames = ['', 'c++', 'c#']
    }

    _genTabs() {
        const tabs = {}
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <TrendingTabPage {...props} tabLabel={item}/>,
                navigationOptions: {
                    title: item
                }
            }
        })
        return tabs
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        }
        let navigationBar = <NavigationBar
            title={'趋势'}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />
        const TabNavigator = createAppContainer(
            createMaterialTopTabNavigator(
                this._genTabs(), {
                    tabBarOptions: {
                        tabStyle: styles.tabStyle,
                        scrollEnabled: true
                    }
                }
            )
        )
        return (
            <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
                {navigationBar}
                <TabNavigator/>
            </View>
        )
    }
}

const pageSize = 10

class TrendingTab extends Component<Props> {
    constructor(props) {
        super(props)
        const {tabLabel} = this.props
        this.storeName = tabLabel
    }

    componentDidMount() {
        this.loadData()
    }

    loadData(loadMore) {
        const {onRefreshTrending, onLoadMoreTrending} = this.props
        const store = this._store()
        const url = this.genFetchUrl(this.storeName)
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else {
            onRefreshTrending(this.storeName, url, pageSize)
        }


    }

    _store() {
        const {trending} = this.props
        let store = trending[this.storeName]
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModes: [],
                hideLoadingMore: true
            }
        }
        return store

    }


    genFetchUrl(key) {
        return URL + key + '?since=daily'
    }

    renderItem(data) {
        const item = data.item
        return (
            <TrendingItem
                item={item}
                onSelect={() => {

                }}
            ></TrendingItem>
        )
    }

    genIndicator() {
        return this._store().hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>加载更多...</Text>
            </View>
    }

    render() {
        let store = this._store()
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModes}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => '' + (item.id || item.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => {
                        this.loadData(true)
                    }}
                    onEndReachedThreshold={0.5}
                />
                <Toast
                    ref={'toast'}
                    position={'center'}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    trending: state.trending
})
const mapDispatchToProps = dispatch => ({
    onRefreshTrending: (storeName, url, pageSize) => dispatch(
        actions.onRefreshTrending(storeName, url, pageSize)
    ),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callBack) => dispatch(
        actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, callBack)
    )
})

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#e9eeee',
        // width: 500
    },
    welcome: {
        fontSize: 24,
        color: '#c12691',
        margin: 10
    },
    tabStyle: {
        // width: 75
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: '#ff0000',
        margin: 10
    }

})