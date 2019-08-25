import React, {Component} from 'react'
import {
    View,
    Text,
    TextInput,
    Button,
    AsyncStorage, StyleSheet
} from 'react-native'

const KEY = 'save_key'

export default class AsyncStorageDemoPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            showText: ''
        }
    }

    async doSave() {
        console.log(this.value)
        AsyncStorage.setItem(KEY, this.value, error => {
            error && console.log(error.toString())
        })
    }

    async getData() {
        AsyncStorage.getItem(KEY, (error, value) => {
            this.setState({
                showText: value
            })
            console.log(value)
            error && console.log(error.toString())
        })
    }

    async doRemove() {
        AsyncStorage.removeItem(KEY, error => {
            error && console.log(error.toString())
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>AsyncStorage page</Text>

                <TextInput
                    style={styles.input}
                    onChangeText={text => {
                        this.value = text
                    }}
                />
                <View style={styles.inputContainer}>
                    <Text
                        onPress={() => {
                            this.doSave()
                        }}
                    >存储</Text>
                    <Text
                        onPress={() => {
                            this.doRemove()
                        }}
                    >删除</Text>
                    <Text
                        onPress={() => {
                            this.getData()
                        }}
                    >获取</Text>
                </View>
                <Text>{this.state.showText}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f5fcff'
    },
    welcome: {
        fontSize: 24,
        margin: 10
    },
    input: {
        height: 30,
        borderColor: '#ff00ff',
        borderWidth: 1,
        marginRight: 10
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})