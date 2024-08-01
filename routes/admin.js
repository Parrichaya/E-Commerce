const path = require('path');

const express = require('express');
const userAuth = require('../middleware/auth');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/products', userAuth.authenticate, adminController.getProducts);

router.post('/add-product', userAuth.authenticate, adminController.postAddProduct);

router.get('/edit-product/:productId', userAuth.authenticate, adminController.getEditProduct);

router.post('/edit-product', userAuth.authenticate, adminController.postEditProduct);

router.post('/delete-product', userAuth.authenticate, adminController.postDeleteProduct);

module.exports = router;
