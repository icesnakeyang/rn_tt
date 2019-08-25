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
    RefreshControl
} from 'react-native'
import NavigationUtil from "../navigators/NavigationUtil";
import {connect} from "react-redux";
import actions from "../action";
import PopularItem from "../common/PopularItem";

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'red'
export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.tabNames = ['Java', 'ios', '徐梦洁']
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

class PopularTab extends Component<Props> {
    constructor(props) {
        super(props)
        const {tabLabel} = this.props
        this.storeName = tabLabel
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        const {onLoadPopularData} = this.props
        const url = this.genFetchUrl(this.storeName)
        onLoadPopularData(this.storeName, url)
    }

    genFetchUrl(key) {
        return URL + key + QUERY_STR
    }

    renderItem(data) {
        const item = data.item
        console.log(item)
        return (
            <PopularItem
                item={item}
                onSelect={() => {

                }}
            ></PopularItem>
        )
    }

    render() {
        const {popular} = this.props
        console.log(popular)
        let store = popular[this.storeName]
        if (!store) {
            store = {
                item: [],
                isLoading: false
            }
        }
        console.log(store)
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.item}
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
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    popular: state.popular
})
const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url) => dispatch(
        actions.onLoadPopularData(storeName, url)
    )
})

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#69ffb9',
        // width: 500
    },
    welcome: {
        fontSize: 24,
        color: '#c12691',
        margin: 10
    },
    tabStyle: {
        // width: 75
    }
})