import { Channel, MessageTeam } from 'stream-chat-react';
import { ChannelChatBox, ChannelCreation, ChannelEdit } from './';
import React from 'react';


const ChannelController = ({ creating, applyCreating, editing, applyEditing, type }) => 
{
    //the case when a new direct message or channel is made
    const newChat = () => (
        <div className="channel-empty__container">
            <p className="channel-empty__first">Welcome to your new chat channel!</p>
            <p className="channel-empty__second">Send messages, attachments, links, emojis, and more!</p>
        </div>
    )
    //if the user is editing a channel
    if(editing) 
    {
        //run the ChannelEdit function
        return (
            <div className="channel__container">
                <ChannelEdit applyEditing={applyEditing} /> 
            </div> 
        )
    } 
    //if the user is creating a new channel
    if(creating) 
    {
        //run the ChannelCreation function and give it the type of channel
        return (
            <div className="channel__container">
                <ChannelCreation type={type} applyCreating={applyCreating} />
            </div>
        )
    }

    return (
        <div className=" channel__container">
            <Channel
                EmptyStateIndicator={newChat}
                Message={(messageProperties, key) => <MessageTeam key={key} {...messageProperties} />}
            >
                <ChannelChatBox applyEditing={applyEditing} />
            </Channel>
        </div>
    )
}

export default ChannelController;