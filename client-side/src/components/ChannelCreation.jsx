import { CloseCreateChannel } from '../assets';
import React, { useState } from 'react';
import { UserDisplay } from './';
import { useChatContext } from 'stream-chat-react';

const ChannelCreation = ({ type, applyCreating }) => 
{
    const { client, setActiveChannel } = useChatContext();
    const [channelName, applyChannelName] = useState('');
    const [selectedUsers, applySelectedUsers] = useState([client.userID || ''])

    const createNewChannel = async (currentEvent) => 
    {
        //stops automatic reload of the page
        currentEvent.preventDefault();

        try 
        {
            //creates a new channel with specified name and selected members
            const newChannel = client.channel(type, channelName, {name: channelName, members: selectedUsers})

            //waits for the channel to be made
            await newChannel.watch();

            //add the selected users
            applySelectedUsers([client.userID])
            //user is no longer creating a channel
            applyCreating(false)
            //set the channel name text back to nothing because the channel is made
            applyChannelName('')
            //the new active channel is the channel that was just created
            setActiveChannel(newChannel)
        } 
        //log the error if there is one
        catch (error) 
        {
            console.log(error);
        }
    }

    return (
        <div className="create-channel__container">
            <div className="create-channel__header">
                <p>{type === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
                <CloseCreateChannel applyCreating={applyCreating} />
            </div>
            {type === 'team' && <ChangeChannelName channelName={channelName} applyChannelName={applyChannelName}/>}
            <UserDisplay applySelectedUsers={applySelectedUsers} />
            <div className="create-channel__button-wrapper" onClick={createNewChannel}>
                <p>{type === 'team' ? 'Create Channel' : 'Create Message Group'}</p>
            </div>
        </div>
    )
}

const ChangeChannelName = ({ channelName = '', applyChannelName }) => 
{
    const modifyName = (currentEvent) => 
    {
        //stops automatic reload
        currentEvent.preventDefault()
        //changes the channel name
        applyChannelName(currentEvent.target.value);
    }

    return (
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input value={channelName} onChange={modifyName} placeholder="channel-name" />
            <p>Add Members</p>
        </div>
    )
}

export default ChannelCreation