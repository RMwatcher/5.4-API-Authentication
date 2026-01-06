import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

const yourUsername = "litehero";
const yourPassword = "TicTacBar";
const yourAPIKey = "11e7b27c-5cc9-472c-85a4-95d44dcc58e5";
const yourBearerToken = "249b741a-f00b-45ee-baaa-0fb17bdee85c";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
  try {
    const response = await axios.get(API_URL + "random");
    const result = JSON.stringify(response.data);
    res.render("index.ejs", { content : result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
  
});

app.get("/basicAuth", async (req, res) => {
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  try {

    const result = await axios.get(API_URL + "all?page=2", {
       auth: {
         username: "litehero",
         password: "TicTacBar",
       },
     });
     res.render("index.ejs", { content : JSON.stringify(result.data) })
    } catch (error) {
      console.status(404).send(error.message);
    }
 });

app.get("/apiKey", async (req, res) => {
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
  try {
    const result = await axios.get(API_URL + "filter", {
      params : {
        score : 5,
        apiKey : yourAPIKey,
      },
      });
    res.render("index.ejs", { content : JSON.stringify(result.data) })

  } catch (error) {
      console.status(404).send(error.message);
  }
});

const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.get("/bearerToken", async (req, res) => {
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  try {
    const result = await axios.get(API_URL + "secrets/42", config);      
    res.render("index.ejs", { content : JSON.stringify(result.data) });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
