const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require("./routes/routes");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const mongoString = "mongodb://localhost:27017/bloodbank";
const port = process.env.PORT | 5000;

mongoose.connect(mongoString, {
  useNewUrlParser: "true",
  useUnifiedTopology: "true",
  // useCreateIndex: "true",
});

const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
});
database.once('connected', () => {
  console.log('Database Connected');
});


app.get('/test', async (req, res) => {
  console.log(`App Running On Port ${port}`);
  res.status(200).send(`App Running On Port ${port}`);
});
app.use('/api', routes);

app.listen(port, () => {
	console.log(`Server Running On Port ${port}`);
});