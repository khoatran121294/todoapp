import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Keyboard,
    Alert,
    AsyncStorage
} from 'react-native';
import {SERVICE_URLS} from '../assets/js/service_urls.js';

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            account : {
                username : "",
                password : ""
            },
            token : null
        };
    }
    checkLogin(){
        const { navigate } = this.props.navigation;
        Keyboard.dismiss();
        console.log(this.state.account);
        //call service to authenticate account
        fetch("http://192.168.0.105:3000/api/authenticate", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                account : this.state.account
            })
        })
        .then((res) => res.json())
        .then((resJson) => {
            if(resJson.success == false){
                Alert.alert(
                    'message',
                    resJson.message
                );
            }
            else{
                //save in local storage
                this.setToken(resJson.token);
                navigate("AppScreen");
            }
        })
        .catch((e) => {
            Alert.alert(
                'login result',
                'server error ' + e.message,
            );
        });
    }

    onTxtUsernameChanged(text){
        this.state.account.username = text;
        this.setState(this.state);
    }
    onTxtPasswordChanged(_password){
        this.state.account.password = _password;
        this.setState(this.state);
    }

    getToken(callback){
        const that = this;
        AsyncStorage.getItem("token", function(e, token){
            console.log("token " + token);
            that.state.token = token;
            that.setState(that.state);
            console.log("state " + that.state.token);
            callback(token);
        });
        
    }

    setToken = async (_token) => {
        try{
            await AsyncStorage.setItem("token", _token);
        }catch(e){
            Alert.alert("error", e);
        }
    };

    checkTokenIsValid(_token){
        fetch("http://192.168.0.105:3000/api", {
            method: 'GET',
            headers: {
                'x-access-token' : _token
            }
        })
        .then((res) => res.json())
        .then((resJson) =>{
            Alert.alert("message", resJson.toString());
            //navigate("AppScreen");
        })
        .catch(function(e){
            Alert.alert("error", e);
            
        });
    }

    componentDidMount(){
        const { navigate } = this.props.navigation;
        this.getToken(this.checkTokenIsValid);
        // //check local has token 
        // if(this.state.token == null || this.state.token == ""){
        //     return;
        // }
        // this.checkTokenIsValid(this.state.token);
    }
    render(){
        return (
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <Text style={styles.title}>TODO APP</Text>
                </View>
                <View style={styles.formLogin}>
                    <TextInput style={styles.input} 
                        placeholder="Username" 
                        underlineColorAndroid="transparent"
                        onChangeText={(_username) => this.onTxtUsernameChanged(_username)} />
                    <TextInput style={styles.input} 
                        secureTextEntry={true} 
                        placeholder="Password" 
                        underlineColorAndroid="transparent"
                        onChangeText={(_password) => this.onTxtPasswordChanged(_password)} />
                    
                    <TouchableOpacity style={styles.btnLogin} onPress={this.checkLogin.bind(this)}>
                        <Text style={styles.textLogin}>Login</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.btnSignup}>
                        <Text style={styles.textSignUp}>Sign up now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper : {
        flex : 1
    },
    header : {
        flex : 1,
        backgroundColor : "#12a5f4",
        justifyContent : "center",
        alignItems : "center"
    },
    formLogin : {
        marginTop : 20,
        flex : 3,
        justifyContent : "flex-start",
        alignItems : "center"
    },
    title : {
        fontSize : 30,
        color : "#ffffff"
    },
    input : {
        width : widthScreen - 10,
        height : 50,
        marginTop : 30,
        fontSize : 20,
        textAlign : "center",
        borderColor : "#12a5f4",
        borderWidth : 1,
        
    },
    btnLogin : {
        marginTop : 30,
        width : widthScreen - 10,
        height : 50,
        backgroundColor : "#12a5f4",
        justifyContent : "center",
        alignItems : "center"
    },
    textLogin: {
        fontSize : 20,
        color : "#ffffff"
    },
    textSignUp : {
        fontSize : 15
    },
    btnSignup : {
        marginTop : 30
    }
});