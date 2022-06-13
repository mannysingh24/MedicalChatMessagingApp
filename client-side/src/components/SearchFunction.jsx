import { SearchResults } from './'
import React, { useState, useEffect } from 'react';
import { SearchIcon } from '../assets';
import { useChatContext } from 'stream-chat-react';

const SearchFunction = ({ applyChange }) => 
{
    const [checkLoading, applyLoading] = useState(false);
    const { client, setActiveChannel } = useChatContext();
    const [directChannels, applyDirectChannels] = useState([])
    const [search, applySearch] = useState('');
    const [groupChannels, applyGroupChannels] = useState([])

    useEffect(() => 
    {
        //if the user is not searching, show an empty list
        if(!search) 
        {
            applyDirectChannels([]);
            applyGroupChannels([]);
        }
    }, [search])

    //when the channel is changed, remove the text from the search bar and set the active channel
    const changeChannel = (channel) => 
    {
        setActiveChannel(channel);
        applySearch('');
    }

    //during each search obtain the text
    const eachSearch = (currentEvent) => 
    {
        //denies automatic reload
        currentEvent.preventDefault();

        currentChannels(currentEvent.target.value)
        applyLoading(true);
        applySearch(currentEvent.target.value);
    }

    const currentChannels = async (currentText) => 
    {
        try 
        {
            //obtains the user the user is looking for
            const findUser = client.queryUsers({id: { $ne: client.userID }, name: { $autocomplete: currentText }})
            //obtains the channel the user is looking for
            const findChannel = client.queryChannels({type: 'team', name: { $autocomplete: currentText }, members: { $in: [client.userID]}})
            //waits to find either the channel or user
            const [channels, { users }] = await Promise.all([findChannel, findUser]);
            //if there are users, show the direct channel with those users
            if(users.length) 
            {
                applyDirectChannels(users);
            }
            //if channels exist, show those channels
            if(channels.length) 
            {
                applyGroupChannels(channels);
            }
        } 
        //in the case of an error, remove all text from the search
        catch (error) 
        {
            applySearch('')
        }
    }

    return (
        <div className="channel-search__container">
            <div className="channel-search__input__wrapper">
                <div className="channel-serach__input__icon">
                    <SearchIcon />
                </div>
                <input className="channel-search__input__text" placeholder="Search" type="text" value={search} onChange={eachSearch} />
            </div>
            { search && (
                <SearchResults groupChannels={groupChannels} directChannels={directChannels} checkLoading={checkLoading} changeChannel={changeChannel} applySearch={applySearch} applyChange={applyChange} />
            )}
        </div>
    )
}

export default SearchFunction