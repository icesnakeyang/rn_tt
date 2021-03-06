import React, {Component} from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button
} from 'react-native'
import {classBody} from "@babel/types";

export default class FetchDemoPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            showText: ''
        }
    }

    loadData() {
        let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.text()
                }
                throw new Error('Network response error')
            })
            .then(responseText => {
                this.setState({
                    showText: responseText
                })
            })
            .catch(e => {
                this.setState({
                    showText: e.toString()
                })
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>fetch demo page</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => {
                            this.searchKey = text
                        }}
                    />
                    <Button
                        title={'获取'}
                        onPress={() => {
                            this.loadData()
                        }}
                    />
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
        flex: 1,
        borderColor: '#ff00ff',
        borderWidth: 1,
        marginRight: 10
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})