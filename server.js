require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIES = require('./movies-data-small.json');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  console.log('validate bearer token middleware');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

function handleGetQuery(req, res) {
  let { country, genre, vote} = req.query;

  let response = MOVIES;

  if (country) {
    response = MOVIES.filter( movie => {
      return movie.country.toLowerCase().includes(country.toLowerCase());
    })
  }

  if (genre) {
    response = MOVIES.filter(movie => {
      return movie.genre.toLowerCase().includes(genre.toLowerCase());
    });
  }

  if(vote) {
    vote = parseInt(vote);
    response = MOVIES.filter(movie => {
      return movie.avg_vote >= vote;
    })
  }

  res.json(response)
}


app.get('/movie', handleGetQuery);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});