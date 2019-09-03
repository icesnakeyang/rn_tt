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
    ActivityIndicator,
    DeviceInfo,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native'
import NavigationUtil from "../navigators/NavigationUtil";
import {connect} from "react-redux";
import actions from "../action";
import Toast from "react-native-easy-toast";
import NavigationBar from "../common/NavigationBar";
import {onLoadMoreTrending, onRefreshTrending} from "../action/trending";
import TrendingItem from "../common/TrendingItem";
import TrendingDialog, {TimeSpans} from "../common/TrendingDialog";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const URL = 'https://github.com/trending/'
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'red'
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'

export default class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.tabNames = ['', 'c++', 'c#']
        this.state = {
            timeSpan: TimeSpans[0]
        }
    }

    _genTabs() {
        const tabs = {}
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <TrendingTabPage
                    {...props}
                    timeSpan={this.state.timeSpan}
                    tabLabel={item}
                />,
                navigationOptions: {
                    title: item
                }
            }
        })
        return tabs
    }

    renderTitleView() {
        return (
            <View>
                <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => this.dialog.show()}>
                    <View
                        style={{flexDirection: 'row', alignItems: 'center'}}
                    >
                        <Text style={{
                            fontSize: 18,
                            color: '#FFFFFF',
                            fontWeight: '400'
                        }}>趋势 {this.state.timeSpan.showText}</Text>
                        <MaterialIcons
                            name={'arrow-drop-down'}
                            size={22}
                            style={{color: 'white'}}
                        />
                    </View>

                </TouchableOpacity>
            </View>
        )
    }

    onSelectTimeSpan(tab) {
        this.dialog.dismiss()
        this.setState({
            timeSpan: tab
        })
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)
    }

    renderTrendingDialog() {
        return <TrendingDialog
            ref={dialog => this.dialog = dialog}
            onSelect={tab => this.onSelectTimeSpan(tab)}
        ></TrendingDialog>
    }

    _tabNav() {
        if (!this.tabNav) {
            this.tabNav = createAppContainer(
                createMaterialTopTabNavigator(
                    this._genTabs(), {
                        tabBarOptions: {
                            tabStyle: styles.tabStyle,
                            scrollEnabled: true
                        }
                    }
                )
            )
        }
        return this.tabNav
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        }
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />
        const TabNavigator = this._tabNav()
        return (
            <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
                {navigationBar}
                <TabNavigator/>
                {this.renderTrendingDialog()}
            </View>
        )
    }
}

const pageSize = 10

class TrendingTab extends Component<Props> {
    constructor(props) {
        super(props)
        const {tabLabel, timeSpan} = this.props
        this.storeName = tabLabel
        this.timeSpan = timeSpan
    }

    componentDidMount() {
        this.loadData()
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan
            this.loadData()
        })
    }

    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove()
        }
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
        return URL + key + '?' + this.timeSpan.searchText
    }

    renderItem(data) {
        const item = data.item
        return (
            <TrendingItem
                item={item}
                onSelect={(callback) => {
                    NavigationUtil.goPage({
                        projectModes: item,
                        callback
                    }, 'DetailPage')
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