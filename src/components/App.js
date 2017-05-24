import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ListView,
    Keyboard,
    TimePickerAndroid
} from 'react-native';
import { todos } from '../assets/js/mock_todos.js';
import { Constants } from '../assets/js/constants.js';
import Utils from '../assets/js/utils.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        const _todoSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            todoSource: _todoSource,
            todoText: "",
            currentTime : Utils.getCurrentTime()
        }
    }
    changeNewTodoText(text) {
        this.state.todoText = text;
        this.setState(this.state);
    }

    clickAddTodoButton() {
        if(todos.length >= 10){
            Alert.alert("Reject", "Only add maximum 10 Todos !!!");
            return;
        }
        const newTodo = {
            id: "" + new Date().getTime().toLocaleString(),
            time: this.state.currentTime,
            content: this.state.todoText,
            status: Constants.TODO
        }
        todos.push(newTodo);
        this.state.todoSource = this.state.todoSource.cloneWithRows(todos);
        this.state.todoText = "";
        this.setState(this.state);
        Keyboard.dismiss();
    }

    clickRemoveTodoButton(_todoId) {
        const that = this;
        for (let i = 0; i < todos.length; i++) {
            if (_todoId == todos[i].id) {
                todos.splice(i, 1);
                that.state.todoSource = that.state.todoSource.cloneWithRows(todos);
                that.setState(that.state);
            }
        }
    }

    changeTodoStatus(_status, _todoId){
        let newArray = todos.slice();
        for (let i = 0; i < newArray.length; i++) {
            if (_todoId == newArray[i].id) {
                newArray[i] = {
                    ...todos[i],
                    status: _status,
                    time : Utils.getCurrentTime()
                };
                this.state.todoSource = this.state.todoSource.cloneWithRows(newArray);
                this.setState(this.state);
                todos[i] = newArray[i];
            }
        }
    }

    StatusGroup(todo){
        switch(todo.status){
            case Constants.TODO :
                return (
                    <View>   
                        <Text style={styles.textTodo}>#todo</Text>
                        <TouchableOpacity onPress={() => this.changeTodoStatus(Constants.DOING, todo.id)}>
                            <Text>#doing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.changeTodoStatus(Constants.COMPLETED, todo.id)}>
                            <Text>#completed</Text>
                        </TouchableOpacity>
                    </View>
                );
             case Constants.DOING :
                return (
                    <View>
                        <TouchableOpacity onPress={() => this.changeTodoStatus(Constants.TODO, todo.id)}>
                            <Text>#todo</Text>
                        </TouchableOpacity>  
                        <Text style={styles.textDoing}>#doing</Text>
                        <TouchableOpacity onPress={() => this.changeTodoStatus(Constants.COMPLETED, todo.id)}>
                            <Text>#completed</Text>
                        </TouchableOpacity>
                    </View>
                );
              case Constants.COMPLETED :
                return (
                    <View>
                        <TouchableOpacity onPress={() => this.changeTodoStatus(Constants.TODO, todo.id)}>
                            <Text>#todo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.changeTodoStatus(Constants.DOING, todo.id)}>
                            <Text>#doing</Text>
                        </TouchableOpacity>  
                        <Text style={styles.textCompleted}>#completed</Text> 
                    </View>
                );     
        }
    }

    renderTodoContent(todo){
        switch(todo.status){
            case Constants.TODO :
                return (
                    <Text>{todo.content}</Text>
                );   
            case Constants.DOING :
                return (
                    <Text style={styles.textDoing}>{todo.content}</Text>
                );
            case Constants.COMPLETED :
                return (
                    <Text style={styles.textCompleted}>{todo.content}</Text>
                );
        }
    }

    renderTodos(item, rowId) {
        return (
            <View style={styles.formItems} key={rowId}>
                <View style={styles.todoAction}>
                    <TouchableOpacity onPress={() => this.clickRemoveTodoButton(item.id)}>
                        <Text style={styles.btnRemoveTodo}> X </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.todoContent}>
                    <Text style={{color : "#000000", fontWeight : "bold"}}>{item.time}</Text>
                    {this.renderTodoContent(item)}
                </View>
                <View style={styles.todoStatus}>
                    {this.StatusGroup(item)}
                </View>
            </View>
        );
    }

    showPicker = async () => {
        try {
            const { action, minute, hour } = await TimePickerAndroid.open({
                is24Hour: false
            });
            if (action === TimePickerAndroid.timeSetAction) {
               this.state.currentTime = Utils.formatTime(hour, minute);
               this.setState(this.state);
            } 
            else if (action === TimePickerAndroid.dismissedAction) {
               
            }
        } catch ({ code, message }) {
            Alert.alert(code, message);
        }
    };

    componentDidMount() {
        this.state.todoSource = this.state.todoSource.cloneWithRows(todos);
        this.setState(this.state);
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <Text style={styles.title}>Realtime Todo App</Text>
                </View>
                <View style={styles.formPicker}>
                    <TouchableOpacity style={styles.btnPicker} onPress={this.showPicker.bind(this)}>
                        <Text>Pick time</Text>
                    </TouchableOpacity>
                    <Text>{this.state.currentTime}</Text>
                </View>

                <View style={styles.formInput}>
                    <TextInput style={styles.txtNewTodo}
                        placeholder="write to do here ..."
                        onChangeText={(text) => this.changeNewTodoText(text)}
                        value={this.state.todoText}
                        multiline={true}
                        underlineColorAndroid="#12a5f4" />
                    <TouchableOpacity style={styles.btnAdd} onPress={this.clickAddTodoButton.bind(this)}>
                        <Text>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.body}>
                    <ListView
                        key={todos}
                        dataSource={this.state.todoSource}
                        renderRow={(item, sectionId, rowId) => this.renderTodos(item, rowId)}
                        enableEmptySections={true}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "#ffffff"
    },
    header: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor : "#12a5f4",
    },
    title: {
        fontSize: 20,
        color : "#ffffff"
    },
    formInput: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    formPicker: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    txtNewTodo: {
        width: 250,
        height: 50
    },
    btnAdd: {
        width: 50,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 20
    },
    btnPicker: {
        width: 100,
        height: 35,
        justifyContent: "center",
        alignItems: "center"
    },
    body: {
        justifyContent: "flex-start",
        margin: 20,
        flex: 1
    },
    formItems: {
        flexDirection: "row",
        borderTopWidth: 1,
        paddingTop : 10,
    },
    todoContent: {
        flex: 3,
        marginBottom: 50,
    },
    todoStatus: {
        flex: 1,
        justifyContent: "flex-start",
        //alignItems : "center"
    },
    todoAction: {
        flex: 0.3,
    },
    btnRemoveTodo: {
        color: "#000000",
        fontWeight : "bold"
    },
    textTodo : {color : "#000000", fontWeight : "bold"},
    textDoing : {color : "#000000", fontWeight : "bold"},
    textCompleted : {textDecorationLine : "line-through", color : "#000000", fontWeight : "bold"}
});