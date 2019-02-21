import React,{Component} from 'react';
import { Icon } from 'antd';
import './agency.css';

export default class Agency extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            }
        this.handleChange = this.handleChange.bind(this);
        this.agencypost = this.agencypost.bind(this);
    }
    handleChange(evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }
    agencypost(){
        alert(this.state.username+","+this.state.password);
        //console.log()
        fetch('',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:JSON.stringify({
                username: this.state.username,
                password: this.state.password

            })
        })
        .then((Response) => Response.json())
        .catch(error => console.error('Error:', error))
        .then((response) => {console.log('Success:', response)});
        
        }
render(){
    return(
    <div className="form">
               <div className = "agencywrapper">
               <div className="title">Agency Login</div>
                <input id="UserName" type="text" name="username" placeholder="User Name" onChange={this.handleChange} />
                <input id="Password" type="text" name="password" placeholder="Password" onChange={this.handleChange} />
                <button onClick={
                    this.agencypost
                }><Icon type="check-circle-o" />Submit</button>
{/* <button onClick={() =>{
    document.getElementsByClassName("loginform")[i].style.display = 'none';
                   i++;
    var suggestionView = () => <Agencysignup/>
                    renderCustomComponent(suggestionView);                          
                }}><Icon type="form" />Sign up</button> */}
                
            </div>
            </div>
    )
}
}