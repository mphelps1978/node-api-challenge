const express = require('express');

const projectRouter = require('./routers/projectRouter');
const actionRouter = require('./routers/actionRouter');

const app = express();

app.use(logger);
app.use(express.json());


app.use('/api/projects', projectRouter);
app.use('/api/actions', actionRouter);

app.get('/', (req, res) => {
  res.send(`<h2>Node.js Sprint Challenge!</h2>`);
});

// Custom Middleware
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);

  next();
}

const port = 5000

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});