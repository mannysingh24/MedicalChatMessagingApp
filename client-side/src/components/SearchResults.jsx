import { Avatar, useChatContext } from 'stream-chat-react';
import React from 'react';

//functionality for search dropdown
const SearchResults = ({ groupChannels, directChannels, mainID, checkLoading, changeChannel, applyChange }) => 
{

  return (
    <div className='channel-search__results'>
      <p className='channel-search__results-header'>Channels</p>
      {checkLoading && !groupChannels.length && (
        <p className='channel-search__results-header'>
          <i>Loading...</i>
        </p>
      )}
      {!checkLoading && !groupChannels.length ? (
        <p className='channel-search__results-header'>
          <i>No channels found</i>
        </p>
      ) : (
        groupChannels?.map((channel, index) => (
          <SearchResult channel={channel} mainID={mainID} key={index} changeChannel={changeChannel} type='channel' applyChange={applyChange} />
        ))
      )}
      <p className='channel-search__results-header'>Users</p>
      {checkLoading && !directChannels.length && (
        <p className='channel-search__results-header'>
          <i>Loading...</i>
        </p>
      )}
      {!checkLoading && !directChannels.length ? (
        <p className='channel-search__res ults-header'>
          <i>No direct messages found</i>
        </p>
      ) : (
        directChannels?.map((channel, index) => (
          <SearchResult channel={channel} mainID={mainID} key={index} changeChannel={changeChannel} type='user' applyChange={applyChange} />
        ))
      )}
    </div>
  )
}

const SearchResult = ({ channel, mainID, type, changeChannel, applyChange }) => 
{
  const { client, setActiveChannel } = useChatContext();

  //when it is a group channel and not a dm
  if (type === 'channel') 
  {
    return (
      <div
        onClick={() => 
          {
          changeChannel(channel)
          if(applyChange) 
          {
            applyChange((mode) => !mode)   
          }
        }}
        className={mainID === channel.id ? 'channel-search__result-container__focused' : 'channel-search__result-container' }
      >
        <div className='result-hashtag'>#</div>
        <p className='channel-search__result-text'>{channel.data.name}</p>
      </div>
    );
  }

  return (
    <div
      onClick={async () => {
        filterChannels({ client, setActiveChannel, channel, changeChannel })
        if(applyChange) 
        {
            applyChange((mode) => !mode)   
        }
      }}
      className={mainID === channel.id ? 'channel-search__result-container__focused' : 'channel-search__result-container' }
    >
      <div className='channel-search__result-user'>
        <Avatar image={channel.image || undefined} name={channel.name} size={24} />
        <p className='channel-search__result-text'>{channel.name}</p>
      </div>
    </div>
  )
}

const filterChannels = async ({ client, setActiveChannel, channel, changeChannel }) => 
{
  //determines the direct messages from the member count
  const messageFilter = {type: 'messaging', member_count: 2, members: { $eq: [client.user.id, client.userID] }}
  //checks to see if the obtained dm has a channel or not
  const [isChannel] = await client.queryChannels(messageFilter);
  //if this dm channel exists, set it to be the active channel
  if (isChannel) 
  {
    return setActiveChannel(isChannel)
  }
  //otherwise make a new channel with that user
  const newChannel = client.channel('messaging', { members: [channel.id, client.userID] })
  //switch to that new channel created
  changeChannel(newChannel)
  //then make it the active channel
  return setActiveChannel(newChannel)
}


export default SearchResults;