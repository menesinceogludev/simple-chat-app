import React, { Component } from "react";
import SockJsClient from "react-stomp";
import "./App.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import messageControlItems from "./message-control-items.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      typedMessage: "",
      name: "",
    };
  }

  setName = (name) => {
    console.log(name);
    this.setState({ name: name });
  };

  sendMessage = () => {
    this.clientRef.sendMessage(
      "/app/user-all",
      JSON.stringify({
        name: "USER",
        message: this.state.typedMessage,
      })
    );
    this.rootMessage();
  };

  rootMessage = async () => {
    await this.sleep(2000);
    this.clientRef.sendMessage(
      "/app/user-all",
      JSON.stringify({
        name: "ROOT",
        message: this.messageControl(this.state.typedMessage),
      })
    );
  };

  sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  messageControl = (msg) => {
    let type = messageControlItems
      ?.filter((val) => val?.label === msg)
      ?.map((value) => value?.value);
    console.log(
      "test",
      messageControlItems
        ?.filter((val) => val?.label === msg)
        ?.map((value) => value?.value)
    );
    if (type[0] === "option1") {
      console.log(
        "options 1",
        messageControlItems
          ?.filter((val) => val?.value === "answer1")
          ?.map((value) => value?.label)
      );
      msg = messageControlItems
        ?.filter((val) => val?.value === "answer1")
        ?.map((value) => value?.label)[0];
    } else if (type[0] === "option2") {
      msg = messageControlItems
        ?.filter((val) => val?.value === "answer2")
        ?.map((value) => value?.label)[0];
    } else {
      msg = messageControlItems
        ?.filter((val) => val?.value === "answer3")
        ?.map((value) => value?.label)[0];
    }
    return msg;
  };

  displayMessages = () => {
    return (
      <div>
        {this.state.messages.map((msg) => {
          return (
            <div>
              {this.state.name == msg.name ? (
                <div>
                  <p className="title1">{msg.name} : </p>
                  <br />
                  <p>{msg.message}</p>
                </div>
              ) : (
                <div>
                  <p className="title2">{msg.name} : </p>
                  <br />
                  <p>{msg.message}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div>
        <div className="align-center">
          <h1>Welcome to Simple Chat</h1>
          <br />
          <br />
        </div>
        <div className="align-center">
          User : <p className="title1"> {this.state.name}</p>
        </div>
        <div className="align-center">
          <br />
          <br />
          <table>
            <tr>
              <td>
                <TextField
                  id="outlined-basic"
                  label="Enter Message to Send"
                  variant="outlined"
                  onChange={(event) => {
                    this.setState({ typedMessage: event.target.value });
                  }}
                />
              </td>
              <td>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.sendMessage}
                >
                  Send
                </Button>
              </td>
            </tr>
          </table>
        </div>
        <br />
        <br />
        <div className="align-center">{this.displayMessages()}</div>
        <SockJsClient
          url="http://localhost:8080/websocket-chat/"
          topics={["/topic/user"]}
          onConnect={() => {
            console.log("connected");
          }}
          onDisconnect={() => {
            console.log("Disconnected");
          }}
          onMessage={(msg) => {
            var jobs = this.state.messages;
            jobs.push(msg);
            this.setState({ messages: jobs });
            console.log(this.state);
          }}
          ref={(client) => {
            this.clientRef = client;
          }}
        />
      </div>
    );
  }
}

export default App;
