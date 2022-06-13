import { UserDisplay } from './';
import React, { useState } from 'react';
import { CloseCreateChannel } from '../assets';
import { useChatContext } from 'stream-chat-react';


const ChannelEdit = ({ applyEditing }) => 
{
    const { channel } = useChatContext();
    const [channelName, applyChannelName] = useState(channel?.data?.name);
    const [selectedUsers, applySelectedUsers] = useState([])

    const update = async (currentEvent) => 
    {
        //stops automatic reload
        currentEvent.preventDefault();

        //checks to see if the channel name already exists
        const checkName = channelName !== (channel.data.name || channel.data.id);
        //if more users are selected
        if(selectedUsers.length) 
        {
            //wait to see if the user adds them or not
            await channel.addMembers(selectedUsers);
        }
        //if the name exists
        if(checkName) 
        {
            //wait for the channel name to be changed by the user
            await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}`});
        }
        //after the edits to the channel are done, set the selected users, channel name to none
        //editing to false since the user is no longer editing
        applySelectedUsers([]);
        applyChannelName(null);
        applyEditing(false);
    }

    return (
        <div className="edit-channel__container">
            <div className="edit-channel__header">
                <p>Edit Channel</p>
                <CloseCreateChannel applyEditing={applyEditing} />
            </div>
            <ChangeChannelName channelName={channelName} applyChannelName={applyChannelName} />
            <UserDisplay applySelectedUsers={applySelectedUsers} />
            <div className="edit-channel__button-wrapper" onClick={update}>
                <p>Save Changes</p>
            </div>
        </div>
    )
}

const ChangeChannelName = ({ channelName = '', applyChannelName }) => 
{
    const modifyName = (currentEvent) => 
    {
        //stops automatic reload
        currentEvent.preventDefault();
        //changes the name to user text
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

export default ChannelEdit