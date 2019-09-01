import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button
} from 'react-native'
import {connect} from "react-redux";
import actions from "../action";

class TrendingPage extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>趋势</Text>
                <Button
                    title={'改变主题色'}
                    onPress={() => {
                        this.props.onThemeChange('#099')
                    }}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

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

export default connect(mapStateToProps, mapDispatchToProps)(TrendingPage)