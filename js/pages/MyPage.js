import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet, Button
} from 'react-native'
import NavigationUtil from "../navigators/NavigationUtil";

export default class MyPage extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>{tabLabel}</Text>
                <Button
                    title={'跳转'}
                    onPress={() => {
                        NavigationUtil.goPage({
                            navigation: this.props.navigation
                        }, 'DetailPage')
                    }}
                />
                <Button
                    title={'跳转到fetch demo page'}
                    onPress={() => {
                        NavigationUtil.goPage({
                            navigation: this.props.navigation
                        }, 'FetchDemoPage')
                    }}
                />
                <Button
                    title={'跳转到AsyncStorage demo page'}
                    onPress={() => {
                        NavigationUtil.goPage({
                            navigation: this.props.navigation
                        }, 'AsyncStorageDemoPage')
                    }}
                /><Button
                title={'离线缓存框架'}
                onPress={() => {
                    NavigationUtil.goPage({
                        navigation: this.props.navigation
                    }, 'DataStoreDemoPage')
                }}
            />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafffa'
    },
    welcome: {
        fontSize: 24,
        color: '#c12691',
        margin: 10
    }
})