import { Avatar, useChatContext } from 'stream-chat-react';
import React, { useEffect, useState } from 'react';
import { InviteIcon } from '../assets';

const UserSelect = ({ user, applySelectedUsers }) => 
{
    const [selected, applySelected] = useState(false)

    const selectedFunction = () => 
    {
        //when the user is not selected
        if(!selected) 
        {
            applySelectedUsers((otherUsers) => [...otherUsers, user.id])
        } 
        //when the user is selected
        else 
        {
            applySelectedUsers((otherUsers) => otherUsers.filter((otherUser) => otherUser !== user.id))
        }
        //select and unselect users
        applySelected((selectedUser) => !selectedUser)
    }

    return (
        <div className="user-item__wrapper" onClick={selectedFunction}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className="user-item__name">{user.fullName || user.id}</p>
            </div>
            {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
        </div>
    )
}


const UserDisplay = ({ applySelectedUsers }) => 
{
    const [checkLoading, applyLoading] = useState(false);
    const { client } = useChatContext();
    const [users, applyUsers] = useState([]);
    const [checkError, applyError] = useState(false);
    const [checkEmpty, applyEmpty] = useState(false);

    useEffect(() => 
    {
        const currentUsers = async () => 
        {
            //if running into loading problems return nothing
            if(checkLoading) 
            {
                return
            }
            //set loading to true as the loading of users process begins
            applyLoading(true);
            
            try 
            {
                //obtain the user list that does not include you
                const userList = await client.queryUsers({ id: { $ne: client.userID } }, { id: 1 }, { limit: 8 })
                //if the user list has users
                if(userList.users.length) 
                {
                    //then display those users
                    applyUsers(userList.users);
                } 
                else 
                {
                    //otherwise show no users
                    applyEmpty(true);
                }
            } 
            catch (error) 
            {
                //if there is an error set error to true to indicate it
               applyError(true);
            }
            //after finishing the loading of users set loading to false
            applyLoading(false);
        }
        //if the client exists
        if(client) 
        {
            //show the current users
            currentUsers()
        }
    }, [])

    //send empty message if no users are found
    if(checkEmpty) 
    {
        return (
            <CreateUserList>
                <div className="user-list__message">
                    No users found.
                </div>
            </CreateUserList>
        )
    }
    //send error message if there is an error
    if(checkError) 
    {
        return (
            <CreateUserList>
                <div className="user-list__message">
                    Error loading, please refresh and try again.
                </div>
            </CreateUserList>
        )
    }

    return (
        <CreateUserList>
            {checkLoading ? <div className="user-list__message">
                Loading users...
            </div> : (
                users?.map((user, index) => (
                  <UserSelect index={index} key={user.id} user={user} applySelectedUsers={applySelectedUsers} />  
                ))
            )}
        </CreateUserList>
    )
}

const CreateUserList = ({ children }) => 
{
    //show users and allow them to invite
    return (
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

export default UserDisplay;