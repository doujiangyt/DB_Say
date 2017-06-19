/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import AppNav from './app/navigator/AppNav';
import {
    AppRegistry,
} from 'react-native';
class App extends Component{
    constructor(props){
        super(props);
    }
    render() {
        return(
            <AppNav
                screenProps={{navigation: this.props.navigation}}
                style={{flex: 1,}} />
        );
    }
}

AppRegistry.registerComponent('DB_Say', () => App);
