import React,{Component} from 'react';
import {Icon} from 'antd';
import './agency.css';
import { Document, Page } from 'react-pdf';

import {
    renderCustomComponent,
} from 'react-chat-widget';


export default class Agency extends Component{
    constructor(props) {
        super(props);
        this.state = {
            contactname:'',
            agencyname: '',
            email: '',
            number: '',
            selectedfile:[],
            numPages: null,
            pageNumber: 1,

        }
        this.Upload=this.Upload.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.agencypost = this.agencypost.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
        //this.onChange = this.onChange.bind(this);
    }
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
      }
    handleChange(evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }
    fileSelected = event => {
        // const { pageNumber, numPages } = this.state;
        //file = event.target.files[0];
        this.setState({
            selectedfile: event.target.files[0]
        })
        var suggestionView = () => {
        return(
            
        <div>
        <Document
          file={this.state.selectedfile}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page pageNumber={this.state.pageNumber} />
        </Document>
        {/* <p>Page {this.state.pageNumber} of {this.state.numPages}</p> */}
      </div>
        )}
        renderCustomComponent(suggestionView);
    }
    agencypost(){
        document.getElementsByClassName("form")[0].style.display="none";
        //alert(this.state.agencyname+","+this.state.contactname+","+this.state.email+","+this.state.number);
        //console.log()
        fetch('http://developer.star-systems.in:9098/addAgency',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:JSON.stringify({
                agencyName: this.state.agencyname,
                contactName: this.state.contactname,
                email: this.state.email,
                mobileNumber: this.state.number

            })
        })
        .then((Response) => Response.json())
        .catch(error => console.error('Error:', error))
        .then((response) => {
            // this.Upload(response)
            console.log('Success:', response)
            this.Upload(response)
        //     var suggestionView =() =>{
        //         return(
        //     <Upload {...props}>
        //     <Button>
        //       <Icon type="upload" /> Click to Upload
        //     </Button>
        //   </Upload>
        //         )}
        // renderCustomComponent(suggestionView);
        });
    }
Upload(res) {
    var suggestionView =() =>{
        return(
            <div id='verify'>
                <input type='text' placeholder="Verification Code" onChange={(e) =>{
                    this.setState({
                        otp : e.target.value
                    })
                   
                }}/>
                <button onClick={()=>{
                    document.getElementById("verify").style.display = "none";
                     console.log(this.state.otp);
                     //message.success('Mobile number verified successfully');
                   // alert(this.state.otp)
                   fetch('http://developer.star-systems.in:9098/verifyAgencyOTP',{
                       method:'POST',
                       //mode:'no-cors',
                       headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                       body : JSON.stringify({
                        otp : this.state.otp,
                        agencyid : res.agencyid
                       })
                   }).then(response => response.json())
                   .catch(error => console.error('Error:', error))
                   .then((response) => {
                       console.log('Success:', response)
                       var suggestionView = () =>{
                        return(
                           <p className = "final_response"> {response.message}</p>
                        )   
                       }
                       renderCustomComponent(suggestionView)
                    //addResponseMessage(response.message)
                    })
                   
                   console.log(this.state.otp +" "+res.agencyid);
                }}>
                    <Icon type="check" />Verify
                </button>
            </div>
        )
   }
    renderCustomComponent(suggestionView)
}
        
       
render(){
    return(
    
    <div className="form">
       <div className = "agencywrapper">
       <div className="title">Agency SignUp</div>
                <input id="AgencyName" type="text" name="agencyname" placeholder="Agency Name" onChange={this.handleChange} />
                <input id="ContactName" type="text" name="contactname" placeholder="Contact Name" onChange={this.handleChange} />
                <input id="email" type="email" name="email" placeholder="Email Id" onChange={this.handleChange} />
                <input id="number" type="text" name="number" placeholder="Mobile Number" onChange={this.handleChange} />
                <button onClick={
                    this.agencypost
                }><Icon type="check-circle-o" />Submit</button>
                {/* <button onClick={() =>{
                     document.getElementsByClassName("form")[i].style.display = 'none'
                    i++;
                     var suggestionView = () => <Login />
                    renderCustomComponent(suggestionView);                          
                }}><Icon type="key" />Login</button> */}
            </div>
            </div>
    )
}
}