import { AddChannel } from '../assets';
import React from 'react';

const GroupChannelSection = ({ applyChange, children, error = false, checkLoading, type, creating, applyCreating, applyType, applyEditing }) => 
{
    //sends loading message if the information is currently loading
    if(checkLoading) 
    {
        return (
            <div className="team-channel-list">
                <p className="team-channel-list__message loading">
                    {type === 'team' ? 'Channels' : 'Messages'} loading...
                </p>
            </div>
        )
    }
    //sends an error message if there is currently an error
    if(error) 
    {
        return type === 'team' ? (
            <div className="team-channel-list">
                <p className="team-channel-list__message">
                    Connection error, please wait a moment and try again.
                </p>
            </div>
        ) : null
    }
    //otherwise, if there are no problems, add the channel sending in the
    //appropriate parameters as well as showing the channels that are already created
    return (
        <div className="team-channel-list">
            <div className="team-channel-list__header">
                <p className="team-channel-list__header__title">
                    {type === 'team' ? 'Channels' : 'Direct Messages'}
                </p>
                <AddChannel 
                    creating={creating}
                    applyCreating={applyCreating}
                    applyType={applyType} 
                    applyEditing={applyEditing}
                    type={type === 'team' ? 'team' : 'messaging'}
                    applyChange={applyChange}
                />
            </div>
            {children}
        </div>
    )
}

export default GroupChannelSection