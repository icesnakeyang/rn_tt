import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import NavigationUtil from "../navigators/NavigationUtil";

export default class WelcomePage extends Component<Props> {
    componentDidMount() {
        this.timer = setTimeout(() => {
            NavigationUtil.resetToHomePage({
                navigation: this.props.navigation
            })
        }, 200)
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>欢迎光临</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#37baff'
    },
    welcome: {
        fontSize: 24,
        color: '#c03cc1',
        margin: 10
    }
})