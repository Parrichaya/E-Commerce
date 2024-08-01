const path = require('path');

const express = require('express');
const userAuth = require('../middleware/auth');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/products', userAuth.authenticate, shopController.getProducts);

router.get('/products/:productId', userAuth.authenticate, shopController.getProduct);

router.get('/cart', userAuth.authenticate, shopController.getCart);

router.post('/cart', userAuth.authenticate, shopController.postCart);

router.post('/cart-delete-item', userAuth.authenticate, shopController.postCartDeleteProduct);

router.get('/orders', userAuth.authenticate, shopController.getOrders);

router.post('/create-order', userAuth.authenticate, shopController.postOrder);

module.exports = router;
