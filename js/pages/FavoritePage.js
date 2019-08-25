import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button
} from 'react-native'
import actions from "../action";
import {connect} from "react-redux";

class FavoritePage extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>收藏</Text>
                <Button
                    title={'改变主题色'}
                    onPress={() => {
                        this.props.onThemeChange('#c000dd')
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

export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage)

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