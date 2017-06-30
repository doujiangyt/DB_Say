
import React ,{Component} from 'react';
import { Navigator } from 'react-native-deprecated-custom-components';

import CustomTabNavigator from './CustomTabNavigator'
export default class NavigatorCenter extends Component{
    constructor(props){
        super(props);

    }
    render(){
        let defaultName='CustomTabNavigator';
        let defaultComponent=CustomTabNavigator;
        return(
            <Navigator
                initialRoute={{name:defaultName,component:defaultComponent}}
                configureScene={(route)=>{
                return Navigator.SceneConfigs.FloatFromRight;
            }}
            renderScene={(route,navigator)=>{
                let Component =route.component;
                return <Component{...route.params} navigator={navigator}/>//通过这个讲navigator传递出去。
            }}
            >

            </Navigator>
        );
    }
};