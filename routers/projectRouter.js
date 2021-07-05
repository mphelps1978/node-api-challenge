const express = require('express');

const Projects = require('../data/helpers/projectModel');
const Actions = require('../data/helpers/actionModel');

const router = express.Router();

// **********************************************************************

// Endpoints

// GET /api/projects endpoint to Retrieve projects - ACTIVE
router.get('/', (req, res) => {
  Projects.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error retrieving the projects' });
    });
});

// POST /api/projects endpoint to Create a new project - ACTIVE
router.post('/', validateProject, (req, res) => {
  Projects.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error adding the project' });
    });
});

// PUT /api/projects/:id endpoint to Update a project - ACTIVE
router.put('/:id', validateProject, (req, res) => {
  Projects.update(req.params.id, req.body)
    .then(project => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: 'The project could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error updating the project' });
    });
});

// DELETE /api/projects/:id endpoint to Delete a project - ACTIVE
router.delete('/:id', (req, res) => {
  Projects.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The project has been deleted' });
      } else {
        res.status(404).json({ message: 'The project could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error removing the project' });
    });
});

// GET /api/projects/:id/actions endpoint to Retrieve actions by project - ACTIVE
router.get('/:id/actions', (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then(actions => {
      if (actions[0]) {
        res.status(200).json(actions);
      } else {
        res.status(404).json({ message: 'The project could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: 'Error getting the actions for the project' });
    });
});

// POST /api/projects/:id/actions endpoint to Create a new action by project - ACTIVE
router.post('/:id/actions', validateAction, (req, res) => {
  const actionInfo = { ...req.body, project_id: req.params.id };

  Projects.getProjectActions(req.params.id)
    .then(actions => {
      if (actions[0]) {
        Actions.insert(actionInfo)
          .then(action => {
            if (action) {
              res.status(201).json(action);
            } else {
              res
                .status(404)
                .json({ message: 'The project could not be found' });
            }
          })
          .catch(err => {
            console.log(err);
            res
              .status(500)
              .json({ message: 'Error adding the action for the project' });
          });
      } else {
        res.status(404).json({ message: 'The project could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: 'Error getting the actions for the project' });
    });
});

// **********************************************************************

// Custom Middleware

// Validate  on create new project request - ACTIVE
function validateProject(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: 'Missing project data!' });
  } else if (!req.body.name) {
    res.status(400).json({ message: 'Missing required "name" field!' });
  } else if (!req.body.description) {
    res.status(400).json({ message: 'Missing required "description" field!' });
  } else {
    next();
  }
}

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

// **********************************************************************

module.exports = router;