import React from 'react';
import './agency.css';
// import './contact.css';
import { Icon} from 'antd';
export default class Contact extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
        this.handle = this.handle.bind(this);
    }
    
    handle = (event) => {
        alert([event.target.type]);
        console.log(event.target);
   }
render(){
    return(
        <div>
        <div className="contact">
        <div className= "contactform">
        <input id="name" type="text" name="name" placeholder="Full Name" onChange={this.handleChange} />
        <input id="email" type="email" name="email" placeholder="Email id" onChange={this.handleChange} />
        <input id="subject" type="text" name="number" placeholder="Subject" onChange={this.handleChange} />
        <textarea name="message" placeholder="Message"></textarea>
        <button><Icon type="check-circle-o" />Submit</button>
        </div>
        <div className="Address">
        
        <b>OUR LOCATION:</b>
        <p>
        Star Systems India Private Limited.
        TS 105, SIDCO Industrial Estate,
        Ekkatuthangal, Guindy,
        Chennai-600032, India.
        </p>
        <b> OUR PHONE:</b>
        <p> +91-44-43302020 </p>
        <b> OUR EMAIL:</b>
        <p>info@star-systems.in</p> 
        </div>
        </div>
        <div className="contact_social">
   
        <a href="https://www.facebook.com/StarSystemsIndia" target="_blank"><Icon type="facebook" /> </a>
        <a href="https://twitter.com/star_systems_in" target="_blank"><Icon type="twitter" /></a>
        <a href="https://www.linkedin.com/company/star-systems-india-private-limited" target="_blank"><Icon type="linkedin" /></a>
        <a href="https://plus.google.com/+StarSystemsIndiaPrivateLimitedChennai" target="_blank"><Icon type="google-plus" /></a>
        </div>
        </div>
    )
}
}