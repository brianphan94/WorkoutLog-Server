const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Log = require('../models/log')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validate = require('../middleware/validateSession');

router.post('/log', validate, (req, res) => {
    Log.create({
        description: req.body.description,
        definition: req.body.definition,
        result: req.body.result,
        owner_id: req.body.owner_id
    })
    .then(log => res.status(200).json({log}))
    .catch(err => res.status(500).json({message: 'Failed to create log', err}))
})

router.get('/log', validate, (req, res) => {
    Log.findAll()
    .then(log => res.status(200).json({log}))
    .catch(err => res.status(500).json({message: 'Unable to aquire user logs', error: err}))
});

router.get('/log/:id', validate, (req, res) => {
    Log.findOne()
    .then(log => res.status(200).json({log}))
    .catch(err => res.status(500).json({message: `Unable to aquire log #${req.params.id}`, error: err}))
});

router.put('/log/:id', validate, (req, res) => {
    Log.update(req.body, {where: {id: req.params.id}})
    .then(updated => res.status(200).json({message: `Successfully updated log #${req.params.id}`, updated}))
    .catch(err => res.status(500).json({message: `Unable to update log #${req.params.id}`, error: err}))
});

router.delete('/log/:id', validate, (req, res) => {
    Log.destroy({where: {id: req.params.id}})
    .then(deleted => res.status(200).json({message: `Successfully deleted log #${req.params.id}`, deleted}))
    .catch(err => res.status(500).json({message: `Unable to delete log #${req.params.id}`, err}))
});

module.exports = router;