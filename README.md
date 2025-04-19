
# Customer Chatbot
This project is a customer chatbot built using Node.js, Express, and OpenAI's API. It allows users to interact with a chatbot to get information and assistance.

## Features - Chat with a customer service chatbot
- Clear conversation history
- View conversation history
- Persistent sessions using session IDs
## Technologies Used
- Node.js
- Express
- OpenAI API
- TypeScript     
- dotenv

## Installation
1. Clone the repository:            
git clone https://github.com/thanhdanh27600/customer-chatbot.git
2. Install dependencies:             
npm install
3. Set up environment variables:
- Create a .env file / copy the .env.example file in the root directory.
- Add your OpenAI API key:           
OPENAI_API_KEY=your-api-key-here
4. Run development server:           
npm run dev
5. Build the project:                 
npm run build
6. Start the server:                  
 npm start
 

## Usage
- Start the server using npm start.
- Use a tool like Postman or curl to send POST requests to the /chat endpoint with the following JSON body: {
  "message": "Your message here",
  "sessionId": "unique-session-id"
}   
- The chatbot will respond with a message based on your input.  - To clear the conversation history, send a POST request to the /clear endpoint with the following JSON body: {
  "sessionId": "unique-session-id"
}

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
