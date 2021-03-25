const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const superfood = require('superfood');
const R = require('ramda');


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
    stars: 4,
    price: '$$',
    category: 'Greek'
  };
});

console.log(restaurants.length);

const totalPages = restaurants.length / 10;

app.get('/', (req, res) => {
  let { start, sortBy, direction } = req.query;
  start = start || 0;
  sortBy = sortBy || 'name';
  direction = direction || 'asc';
  const reverse = direction === 'asc' ? 'desc' : 'asc';
  const sortedData = direction === 'asc'
    ? R.sortWith([R.ascend(R.prop(sortBy))], restaurants)
    : R.sortWith([R.descend(R.prop(sortBy))], restaurants);

  const data = sortedData.slice(start, Number(start) + 10);
  res.render('index', { restaurants: data, start, totalPages, reverse, direction, sortBy });
});


app.listen(PORT);

console.log('Listening on port: ', PORT);



