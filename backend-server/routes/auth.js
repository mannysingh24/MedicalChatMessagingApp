const { signup, login } = require('../controllers/auth.js')
const express = require('express')
const router = express.Router()
router.post('/login', login)
router.post('/signup', signup)
module.exports = router