import { MessageList, MessageInput, Thread, Window, useChannelActionContext, Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react';
import { ChannelInfo } from '../assets';
import React, { useState } from 'react';
export const GiphyContext = React.createContext({});


const ChannelHeaders = ({ applyEditing }) => 
{
    const { channel, watcher_count } = useChannelStateContext();
    const { client } = useChatContext();
  
    const MessagingHeader = () => 
    {
      //obtains all current channel members
      const getChannelMembers = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
      //obtains any extra members
      const extraMembers = getChannelMembers.length - 3;
  
      //in the case that the channel is a direct message, obtain the users name and avatar
      if(channel.type === 'messaging') 
      {
        return (
          <div className='team-channel-header__name-wrapper'>
            {getChannelMembers.map(({ user }, index) => (
              <div key={index} className='team-channel-header__name-multi'>
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className='team-channel-header__name user'>{user.fullName || user.id}</p>
              </div>
            ))}
  
            {extraMembers > 0 && <p className='team-channel-header__name user'>and {extraMembers} more</p>}
          </div>
        )
      }
  
      //display the channel name
      return (
        <div className='team-channel-header__channel-wrapper'>
          <p className='team-channel-header__name'># {channel.data.name}</p>
          <span style={{ display: 'flex' }} onClick={() => applyEditing(true)}>
            <ChannelInfo />
          </span>
        </div>
      )
    }
  
    const checkOnlineUsers = (users) => 
    {
      //if only one user is online
      if (users === 1) 
      {
        return '1 user online';
      }
      //if no users are online
      if (!users) 
      {
        return 'No users online';
      }
      //otherwise more than one users are online
      return `${users} users online`;
    }
    return (
      <div className='team-channel-header__container'>
        <MessagingHeader />
        <div className='team-channel-header__right'>
          <p className='team-channel-header__right-text'>{checkOnlineUsers(watcher_count)}</p>
        </div>
      </div>
    )
  }

const ChannelChatBox = ({ applyEditing }) => 
{
  const { sendMessage: getMessage } = useChannelActionContext();
  const [isGIF, applyGIF] = useState(false);
  
  const updateSubmitFunction = (message) => 
  {
    //obtains all the properties of the message
    let newMessage = {attachments: message.attachments, mentioned_users: message.mentioned_users, parent_id: message.parent?.id, parent: message.parent, text: message.text};
    
    //checks if a message was received
    if (getMessage) 
    {
      getMessage(newMessage);
      applyGIF(false);
    }
    //checks if the message is a GIF
    if (isGIF) 
    {
      newMessage = {...newMessage, text: `/giphy ${message.text}`};
    }
    
  }

  return (
    <GiphyContext.Provider value={{ giphyState: isGIF, setGiphyState: applyGIF }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <Window>
          <ChannelHeaders applyEditing={applyEditing} />
          <MessageList />
          <MessageInput overrideSubmitHandler={updateSubmitFunction} />
        </Window>
        <Thread />
      </div>
    </GiphyContext.Provider>
  )
}

  export default ChannelChatBox;