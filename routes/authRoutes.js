const router = require('express').Router();
const c = require('../controllers/authController');

router.post('/login', c.login);
router.post('/logout', c.logout);
router.get('/sesion', c.sesion);

module.exports = router;
