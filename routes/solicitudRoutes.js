const router = require('express').Router();
const c = require('../controllers/solicitudController');
const { protegerApi } = require('../middleware/auth');

router.post('/', c.crear);                           // público: el cliente registra su solicitud
router.get('/', protegerApi, c.listar);              // privado
router.get('/:id', protegerApi, c.obtener);          // privado
router.put('/:id', protegerApi, c.actualizarEstado); // privado
router.delete('/:id', protegerApi, c.eliminar);      // privado

module.exports = router;
