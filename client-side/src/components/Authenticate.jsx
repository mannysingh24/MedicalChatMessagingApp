import Cookies from 'universal-cookie';
import axios from 'axios';
import React, { useState } from 'react';
import signinImage from '../assets/signup.jpg';

const defaultInfo = {fullName: '', username: '', password: '', phoneNumber: '', avatarURL: ''}
const siteCookies = new Cookies();
//backend authentication url
const authURL = 'http://localhost:5000/auth'

const Authenticate = () => {
    const [signup, applySignup] = useState(true); 
    const [format, applyFormat] = useState(defaultInfo);
    //switches from sign up to sign in and vice versa
    const flipLogin = () => 
    {
        applySignup((login) => !login);
    }
    //when submit is clicked for login
    const submitFunction = async (currentEvent) => 
    {
        currentEvent.preventDefault(); //stops automatic reloading
        const { username, password, phoneNumber, avatarURL } = format; //sets the default information
        //goes to the appropriate url, according to sign up or sign in, passing in all important information
        const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${authURL}/${signup ? 'signup' : 'login'}`, {username, password, fullName: format.fullName, phoneNumber, avatarURL})
        //saves cookies to remember the user
        siteCookies.set('token', token)
        siteCookies.set('username', username)
        siteCookies.set('fullName', fullName)
        siteCookies.set('userId', userId)
        //need additional cookies if the user is signing up
        if(signup) 
        {
            siteCookies.set('phoneNumber', phoneNumber)
            siteCookies.set('avatarURL', avatarURL)
            siteCookies.set('hashedPassword', hashedPassword)
        }
        //reload the browser
        window.location.reload();
    }

    //function to handle a user changing or adding information during login or signup
    const textModifyFunction = (currentEvent) => 
    {
        applyFormat({...format, [currentEvent.target.name]: currentEvent.target.value});
    }

    return (
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>{signup ? 'Sign Up' : 'Sign In'}</p>
                    <form onSubmit={submitFunction}>
                        {signup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="fullName">Full Name</label>
                                <input name="fullName" type="text" placeholder="Full Name" onChange={textModifyFunction} required />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username">Username</label>
                                <input name="username" type="text" placeholder="Username" onChange={textModifyFunction} required />
                        </div>
                        {signup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input name="phoneNumber" type="text" placeholder="Phone Number" onChange={textModifyFunction} required />
                            </div>
                        )}
                        {signup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="avatarURL">Avatar URL</label>
                                <input name="avatarURL" type="text" placeholder="Avatar URL" onChange={textModifyFunction} required />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                                <label htmlFor="password">Password</label>
                                <input name="password" type="password" placeholder="Password" onChange={textModifyFunction} required />
                            </div>
                        <div className="auth__form-container_fields-content_button">
                            <button>{signup ? "Sign Up" : "Sign In"}</button>
                        </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {signup ? "Already have an account?" : "Don't have an account?"}
                             <span onClick={flipLogin}>
                                {signup ? 'Sign In' : 'Sign Up'}
                             </span>
                        </p>
                    </div>
                </div> 
            </div>
            <div className="auth__form-container_image">
                <img src={signinImage} alt="sign in" />
            </div>
        </div>
    )
}

export default Authenticate