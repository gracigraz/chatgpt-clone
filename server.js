const PORT = 8000; //This is the port number that the server will listen on.
const express = require("express"); // importing the Express.js framework for Node.js, create an instance of express, so that we can use it on this project
const cors = require("cors"); //import the "cors" middleware to get rid of any calls and messages that we might come across often encountered when making requests from a web application to a different domain.

require("dotenv").config(); //load environment variables from .env file into the Node.js process's environment (API_KEY)

const app = express(); //initialize and create an Express application by calling the express function. The app object will be used to define routes and handle HTTP requests.
app.use(express.json()); //configure Express to parse JSON data sent in the request body. It's essential to enable the server to handle JSON data in POST requests. I know I'm going to be using JSON, this allows us to use json when we start sending stuff from the front and to the backend with our post requests, cannot pass jsons from the frontend to the backend without this
app.use(cors()); // add CORS middleware to the Express app. It allows the server to respond to requests from different origins, for interacting with web applications.

const API_KEY = process.env.API_KEY; //fetch API key from environment variables. The API key is defined in the .env file and used to authenticate with the OpenAI API.

// POST request handler for the "/completions" route. It's an asynchronous function that handles requests to complete text using the OpenAI GPT-3.5 Turbo model.
app.post("/completions", async (req, res) => {
  console.log("hi");
  // seting up the necessary headers, including the API key and content type that we are going to pass through with the URL.
  const options = {
    //what kind of request, what headers, which api key, which model you want to use
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    // preparing a JSON object containing the model, messages, and max_tokens to be sent to the OpenAI API.
    body: JSON.stringify({
      model: "gpt-3.5-turbo-0613",
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 100, //The maximum number of tokens to generate in the chat completion.
    }),
  };
  try {
    // POST request to "https://api.openai.com/v1/chat/completions" using the fetch function, fectch the completions API.
    console.log("hi2");
    const response = await fetch(
      //https://platform.openai.com/docs/api-reference/chat/create
      "https://api.openai.com/v1/chat/completions",
      options
    );
    // await the response and send the JSON data received from the OpenAI API as the response to the client.
    const data = await response.json(); //we are going to await it and once we get it back we are going to save it as a json
    res.send(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 400) {
      res.status(400).send("Invalid request");
    } else {
      res.status(500).send("An error ocurred");
    }
  }
});

app.listen(PORT, () => console.log("Your server is running on PORT " + PORT)); //setup our port, start Express app, making it listen on the specified PORT. When the server starts, it logs a message to the console indicating that it's running and on which port. If no routes were defined i would just show "Cannot GET/"
