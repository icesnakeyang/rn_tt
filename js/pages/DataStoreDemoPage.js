import React, {Component} from 'react'
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet
} from 'react-native'
import DataStore from "../expand/dao/DataStore";

export default class DataStoreDemoPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            showText: ''
        }
        this.dataStore = new DataStore()
    }

    loadData() {
        console.log(this.value)
        let url = `https://api.github.com/search/repositories?q=${this.value}`
        console.log(url)
        this.dataStore.fetchData(url)
            .then(data => {
                console.log(data)
                let showData = `初次加载时间：${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`
                this.setState({
                    showText: showData
                })
            })
            .catch(error => {
                error && console.log(error.toString())
            })

    }

    render() {
        return (
            <View style={styles.input_container}>
                <Text>离线缓存框架设计</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => {
                        this.value = text
                    }}
                />
                <Button title={'获取'} onPress={() => {
                    this.loadData()
                }}
                />
                <Text>{this.state.showText}</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        height: 30,
        borderColor: '#df00fd',
        borderWidth: 1,
        marginRight: 10
    }
})