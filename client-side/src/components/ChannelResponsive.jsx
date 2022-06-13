import { SearchFunction, GroupChannelSection, GroupChannelView } from './';
import { ChannelList, useChatContext } from 'stream-chat-react';
import React, { useState } from 'react';
import LogoutIcon from '../assets/logout.png'
import Cookies from 'universal-cookie';
import HospitalIcon from '../assets/hospital.png'

const siteCookies = new Cookies();

const MainTitle = () => (
    <div className="channel-list__header">
        <p className="channel-list__header__text">Medical Messenger</p>
    </div>
)
const filterDirectChat = (channels) => 
{
    return channels.filter((channel) => channel.type === 'messaging');
}
const filterGroupChat = (channels) => 
{
    return channels.filter((channel) => channel.type === 'team');
}
const LeftNavigationBar = ({ logout }) => (
    <div className="channel-list__sidebar">
        <div className="channel-list__sidebar__icon1">
            <div className="icon1__inner">
                <img src={HospitalIcon} alt="Hospital" width="30" />
            </div>
        </div>
        <div className="channel-list__sidebar__icon2">
            <div className="icon1__inner" onClick={logout}>
                <img src={LogoutIcon} alt="Logout" width="30" />
            </div>
        </div>
    </div>
)

//deals with the responsive side (when user switches to phone or desktop)
const ChannelResponsive = ({ applyType, applyCreating, applyEditing }) => 
{
    const [change, applyChange] = useState(false);

    return (
        <>
            <div className="channel-list__container">
              <ChannelContent 
                applyCreating={applyCreating} 
                applyType={applyType} 
                applyEditing={applyEditing} 
              />
            </div>

            <div className="channel-list__container-responsive"
                style={{ left: change ? "0%" : "-89%", backgroundColor: "#005fff"}}
            >
                <div className="channel-list__container-toggle" onClick={() => applyChange((screen) => !screen)}>
                </div>
                <ChannelContent 
                applyCreating={applyCreating} 
                applyType={applyType} 
                applyEditing={applyEditing} 
                applyChange={applyChange}
              />
            </div>
        </>
    )
}

const ChannelContent = ({ creating, applyCreating, applyType, applyEditing, applyChange }) => 
{
    const { client } = useChatContext();
    //find members
    const filterMembers = { members: { $in: [client.userID] } }
    //when user logs out, remove all cookies so that the site does not remember them
    const logout = () => 
    {
        siteCookies.remove("token");
        siteCookies.remove('userId');
        siteCookies.remove('username');
        siteCookies.remove('fullName');
        siteCookies.remove('avatarURL');
        siteCookies.remove('hashedPassword');
        siteCookies.remove('phoneNumber');
        //after cookie removal reload the website
        window.location.reload();
    }

    return (
        <>
            <LeftNavigationBar logout={logout} />
            <div className="channel-list__list__wrapper">
                <MainTitle />
                <SearchFunction applyChange={applyChange} />
                <ChannelList 
                    filters={filterMembers}
                    channelRenderFilterFn={filterGroupChat}
                    List={(listProperties) => (
                        <GroupChannelSection {...listProperties} type="team"
                            creating={creating}
                            applyCreating={applyCreating}
                            applyType={applyType} 
                            applyEditing={applyEditing}
                            applyChange={applyChange}
                        />
                    )}
                    Preview={(previewProperties) => (
                        <GroupChannelView 
                            {...previewProperties}
                            applyCreating={applyCreating}
                            applyEditing={applyEditing}
                            applyChange={applyChange}
                            type="team"
                        />
                    )}
                />
                <ChannelList 
                    filters={filterMembers}
                    channelRenderFilterFn={filterDirectChat}
                    List={(listProperties) => (
                        <GroupChannelSection
                            {...listProperties}
                            type="messaging"
                            creating={creating}
                            applyCreating={applyCreating}
                            applyType={applyType} 
                            applyEditing={applyEditing}
                            applyChange={applyChange}
                        />
                    )}
                    Preview={(previewProperties) => (
                        <GroupChannelView 
                            {...previewProperties}
                            applyCreating={applyCreating}
                            applyEditing={applyEditing}
                            applyChange={applyChange}
                            type="messaging"
                        />
                    )}
                />
            </div>
        </>
    )
}

export default ChannelResponsive;