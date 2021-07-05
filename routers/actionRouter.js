const express = require('express');

const Actions = require('../data/helpers/actionModel');

const router = express.Router();

// **********************************************************************

// Endpoints

// GET /api/actions endpoint to Retrieve actions - ACTIVE
router.get('/', (req, res) => {
  Actions.get()
    .then(actions => res.status(200).json(actions))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error retrieving the actions' });
    });
});

// GET /api/actions/:id endpont - to get action by ID

router.get('/:id', validatePostId, (req, res) => {
  Actions.get(req.params.id)
    .then(action => {
      if(action) {
        res.status(200).json(action)
      } else {
        res.status(404).json({message: 'Action not found'})
      }
    })
    .catch(err => {
      res.status(500).json({message: 'There was an error'})
    })
})

// PUT /api/actions/:id endpoint to Update an action - ACTIVE
router.put('/:id', validateAction, (req, res) => {
  Actions.update(req.params.id, req.body)
    .then(action => {
      if (action) {
        res.status(200).json(action);
      } else {
        res.status(400).json({ message: 'The action could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error updating the action' });
    });
});

// DELETE /api/actions/:id endpoint to Delete an action - ACTIVE
router.delete('/:id', (req, res) => {
  Actions.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The action has been deleted' });
      } else {
        res.status(404).json({ message: 'The action could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error removing the action' });
    });
});

// **********************************************************************

// Validate body on create new action request - ACTIVE
function validateAction(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: 'Missing action data!' });
  } else if (!req.body.description) {
    res.status(400).json({ message: 'Missing required "description" field!' });
  } else if (!req.body.notes) {
    res.status(400).json({ message: 'Missing required "notes" field!' });
  } else {
    next();
  }
}

// Validate ID
function validatePostId(req, res, next) {
  Actions.get(req.params.id)
    .then(action => {
      if (!action) {
        res.status(400).json({ message: 'Invalid Post ID' });
      } else {
        req.action = req.params.id;
        next();
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error validating Post ID' });
    });
}

// **********************************************************************

module.exports = router;