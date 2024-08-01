const path = require('path');

const express = require('express');
const app = express();

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let cors = require('cors');
app.use(cors());

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const shopRoutes = require('./routes/shop');
app.use('/shop', shopRoutes);

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})

User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize.sync({})
.then(() => {
    console.log('Listening...');
    app.listen(3000);
})
.catch(err => console.log(err))