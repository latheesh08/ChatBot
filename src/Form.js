import React from 'react';
import {
    renderCustomComponent
} from 'react-chat-widget';
import './Form.css';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import {  Icon, message } from 'antd';
import 'antd/dist/antd.css';
// var file = require('./sample.pdf');
// import { FilePicker } from 'react-file-picker';

// import getUri from 'get-uri';
// import axios from 'axios';
// import Upload from './Upload'
var formData = new FormData();
// let file = null
// const options = {
//     cMapUrl: 'cmaps/',
//     cMapPacked: true,
//   };        
export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: '',
            numPages: null,
            pageNumber: 1,
            name: '',
            email: '',
            number: '',
            data: '',
            selectedfile: '',
            otp: ''
        }
        this.post = this.post.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
        this.upload = this.upload.bind(this);
        this.getRandomInt = this.getRandomInt.bind(this);
        this.message = this.message.bind(this);
    }
    getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
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
            return (

                <div>
                    <Document
                        file={this.state.selectedfile}
                        onLoadSuccess={this.onDocumentLoadSuccess}
                    >
                        <Page pageNumber={this.state.pageNumber} />
                    </Document>
                    {/* <p>Page {this.state.pageNumber} of {this.state.numPages}</p> */}
                </div>
            )
        }
        renderCustomComponent(suggestionView);
    }

    post() {
    //   alert(this.props.job)
    console.log(this.state.name+"\n"+this.state.email+"\n"+this.state.number+"\n"+this.props.job);
        fetch('http://developer.star-systems.in:9098/applyForJob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                contactName: this.state.name,
                email: this.state.email,
                mobileNumber: this.state.number,
                jobId: this.props.job
            })
        }).then(response => response.json())
            //.then((response) => {console.log(response)})
            .catch(error => console.error('Error:', error))
            .then((response) => {
                console.log(response)
                this.upload(response)
            });
    }

    upload(res) {

        if (res.status === "success") {
            document.getElementById("form").style.display = 'none';
            var suggestionView = () => {
                return (
                    <div id="uploadContent">
                        <label for="file-upload" class="custom-file-upload">
                            <Icon type="folder" />Select a file
                        </label>
                        <input id="file-upload" type="file" onChange={this.fileSelected} />

                        <button className='upload_button'
                            onClick={() => {
                                document.getElementById("uploadContent").style.display = 'none';
                                document.getElementsByClassName("react-pdf__Page__canvas")[0].style.display = 'none';
                                formData.append('filename', this.state.selectedfile);
                                formData.append('contentType', 'pdf');
                                formData.append('applicantId', res.applicationid);
                                for (var key of formData.values()) {
                                    console.log(key);
                                }
                                fetch('http://developer.star-systems.in:9098/uploadContent', {
                                    method: 'POST',
                                    // mode:'no-cors',
                                    body: formData
                                }).then(response => response.json())
                                    .catch(error => console.error('Error:', error))
                                    .then((response) => {
                                        console.log('Success:', response)
                                        //alert(response.message)
                                        //addResponseMessage(response.message);
                                    });
                                var suggestionView = () => {
                                    return (
                                        <div id='verify'>
                                            <input type='text' placeholder="Verification Code" onChange={(e) => {
                                                this.setState({
                                                    otp: e.target.value
                                                })

                                            }} />
                                            <button onClick={() => {
                                                console.log(this.state.otp);
                                                document.getElementById("verify").style.display = 'none';

                                                //message.success('Mobile number verified successfully');
                                                // alert(this.state.otp)
                                                fetch('http://developer.star-systems.in:9098/verifyOTP', {
                                                    method: 'POST',
                                                    //mode:'no-cors',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Accept': 'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        otp: this.state.otp,
                                                        applicationid: res.applicationid
                                                    })
                                                }).then(response => response.json())
                                                    .catch(error => console.error('Error:', error))
                                                    .then((response) => {
                                                        console.log('Success:', response)
                                                        var suggestionView = () => {
                                                            return (
                                                                <p className="final_response"> {response.message}</p>
                                                            )
                                                        }
                                                        renderCustomComponent(suggestionView)
                                                    })

                                                console.log(this.state.otp + " " + res.applicationid);
                                            }}>
                                                <Icon type="check" />Verify
                                        </button>
                                        </div>
                                    )
                                }
                                renderCustomComponent(suggestionView)
                                for (var pair of formData.entries()) {
                                    console.log(pair[0] + ', ' + pair[1]);
                                }

                            }}><Icon type="upload" />Upload</button>
                        {/* </FilePicker> */}
                    </div>
                )
            }
            renderCustomComponent(suggestionView);
        }
        else {
            alert(res.message);
        }

    }
    message() {
        message.success('Mobile number verified successfully');
    }
    render() {

        return (
            <div id="form">
            <div className = "formwrapper">
                <div className="title">Applying for the job {this.props.title}</div>
                <input id="firstname" type="text" name="name" placeholder="Full Name" onChange={this.handleChange} />
                <input id="email" type="email" name="email" placeholder="Email id" onChange={this.handleChange} />
                <input id="number" type="text" name="number" placeholder="Mobile number" onChange={this.handleChange} required/>
                <button onClick={ () =>{
                    if(this.state.name !=='' ||this.state.email !=='' ||this.state.number !==''){
                        this.post();
                    }
                  else{
                      alert("please fill the required feilds")
                  }
                }}><Icon type="check-circle-o" />Submit</button>
            </div>
            </div>
        );
    }

}