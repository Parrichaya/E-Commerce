const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.status(200).json({ products: products });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Fetching products failed' });
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({ where: { id: prodId } })
    .then(products => {
      if (products.length > 0) {
        res.status(200).json({
          product: products[0]
        });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch product' });
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts();
    })
    .then(products => {
      res.status(200).json({
        products: products
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch cart' });
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findAll({ where: { id: prodId } });
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.status(200).json({ message: 'Product added to cart' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to add product to cart' });
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.status(200).json({ message: 'Product removed from cart' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to remove product from cart' });
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.status(200).json({ orders: orders });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Fetching orders failed.' });
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  let total = 0;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      products.forEach(product => {
        total += product.price * product.cartItem.quantity;
      })
      return req.user.createOrder({ total: total}).then(order => {
        return order.addProducts(
          products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity, price: product.price };
            return product;
          })
        );
      });
    })
    .then(result => {
      return fetchedCart.setProducts(null); // After placing the order, empty the cart
    })
    .then(() => {
      res.status(200).json({ message: 'Order placed successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Placing order failed' });
    });
};
