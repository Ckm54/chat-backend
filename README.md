# Chat App Backend

Backend server for the Chat App, providing user authentication and messaging functionality. Built using Node.js, Express.js, and MongoDB.

### Front-end repo:
[Chat app front end](https://github.com/Ckm54/chat-app-client)


## Features

- User Registration:
  
   - Users can create accounts by registering with their email and password.
- User Login:
  
   - Registered users can log in to the app using their credentials.
- User Details:
  
    - Retrieve user details, including username and email.
- Real-Time Messaging:
  
    - Implement real-time messaging using WebSocket (Socket.io).
- Get Messages:
  
     - Retrieve messages for a particular conversation.
- Add Message:
  
     - Add a new message to a conversation.


## Getting Started
Prerequisites

    Node.js and npm installed on your machine.
    
    MongoDB database set up and running.

Installation

    Clone the repository:

    bash

git clone https://github.com/Ckm54/chat-backend.git

Navigate to the project directory:

```bash

  cd chat-app-backend

  Install dependencies:
```

```bash

npm install
```

Set up environment variables:

    Rename .env.example to .env and fill in the required values.

Start the server:

bash

    npm run dev

    The server will be running at http://localhost:8000.

## API Routes

    Register: POST /api/auth/register
        Register a new user with username, fullName, email and password.

    Login: POST /api/auth/login
        Log in a user with email and password.

    Other users: GET /api/auth/allusers/:id
        Retrieve all other users exluding the current user.

    Get Messages: GET /api/messages/get-messages
        Retrieve messages for a particular conversation.

    Add Message: POST /api/messages/addmsg
        Add a new message to a conversation.

## Technologies Used

    Node.js
    Express.js
    Typescript
    MongoDB
    Socket.io
    JWT (JSON Web Tokens)
    Render -- Api hosting

## Future Enhancements

    User profile management
    
    User authentication using third-party providers (e.g., Google, Facebook)
    
    Error handling and validation improvements

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## License

This project is licensed under the MIT License.
