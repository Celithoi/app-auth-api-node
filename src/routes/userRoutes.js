const express = require('express');

const router = express.Router();

// Importa o controller que acabamos de preencher
const userController = require('../controllers/userControllers');

// Define que uma requisição POST para a raiz deste router ('/')
// deve acionar a função 'register' do nosso controller.
router.post('/register', userController.register);

module.exports = router;
