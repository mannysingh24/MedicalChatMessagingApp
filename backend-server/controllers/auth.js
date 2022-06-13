const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { connect } = require('getstream');
const StreamChat = require('stream-chat').StreamChat;

require('dotenv').config();

const id = process.env.STREAM_APP_ID;
const key = process.env.STREAM_API_KEY;
const secret = process.env.STREAM_API_SECRET;

const login = async (req, res) => 
{
    try 
    {
        //connect to the server
        const streamChat = connect(key, secret, id);
        const client = StreamChat.getInstance(key, secret);
        //obtain the username and password from user
        const { username, password } = req.body;
        //find the user within the database
        const { users } = await client.queryUsers({ name: username });

        //if user is not found send appropriate message
        if(!users.length) 
        {
            return res.status(400).json({ message: 'User not found' })
        }
        //if the user is found, use brcrypt to compare the hashed password with the password they put in
        const checkPassword = await bcrypt.compare(password, users[0].hashedPassword)
        //create a token to indicate a successfuly login
        const token = streamChat.createUserToken(users[0].id)

        //successful login with correct password
        if(checkPassword) 
        {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
        } 
        //wrong password
        else 
        {
            res.status(500).json({ message: 'Incorrect password' });
        }
    } 
    //if there is any error, log and display it
    catch (error) 
    {
        console.log(error);

        res.status(500).json({ message: error });
    }
}

const signup = async (req, res) => 
{
    try 
    {
        //connect to the stream chat server
        const streamChat = connect(key, secret, id)
        //create a random user id using crypto
        const userId = crypto.randomBytes(16).toString('hex')
        //obtain all relevant information about the user
        const { fullName, username, password, phoneNumber } = req.body
        //create a hashed password to promote security
        const hashedPassword = await bcrypt.hash(password, 10)
        //create a token indicating a successful signup
        const token = streamChat.createUserToken(userId)

        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber });
    } 
    //if there is any error, log and report it
    catch (error) 
    {
        console.log(error);

        res.status(500).json({ message: error });
    }
}


module.exports = { signup, login }