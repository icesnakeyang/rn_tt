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
    ActivityIndicator
} from 'react-native'
import NavigationUtil from "../navigators/NavigationUtil";
import {connect} from "react-redux";
import actions from "../action";
import PopularItem from "../common/PopularItem";
import Toast from "react-native-easy-toast";

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'red'
export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.tabNames = ['Java']
    }

    _genTabs() {
        const tabs = {}
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <PopularTabPage {...props} tabLabel={item}/>,
                navigationOptions: {
                    title: item
                }
            }
        })
        return tabs
    }

    render() {
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
            <View style={{flex: 1, marginTop: 0}}>
                <TabNavigator/>
            </View>
        )
    }
}

const pageSize = 10

class PopularTab extends Component<Props> {
    constructor(props) {
        super(props)
        const {tabLabel} = this.props
        this.storeName = tabLabel
    }

    componentDidMount() {
        this.loadData()
    }

    loadData(loadMore) {
        const {onLoadPopularData, onLoadMorePopular} = this.props
        const store = this._store()
        const url = this.genFetchUrl(this.storeName)
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else {
            onLoadPopularData(this.storeName, url, pageSize)
        }
    }

    _store() {
        const {popular} = this.props
        let store = popular[this.storeName]
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
        return URL + key + QUERY_STR
    }

    renderItem(data) {
        const item = data.item
        return (
            <PopularItem
                item={item}
                onSelect={() => {

                }}
            ></PopularItem>
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
                    keyExtractor={item => '' + item.id}
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
    popular: state.popular
})
const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url, pageSize) => dispatch(
        actions.onLoadPopularData(storeName, url, pageSize)
    ),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, callBack) => dispatch(
        actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callBack)
    )
})

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

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