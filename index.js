const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const pokemon = require('./pokemon.json')

const URL='https://pokeapi.co/api/v2/pokemon?limit=151'

app.options('*', cors())
app.use(cors())

app.get('/list', (req, res) => res.send(pokemon))

app.get('/pokemon', async (req, res) => {
  const results = await axios.get(URL)
  const maped = results.data.results.map(result => 
    axios.get(result.url)
      .then(pokemon => pokemon.data)
  )
  Promise.all(maped)
    .then(pokemons =>
      pokemons.map(({
        id,
        name,
        sprites,
        types
      }) => ({
        id,
        name,
        sprites,
        types: types.map(({type: {name}}) => name)
      }))
    )
    .then(response => res.send(response))
});

app.get('/types', async (req, res) => {
  const results = await axios.get(URL)
  const maped = results.data.results.map(result => 
    axios.get(result.url)
      .then(pokemon => pokemon.data)
  )
  Promise.all(maped)
    .then(pokemons =>
      pokemons.flatMap(({
        types
      }) => (types.map(({type: {name}}) => name)
      ))
    )
    .then(response => res.send([...new Set(response)]))
});

app.get('/filters', (req, res) => 
  res.send({types: [
    "poison",
    "grass",
    "fire",
    "flying",
    "water",
    "bug",
    "normal",
    "electric",
    "ground",
    "fairy",
    "fighting",
    "psychic",
    "rock",
    "steel",
    "ice",
    "ghost",
    "dragon"
    ]})
)

app.listen(4000, () => {
  console.log('Example app listening on port 4000!');
});
