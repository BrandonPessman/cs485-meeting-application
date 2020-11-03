import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import styled from 'styled-components'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

export default class Notifications extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      top:-100,
    };
    this.timeout = null;
  }
  onShow = () => {
    if(this.timeout){
      clearTimeout(this.timeout);
      this.setState({top:-100} , () =>{
        this.timeout = setTimeout(() => {
          this.showNotification();
        },500);
      });
    } else {
      this.showNotification();
    }
  }

  showNotification = () => {
    this.setState({
      top:16,
    }, () =>{
      setTimeout(() =>{
        this.setState({
          top:-100,
        });
      },3000);
    });
  }

  render(){
    return (
      <React.Fragment>
        <button onClick = {this.showNotification}>SetMeetingNotification</button>
        <Container top={this.state.top}>Set successfully</Container>

      </React.Fragment>
    );
  }
}