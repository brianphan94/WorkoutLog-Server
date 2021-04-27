const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validate = require('../middleware/validateSession');

router.get('/test', (req, res) => {
    res.send('test for userController');
});

router.post('/register', (req, res) => {
    User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    .then(user => {
        let token = jwt.sign({id:user.id}, process.env.SECRET, {expiresIn: '1d'})
        res.send({user, token})
    })
    .catch(error => res.status(500)
    .send({message: "User was not created", error: error.errors[0]}))
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(user) {
            bcrypt.compare(req.body.password, user.password, function(err, matches) {
                matches ? generateToken(user) : res.send('Incorrect Password')
            })

            function generateToken(user) {
                let token = jwt.sign({id: user.id}, process.env.SECRET, {expiresIn: '1d'})
                res.send({user, token})
            }
        } else (
            res.send('No user found in the database')
        )
    })
});

router.get('/list', validate, (req, res) => {
    User.findAll()
    .then(user => res.status(200).json({user}))
    .catch(err => res.status(500).json({message: 'Could not find users', error: err}))
});

router.get('find', validate, (req, res) => {
    User.findOne()
    .then(user => res.status(200).json({user}))
    .catch(err => res.status(500).json({message: `Successfully updated user ${req.params.id}`, error: err}))
});

router.put('/update', validate, (req, res) => {
    User.update(req.body, {where: {id: req.params.id}})
    .then(updated => res.status(200).json({message: `Successfully updated user ${req.params.id}`, updated}))
    .catch(err => res.status(500).json({message: 'Update unsuccessful, ', error: err}))
});

router.delete('/delete', validate, (req, res) => {
    User.destroy({where: {id: req.params.id}})
    .then(deleted => res.status(200).json({message: `User #${req.params.id} successfully deleted`, deleted}))
    .catch(err => res.status(500).json({message: `Could not delete user #${req.params.id}`, err}))
});


module.exports = router;