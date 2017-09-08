import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header.js"
import {Footer} from "./components/Footer.js"

export default class Private extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
    <div className="page-layout">
        <Header currentRole={this.props.currentRole}/>
        <div className="container f-v-gap-5 f-gap-15 u-mt-10">
              <h1 className="h1-big u-text-center">Политика конфиденциальности</h1>
              <p className="text-highLight u-text-center">Effective date: 18 July 2017</p>
              <p>Welcome to Raters! By accessing or using the Raters website, the Raters service, or any applications (including mobile applications) made available by Raters Group Ltd. (together, the “Service”), however accessed, you agree to be bound by these terms of use (“Terms of Use”). The Service is owned, provided and controlled by Raters Group Ltd., located at 1-7 Commercial Road, Paddock Wood, Kent, TN12 6EN, United Kingdom (“Raters”). These Terms of Use affect your legal rights and obligations. If you do not agree to be bound by all of these Terms of Use, please do not access or use the Service.
                There may be times when we offer a special feature that has its own terms and conditions that apply in addition to these Terms of Use. In those cases, the terms specific to the special feature apply to the extent there is a conflict with these Terms of Use.</p>
            <h1 className="h1 text-header">Базовые понятия</h1>
            <ol>
            <li><p>You must be at least 13 years old to use the Service.</p></li>
            <li><p>You may not post violent, nude, partially nude, discriminatory, unlawful, infringing, hateful, pornographic or sexually suggestive photos or other content via the Service.</p></li>
            <li><p>You may not post violent, nude, partially nude, discriminatory, unlawful, infringing, hateful, pornographic or sexually suggestive photos or other content via the Service.
            There is no tolerance for objectionable content or abusive users. Should you believe that any content posted by another user is objectionable and/or user behaves in an abusive manner, contact us at contact@ratersapp.com indicating “Objectionable Content/Abusive User” in the email subject and sending the screenshot of the posted content that you believe is objectionable. Our team will react within 24 hours by (i) removing the content and ejecting the user if your claim is found valid or (ii) reply to your email with a proper explanation if your claim is found invalid. If you believe that your content was removed or your account was blocked wrongfully, contact us at contact@ratersapp.com and our team will investigate your claim.</p></li>
            <li><p>You are responsible for any activity that occurs through your account and you agree you will not sell, transfer, license or assign your account, followers, username, or any account rights. With the exception of people or businesses that are expressly authorized to create accounts on behalf of their employers or clients, Raters prohibits the creation of and you agree that you will not create an account for anyone other than yourself. You also represent that all information you provide or provided to Raters upon registration and at all other times will be true, accurate, current and complete and you agree to update your information as necessary to maintain its truth and accuracy.</p></li>
            <li><p>You agree that you will not solicit, collect or use the login credentials of other Raters users.You are responsible for keeping your password secret and secure.</p></li>
            <li><p>You must not defame, stalk, bully, abuse, harass, threaten, impersonate or intimidate people or entities and you must not post private or confidential information via the Service, including, without limitation, your or any other person’s credit card information, social security or alternate national identity numbers, non-public phone numbers or non-public email addresses.</p></li>
            <li><p>You may not use the Service for any illegal or unauthorized purpose. You agree to comply with all laws, rules and regulations (for example, federal, state, local and provincial) applicable to your use of the Service and your Content (defined below), including but not limited to, copyright and trademark laws.</p></li>
            </ol>
            <h1 className="h1 text-header">Базовые понятия</h1>
            <p>Welcome to Raters! By accessing or using the Raters website, the Raters service, or any applications (including mobile applications) made available by Raters Group Ltd. (together, the “Service”), however accessed, you agree to be bound by these terms of use (“Terms of Use”). The Service is owned, provided and controlled by Raters Group Ltd., located at 1-7 Commercial Road, Paddock Wood, Kent, TN12 6EN, United Kingdom (“Raters”). These Terms of Use affect your legal rights and obligations. If you do not agree to be bound by all of these Terms of Use, please do not access or use the Service.</p>
            <p>There may be times when we offer a special feature that has its own terms and conditions that apply in addition to these Terms of Use. In those cases, the terms specific to the special feature apply to the extent there is a conflict with these Terms of Use.</p>
          </div>
        <Footer/>
    </div>)
  }
}
