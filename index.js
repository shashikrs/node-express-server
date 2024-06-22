const express = require("express");
const app = express();
const port = 3000;

//app start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//middleware - handle all requests
const requestLogger = (req, res, next) => {
  console.log(`${req.method}${req.url}`);
  next();
};

//middleware - handle all responses
const responseHandler = (req, res, next) => {
  res.setHeader("X-Custom-Header", "CustomHeaderValue");
  next();
};

//middleware - handle specific response
const singleResponseHandler = (req, res, next) => {
  res.customResponse = (data) => {
    res.send(`Custom response: ${data}`);
  };
  next();
};

//middleware - handle all errors
const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something broke!"); // modifying the error response
};

//use the request response middleware handlers at the top
app.use(requestLogger);
app.use(singleResponseHandler);
app.use(responseHandler);

//routes
app.get("/", (req, res) => {
  res.send("Hello World Once Again!");
});

app.get("/about", (req, res) => {
  res.customResponse("About Page");
});

app.get("/contact", (req, res) => {
  res.send("Contact Page");
});

app.get("/error", (req, res) => {
  throw new Error("Just a simple error!");
});

//use the errors middleware handlers at the end
app.use(errorHandler);
