const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const superfood = require('superfood');
const R = require('ramda');
const Chance = require('chance');
const chance = new Chance();


const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'pug');
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const items = new Array(100);
const restaurants = [...items].map(x => {
  return {
    name: superfood.random(),
    stars: chance.natural({ min: 1, max: 5}),
    price: chance.natural({ min: 1, max: 3}), 
    category: chance.pickone(['Greek','Vegan','Vegetarian','Bakery','Korean','Thai','Indian','Chinese','Mexican','Healthy','African'])
  };
});

console.log(restaurants.length);


app.get('/', (req, res) => {
  let { start, sortBy, direction } = req.query;
  start = start || 0;
  sortBy = sortBy || 'name';
  direction = direction || 'asc';
  const reverse = direction === 'asc' ? 'desc' : 'asc';
  const totalPages = restaurants.length / 10;
  const sortedData = direction === 'asc'
    ? R.sortWith([R.ascend(R.prop(sortBy))], restaurants)
    : R.sortWith([R.descend(R.prop(sortBy))], restaurants);

  const data = sortedData.slice(start, Number(start) + 10);
  res.render('index', { restaurants: data, start, totalPages, reverse, direction, sortBy });
});

app.post('/search', (req,res) => {
  const { sortBy, direction, start } = req.query;
  const { query } = req.body;
  console.log(query);
  const data = query ? restaurants.filter(r => r.name.includes(query)) : restaurants;

  const reverse = direction === 'asc' ? 'desc' : 'asc';
  const sortedData = direction === 'asc'
    ? R.sortWith([R.ascend(R.prop(sortBy))], data)
    : R.sortWith([R.descend(R.prop(sortBy))], data);

  const totalPages = sortedData.length / 10;
  const _restaurants = sortedData.slice(start, Number(start) + 10);
  const template = pug.compileFile('views/_table.pug');
  const markup = template({ restaurants: _restaurants, sortBy, reverse, direction, start, totalPages, totalResults: sortedData.length });
  res.send(markup);
});


app.listen(PORT);

console.log('Listening on port: ', PORT);



