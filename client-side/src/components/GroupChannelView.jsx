import { Avatar, useChatContext } from 'stream-chat-react';
import React from 'react';

const GroupChannelView = ({ setActiveChannel, applyCreating, applyEditing, applyChange, channel, type }) => 
{
    const { channel: mainChannel, client } = useChatContext();

    const DirectView = () => 
    {
        //obtain the all the users, except yourself
        const users = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);

        //return the direct message preview
        return (
            <div className="channel-preview__item single">
                <Avatar image={users[0]?.user?.image} name={users[0]?.user?.fullName || users[0]?.user?.id} size={24} />
                <p>{users[0]?.user?.fullName || users[0]?.user?.id}</p>
            </div>
        )
    }
    //returns the group message preview
    const GroupView = () => (
        <p className="channel-preview__item">
            # {channel?.data?.name || channel?.data?.id}
        </p>
    )

    //switch between channel views
    return (
        <div className={
            channel?.id === mainChannel?.id
                ? 'channel-preview__wrapper__selected'
                : 'channel-preview__wrapper'
        }
        onClick={() => 
        {
            applyCreating(false);
            applyEditing(false);
            setActiveChannel(channel);
            if(applyChange) {
                applyChange((mode) => !mode)
            }
        }}
        >
            {type === 'team' ? <GroupView /> : <DirectView />}
        </div>
    )
}

export default GroupChannelView