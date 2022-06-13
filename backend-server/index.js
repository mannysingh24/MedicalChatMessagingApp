const authRoutes = require("./routes/auth.js");
const express = require('express');
const cors = require('cors');
const application = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();


const msgsid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio')(sid, token);

application.use(express.json());
application.use(cors());
application.use(express.urlencoded());

application.post('/', (request, response) => 
{
    //obtain the user and message
    const { message, user: sender, type, members } = request.body;

    //if the message was just sent
    if(type === 'message.new') 
    {
        members
            .filter((member) => member.user_id !== sender.id) //find which member it was sent to
            .forEach(({ user }) => {
                if(!user.online) 
                {
                    //send the user a sms notification
                    twilio.messages.create({body: `You have a new message from ${message.user.fullName} - ${message.text}`, messagingServiceSid: msgsid, to: user.phoneNumber})
                        .then(() => console.log('Message sent!')) //send this message if the process was successful
                        .catch((err) => console.log(err)) //if there was an error log it
                }
            })

            return response.status(200).send('Message sent!') //message was sent successfully
    }
    //message was not new
    return response.status(200).send('Not a new message request');
});

application.use('/auth', authRoutes); //used for backend authentication

application.listen(PORT, () => console.log(`Server running on port ${PORT}`)) //uses the port for backend services