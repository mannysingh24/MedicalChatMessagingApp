import { Chat } from 'stream-chat-react';
import React, { useState } from 'react';
import './App.css';
import { ChannelResponsive, ChannelController, Authenticate } from './components';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css';
import Cookies from 'universal-cookie';

const clientInstance = StreamChat.getInstance('x5rtx23gxehs');
const siteCookies = new Cookies();
const authentication = siteCookies.get("token");

//if the token is valid, load the user to the client with the approriate information from the cookies
if(authentication) 
{
    clientInstance.connectUser({id: siteCookies.get('userId'), name: siteCookies.get('username'), fullName: siteCookies.get('fullName'), image: siteCookies.get('avatarURL'), hashedPassword: siteCookies.get('hashedPassword'), phoneNumber: siteCookies.get('phoneNumber')}, authentication)
}


const MainApplication = () => 
{
    const [editing, applyEditing] = useState(false);
    const [creating, applyCreating] = useState(false);
    const [type, applyType] = useState('');

    //if the token is not valid, go through the authentication process
    if(!authentication) 
    {
        return <Authenticate />
    }
    //otherwise create the chat page sending in the appropriate parameters
    return (
        <div className="app__wrapper">
            <Chat client={clientInstance} theme="team light">
                <ChannelResponsive 
                    creating={creating}
                    applyCreating={applyCreating}
                    applyType={applyType}
                    applyEditing={applyEditing}
                />
                <ChannelController
                    creating={creating}
                    applyCreating={applyCreating}
                    editing={editing}
                    applyEditing={applyEditing}
                    type={type}
                />
            </Chat>
        </div>
    )
}

export default MainApplication;