const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  // const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title,
    price: price,
    // imageUrl: imageUrl,
    description: description
  })
  .then(result => {
      console.log('Created product');
      res.status(201).json({ message: 'Product created successfully', product: result });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Creating product failed' });
  });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    .then(products => {
      if (!products) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ product: products[0] });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Fetching product failed' });
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  // const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      // product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('Updated product');
      res.status(200).json({ message: 'Product updated successfully', product: result });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Updating product failed' });
    });
};

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

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return product.destroy();
    })
    .then(result => {
      console.log('Destroyed product');
      res.status(200).json({ message: 'Product deleted successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Deleting product failed' });
    });
};
