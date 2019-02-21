import React, { Component } from 'react';
import {
    Widget,
    addResponseMessage,
    addLinkSnippet,
    addUserMessage,
    getCustomLauncher,
    Launcher,
    toggle,
    toggleInputDisabled,
toggleWidget,
dropMessages,
} from 'react-chat-widget';
import {
    renderCustomComponent,
} from 'react-chat-widget';
import { ApiAiClient } from "./ApiAi";
import 'react-chat-widget/lib/styles.css';
import './App.css';
import SlideShow from 'react-slideshow-ui';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Form from './Steps'; 
import Form from './Form';
import ReactPlayer from 'react-player';
import { Icon, List, Card, Avatar } from 'antd';
import 'antd/dist/antd.css';
import AgencyLogin from './Agencylogin';
import AgencySignup from './Agencysignup';
import Contact from './Contact';
import Modal from 'react-modal';
// const translate = require('google-translate-api');
var logo = require("/home/starsystems/Desktop/chatbot/src/images/head.png");
var bot = require('/home/starsystems/Desktop/chatbot/src/images/bot1.png');
var card1 = require('/home/starsystems/Desktop/chatbot/src/images/card1.png');
var suggestionView;
var more = [];
var name;
var i = 0;

var settings1 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
};
var customStyles = {
    overlay: {
        zIndex: '9999',
        width : '300px',
        left : 'auto',
        // position: 'fixed',
        top: '10%',
        right: '5%',
        bottom: '25%',
        // backgroundColor: 'none',
    },
    content: {
        color: "#874181",
        top: '20px',
        left: '20px',
        right: '20px',
        bottom: '20px',
        fontSize: '10px'
    }
}; 
var accessToken ;
// var awesomeLink = {title:"Awesome page", link:"https://www.google.com/"};
class App extends Component {

    constructor(props) {
        super(props);
        accessToken = (this.props.accesstoken !== undefined)? this.props.accesstoken : '45b1c2e61bf447cfbf344c2c3e806644';
        this.state = {
            title: '',
            options: '',
            statusnumber: '',
            open: false,
            applicationid: '',
            visible: false,
            modalIsOpen: false,
            videoplay:"block",
        }
        this.apiAiClient = new ApiAiClient({ accessToken: accessToken });
        this.handleresponse = this.handleresponse.bind(this);
        this.handlebutton = this.handlebutton.bind(this);
        this.showModal = this.showModal.bind(this);  
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);  
    }
  
   componentWillMount() {
//    toggleWidget();
    // addResponseMessage("HI, I am your Virtual Assistant , How can i help you?");
    this.apiAiClient.eventRequest('Intiate').then((response) => {
        this.handleresponse(response);
    })

}
handlebutton(name) {
    addUserMessage(name.replace(/_/g, " "));
    this.handleNewUserMessage(name);
}
showModal(data) {
    this.setState({ modalIsOpen: true });
    more = data.split('\n');

}
openModal() {
    this.setState({ modalIsOpen: true });
}

afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
}

