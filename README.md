## Problem Statement
Create a backend system for a secure file-sharing platform that allows users to share encrypted
text files. Users can register by providing a username, create encrypted files, add other users to
access those files, and view decrypted files shared with them. Each user will have a public and
private key pair for encryption and decryption. No user authentication or database storage is
required.

### Routes
1. Register User
   - Description: Allows users to register by providing a username.
   - Request Body: `{ "username": "example_user" }`
   - Response: `{ "message": "User registered successfully" }`
   
2. Create Encrypted File
   - Description: Allows users to create an encrypted file by providing the text content.
   - Request Body: `{ "content": "plain_text_content" }`
   - Response: `{ "message": "File created successfully" }`
   
3. Add User to File
   - Description: Allows users to add other users to access the encrypted file.
   - Request Parameters: fileId (ID of the encrypted file)
   - Request Body: `{ "username": "username_to_add" }`
   - Response: `{ "message": "User added successfully" }`
   
4. View All Files
   - Description: Allows users to view all encrypted files created by all users. Only files shared with the user or created by the user will be decrypted and visible in plain text.
   - Response: Array of encrypted file objects

### Functional Requirements
1. Users can register with a unique username.
2. Users can create encrypted text files.
3. Users can add other users to access their encrypted files.
4. Encrypted files are decrypted only for the user who created the file or for users added to access the file.
5. Each user has a public and private key pair for encryption and decryption.

### Non-Functional Requirements
1. Security:
   - Encryption algorithms should be secure (e.g., AES).
   - Public and private keys should be securely stored and managed.
   
2. Performance:
   - The system should handle concurrent requests efficiently.
   - Response times should be reasonable even with a large number of files and users.
   
3. Scalability:
   - The system should be able to scale horizontally to accommodate increasing numbers of users and files.
   
4. Reliability:
   - The system should be robust and reliable, with minimal downtime.
   - Data integrity should be maintained at all times.
   
5. Usability:
   - The API should have clear and intuitive endpoints.
   - Error messages should be descriptive and user-friendly.
   
6. Documentation:
   - Comprehensive documentation should be provided for API endpoints and usage.
   - Encryption and decryption processes should be documented for developer's reference.

### Additional Notes
1. User authentication is not required; username serves as the unique identifier.
2. No database storage is needed; data can be stored in memory or a temporary storage
solution (using local JSON DB or plain JS objects, anything should be fine).
3. TypeScript and Node.js should be used for development, with the choice of any
framework or library for handling HTTP requests and other functionalities

## General Instructions :

### Tech Stack Used
 NodeJS, Express, Typescript, File System, Crypto, Joi

### Setup
- Clone Project : 
```
git clone https://github.com/ppreetii/File-Sharing-Backend.git
```
- Install dependencies:
```
yarn or npm install
```

- Create .env file in root directory using .env.example, and update with your information


- To start server locally, run following in project directory terminal:
```
yarn start or npm start
```