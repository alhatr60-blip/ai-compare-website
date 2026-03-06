# AI Gateway Server

This is the backend server for a web application that integrates with multiple AI services. It acts as a secure gateway to handle API requests to various large language models (LLMs), such as those from Anthropic and Google Gemini.

## Features

- Connects to multiple AI providers.
- Securely manages API keys via environment variables.
- Provides a simple and scalable backend for a front-end application.

## Project Structure

The primary backend logic resides within the `/server` directory.

```
/
├── server/
│   ├── .env         # Environment variables (API keys, port)
│   └── ...          # Server source files
└── README.md
```

## Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn

## Setup and Installation

1.  Clone this repository to your local machine.
2.  Navigate to the server's directory:
    ```bash
    cd server
    ```
3.  Install the project dependencies:
    ```bash
    npm install
    ```

## Configuration

The server requires API keys to communicate with the AI services. These are stored in an `.env` file inside the `/server` directory.

Make sure your `server/.env` file is populated with your actual API keys.

```dotenv
# server/.env
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## Running the Server

1.  Change into the `server` directory.
2.  Execute the following command to start the application:
    ```bash
    npm start
    ```
3.  The server will start on the port defined in your `.env` file (e.g., `http://localhost:5000`).