closeModal() {
    this.setState({ modalIsOpen: false });
}
handlejob(job, id) {
    // alert(id)
    // document.getElementById("jobs").style.display = "none";
    suggestionView = () =>
        <Form title={job} job={id} />
    renderCustomComponent(suggestionView);
}
handleNewUserMessage = (newMessage) =>{
    var exist = document.getElementsByClassName("Suggestion")[i];
    if (exist) {
        document.getElementsByClassName("Suggestion")[i].style.display = "none";
        i++;
    }
        if(newMessage === "clear"){
            dropMessages();
        }
        else if (newMessage === 'Enquiry/Contact') {
            this.handleresponse("Enquiry/Contact");
        }
        // else if (newMessage === "KPI_Platform" || newMessage === "Vibration_and_Lube" || newMessage === "banking" || newMessage === "insurance" || newMessage === "travel" || newMessage ===  "Conversational_Apps") {
        //     // addUserMessage("none")
        //     addResponseMessage("Currently not available")
        // }
        else {      
        this.apiAiClient.textRequest(newMessage).then((response)=>{
            if(response.result.fulfillment.speech === ''){
                this.apiAiClient.eventRequest(newMessage).then((response) => {
                    this.handleresponse(response);
                })
            }else{
            this.handleresponse(response);
            }
        })
    }}

    handleresponse = (response) => {
            // var source2 ="https://www.youtube.com/watch?v=iWAvbdtJK4I";
        var speech;
        if (typeof response === 'object') {
             speech = response.result.fulfillment.speech;
        }
        else {
             speech = response;
        }
        if (speech === "") {
            addResponseMessage("There is no such thing");
            // addResponseMessage("Try The following");
            this.apiAiClient.eventRequest("Greetings").then((response) => {
                this.handleresponse(response);
            })
            // addResponseMessage("About star systems , how can apply for freshers");
        }
        else if(speech.includes(".in") || speech.includes(".com") || speech.includes(".io") || speech.includes(".org")){
            var awesomeLink = {title: response.result.metadata.intentName, link: speech};
            addLinkSnippet(awesomeLink);
        }
       else if (speech.includes("[Suggestion]")) {
            var arr1 = speech.split('[Suggestion]');
            var RequiredSpeech = arr1[0];
            var ButtonText = arr1[1];
            var arr2 = ButtonText.split('__');
            addResponseMessage(RequiredSpeech);
            // alert(count)
            suggestionView = () => {
                return (
                    <div className="Suggestion">
                        {arr2.map((name, index) => {
                            return <button onClick={() => {
                                this.handlebutton(name);
                            }
                            }> {name.replace(/_/g, " ")}</button>
                        })}
                    </div>
                )
            }
            renderCustomComponent(suggestionView);
        }
        else if(speech.includes("[newline]")){
            var arr1 = speech.split('[newline]');
            arr1.map((name, index) => {
                addResponseMessage(name);
            })
        }
        else if (speech === "star systems video") {
            suggestionView = () =>

            <ReactPlayer style= {{  display: this.state.videoplay}}
            url='http://chatbot.starsystems.in/StarContent/Video/corp.mp4'
            controls
            onError={() => {this.setState({videoplay : "none"})
            addResponseMessage("Video not available")}
            }/>
            renderCustomComponent(suggestionView);
          }
        else if (speech === "star systems ppt") {
             suggestionView = () => {
                return (
                    <div className="Presentation">
                        <div style={{ width: 250, height: 200, overflowX: 'visible', overflowY: 'hidden' }}>
                            <SlideShow
                                images={[
                                    'http://chatbot.starsystems.in/StarContent/ppt/corpppt/Slide1.JPG',
                                    'http://chatbot.starsystems.in/StarContent/ppt/corpppt/Slide2.JPG',
                                    'http://chatbot.starsystems.in/StarContent/ppt/corpppt/Slide3.JPG',
                                    'http://chatbot.starsystems.in/StarContent/ppt/corpppt/Slide4.JPG',
                                    'http://chatbot.starsystems.in/StarContent/ppt/corpppt/Slide5.JPG',
                                    'http://chatbot.starsystems.in/StarContent/ppt/corpppt/Slide6.JPG',
                                    'http://chatbot.starsystems.in/StarContent/ppt/corpppt/Slide7.JPG',
                                    'http://chatbot.starsystems.in/StarContent/ppt/corpppt/Slide8.JPG',
                                    'http://chatbot.starsystems.in/StarContent/ppt/corpppt/Slide9.JPG',
                                    'http://chatbot.starsystems.in/StarContent/ppt/corpppt/Slide10.JPG'
                                ]}

                            />
                            {/* <a href="/home/starsystems/Downloads/PptxGenJS-Demo.pptx" download>Download<Icon type="download" /></a> */}
                        </div>
                    </div>
                )
            }
            // <Ppt />
            renderCustomComponent(suggestionView);
        }
        else if (speech === 'Please fill below forms') {
            addResponseMessage(speech)
            suggestionView = () =>
                <AgencySignup />
            renderCustomComponent(suggestionView);
        }
        else if (speech === 'Login') {
            suggestionView = () =>
                <AgencyLogin />
            renderCustomComponent(suggestionView);
        }
        else if (speech === 'Enquiry/Contact') {
            //addResponseMessage("contact")
            suggestionView = () =>
                <Contact />
            renderCustomComponent(suggestionView);
        }
        else if (speech === "enter your application number") {
            addResponseMessage(speech)
            suggestionView = () => {
                return (
                    <div className='status'>
                        <input id="statusnumber" type="text" name="statusnumber" placeholder="Status Number" onChange={this.handlestatus} />
                        <button onClick={() => {
                            fetch('http://developer.star-systems.in:9098/applicationStatus', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                },
                                body: JSON.stringify({
                                    applicantid: this.state.applicationid,

                                })
                            }).then(response => response.json())
                               .catch(error => console.error('Error:', error))
                                .then((response) => {
                                    document.getElementsByClassName("status")[0].style.display = "none"
                                    this.handleResponse(response.message)

                                    // alert(response.message)
                                });
                        }}><Icon type="check" />Check</button>
                    </div>
                )
            }
            renderCustomComponent(suggestionView);
        }
        else if (response.result.metadata.intentName === "Intiate") {
            var msg = [];
            msg = speech.split('.');
            for (let i = 0; i < msg.length; i++) {
                addResponseMessage(msg[i]);
            }
        }
        else if (response.result.metadata.intentName === "Experienced-custom") {
                        let jobs = speech.split('[job]');
                        var headings = [], descriptions = [], moredetails = [], jobid = [];
                    
                        for (let i = 0; i < jobs.length; i++) {
                            var headandid = jobs[i].split('[heading]');
                            var descarr = headandid.splice(1);
                            var heading = headandid[0].split('[id]');
            
                            var desc = descarr[0];
                            var description = desc.split('[more]');
                            // var dup = description[0];
                            var more = 	desc.replace('[more]', ' ');
                            // dup = dup.split('.')
                            headings[i] = heading[0];
                            jobid[i] = heading[1];
                            descriptions[i] = description[0];
                            moredetails[i] = more;
                        }
                    
                    suggestionView = () => {
                                return (

                                    <div className="jobs" id="jobs">
                                        <Slider {...settings1}>
                                            {headings.map((val, id) => {
                            return (
                                <div>
                                    <div className="jobtitle">{val}</div>
                                    <img className='image' src={card1} alt='jobdetails' />
                                    <div className="text-block">
                                        {descriptions[id].split('\n').map((item, idx) => {
                                            return (
                                                <li>{item}</li>
                                            )
                                        })}
                                        <div className="job_buttons">
                                            <button className="apply" onClick={() => { this.handlejob(val, jobid[id]) }}>Apply</button>
                                            <button className="moredetails" onClick={() => { this.showModal(moredetails[id]) }}>..more</button>
                                        </div>
                                    </div>
                                </div>
                            )
                                            })}
                                        </Slider>
                                    </div>
                                )
            
                            }
                            renderCustomComponent(suggestionView);
                        
                       
                    }
        else{
        addResponseMessage(speech);
        }
    }
    // getCustomLauncher = handleToggle => ( <button id="custom" onClick={handleToggle}>Chat Now</button> ) 
    render() {

        return ( 

            < div className = "App" >
           
           < Widget 
        //    launcher={handleToggle => this.getCustomLauncher(handleToggle)}
           title = { ""}
            subtitle = ""
            senderPlaceHolder="Please Type Here..."
            // profileAvatar={bot}
            titleAvatar = {logo}
            showCloseButton = { true }
            renderCustomComponent = { this.renderCustomComponent }
            handleNewUserMessage = { this.handleNewUserMessage }
            customLauncher={this.test}
           
            /> 
            <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >

                    <h2 ref={subtitle => this.subtitle = subtitle}>Description</h2>
                    <div className="modalclose">
                        <Icon type="close-circle" theme="twoTone" onClick={() => {
                            this.setState({ modalIsOpen: false });
                        }} />
                    </div>
                    <div> {more.map(more => (
                        <li>{more}</li>
                    ))}
                    </div>

                </Modal>
           </div>
      
        );
    }
}

export default App;
