import {
    StackNavigator
} from 'react-navigation';
import Login from './Login.js';
import App from './App.js';

export const RootRouter = StackNavigator({
    LoginScreen : {
        screen : Login
    },
    AppScreen : {
        screen : App
    }
},{
    navigationOptions : {
        headerStyle : {
            display : "none"
        }
    }
});