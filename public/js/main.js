document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname;

  function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      if (section.id === sectionId) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  }

  // Add event listeners to navbar links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // event.preventDefault();
      const sectionId = link.getAttribute('data-section');
      showSection(sectionId);

      switch(sectionId) {
        case 'products':
          Products();
          break;
        case 'cart':
          Cart();
          break;
        case 'orders':
          Orders();
          break;
        case 'adminProducts':
          AdminProducts();
          break;
        case 'addProduct':
          document.getElementById('add-product-form').reset();
          break;
      }
    });
  });

  function AdminProducts() {
    axios
      .get('http://localhost:3000/admin/products', { headers: { "Authorization": localStorage.getItem("token") } })
      .then(response => {
        console.log('Admin products fetched:', response.data);
        const products = response.data.products;
        const adminProductList = document.getElementById('admin-product-list');
        adminProductList.innerHTML = ''; 
        products.forEach(product => {
          const productCard = document.createElement('div');
          productCard.className = 'col-md-4';
          productCard.innerHTML = `
            <div class="card mb-4 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-text">$${product.price}</p>
                <div class="d-flex justify-content-between">
                    <button class="btn btn-primary edit" data-id="${product.id}">Edit</button>
                    <button class="btn btn-primary delete-product" data-id="${product.id}">Delete</button>
                </div>
              </div>
            </div>
          `;
          adminProductList.appendChild(productCard);
        });
      })
      .catch(error => console.error('Admin products fetch error:', error));
  }

  function Products() {
    // Fetch and display products
    axios
      .get('http://localhost:3000/shop/products', { headers: { "Authorization": localStorage.getItem("token") } })
      .then(response => {
        const products = response.data.products;
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; 
        products.forEach(product => {
          const productCard = document.createElement('div');
          productCard.className = 'col-md-4';
          productCard.innerHTML = `
            <div class="card mb-4 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-text">$${product.price}</p>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
              </div>
            </div>
          `;
          productList.appendChild(productCard);
        });
      })
      .catch(error => console.error(error));
    }

  function Cart() {
    // Fetch and display cart items
    axios
      .get('http://localhost:3000/shop/cart', { headers: { "Authorization": localStorage.getItem("token") } })
      .then(response => {
        const products = response.data.products;
        const cartList = document.getElementById('cart-list');
        placeOrderBtn = document.getElementById('place-order');
        cartList.innerHTML = ''; 
        if (products.length > 0) {
          placeOrderBtn.style.display = 'block';
        }
        else {
          placeOrderBtn.style.display = 'none';
        }
        products.forEach(product => {
          const cartItem = document.createElement('li');
          cartItem.className = 'list-group-item d-flex justify-content-between align-items-center';
          cartItem.innerHTML = `
            ${product.title} - $${product.price} x ${product.cartItem.quantity}
            <button class="btn btn-danger btn-sm remove-from-cart" data-id="${product.id}">Remove</button>
          `;
          cartList.appendChild(cartItem);
        });
      })
      .catch(error => console.error(error));
    }

  function Orders() {
    // Fetch and display orders
    axios
      .get('http://localhost:3000/shop/orders', { headers: { "Authorization": localStorage.getItem("token") } })
      .then(response => {
        const orders = response.data.orders;
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = '';
        orders.forEach(order => {
          const orderDiv = document.createElement('div');
          orderDiv.className = 'order';
          orderDiv.innerHTML = `
            <h5>Order ID: ${order.id}</h5>
            <ul>
              ${order.products.map(product => `<li>${product.title}, $${product.orderItem.price} x ${product.orderItem.quantity}</li>`).join('')}
            </ul>
            <h5>Total: $${order.total}</h5>
            <hr>
          `;
          ordersList.appendChild(orderDiv);
        });
      })
      .catch(error => console.error('Error fetching orders:', error));
  }
    

  function handleAddProduct(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    axios.post("http://localhost:3000/admin/add-product", { title, price, description }, { headers: { "Authorization": localStorage.getItem("token") } })
      .then(response => {
        alert('Product added successfully');
        document.getElementById('add-product-form').reset();
      })
      .catch(error => console.error(error));
  }

  if (currentPath.includes('admin-products.html')) {
    showSection('adminProducts');
    AdminProducts();
    // Handle delete product button click
    document.getElementById('admin-product-list').addEventListener('click', function(event) {
      if (event.target.classList.contains('delete-product')) {
        console.log('Delete button clicked');
        const prodId = event.target.getAttribute('data-id');
        console.log('Product ID:', prodId);
        axios.post('http://localhost:3000/admin/delete-product', 
          { productId: prodId },
          { headers: { "Authorization": localStorage.getItem("token") } })
          .then(response => {
            alert('Product deleted');
            AdminProducts();
          })
          .catch(error => console.error('Delete error:', error));
      }
    });

    // Handle edit product button click
    document.getElementById('admin-product-list').addEventListener('click', function(event) {
      if (event.target.classList.contains('edit')) {
        const prodId = event.target.getAttribute('data-id');
        axios.get(`http://localhost:3000/admin/edit-product/${prodId}`, { headers: { "Authorization": localStorage.getItem("token") } })
          .then(response => {
            const product = response.data.product;
            document.getElementById('edit-product-id').value = product.id;
            document.getElementById('edit-title').value = product.title;
            document.getElementById('edit-price').value = product.price;
            document.getElementById('edit-description').value = product.description;
            showSection('editProduct');
          })
          .catch(error => console.error(error));
        }
      });
    
    // Handle update product form submission
    document.getElementById('edit-product-form').addEventListener('submit', function(event) {
      event.preventDefault();
      const prodId = document.getElementById('edit-product-id').value;
      const title = document.getElementById('edit-title').value;
      const price = document.getElementById('edit-price').value;
      const description = document.getElementById('edit-description').value;
      axios.post(`http://localhost:3000/admin/edit-product`, 
      { productId: prodId, title: title, price: price, description: description },
      { headers: { "Authorization": localStorage.getItem("token") } })
        .then(response => {
          alert('Product updated successfully');
          document.getElementById('edit-product-form').reset();
        })
        .catch(error => console.error(error));
      });
  } else if (currentPath.includes('products.html')) {
    showSection('products');
    Products();
    // Handle add to cart button click
    document.getElementById('product-list').addEventListener('click', function(event) {
      if (event.target.classList.contains('add-to-cart')) {
        const prodId = event.target.getAttribute('data-id');
        axios.post('http://localhost:3000/shop/cart', { productId: prodId }, { headers: { "Authorization": localStorage.getItem("token") } })
          .then(response => {
            alert('Product added to cart');
          })
          .catch(error => console.error(error));
        }
      });
  } else if (currentPath.includes('cart.html')) {
    showSection('cart');
    Cart();
    // Handle remove from cart button click
    document.getElementById('cart-list').addEventListener('click', function(event) {
      if (event.target.classList.contains('remove-from-cart')) {
        const prodId = event.target.getAttribute('data-id');
        axios.post('http://localhost:3000/shop/cart-delete-item', { productId: prodId } ,{ headers: { "Authorization": localStorage.getItem("token") } })
          .then(response => {
            alert('Product removed from cart');
            Cart();
          })
          .catch(error => console.error(error));
        }
      });
    
    // Handle place order button click
    document.getElementById('place-order').addEventListener('click', function() {
      axios.post('http://localhost:3000/shop/create-order', {}, { headers: { "Authorization": localStorage.getItem("token") } })
        .then(response => {
          alert('Order placed successfully');
          Cart(); // Refresh the cart to show it's empty
          window.location.href = 'orders.html'; 
        })
        .catch(error => console.error('Order placement error:', error));
    });
    
    } else if (currentPath.includes('add-product.html')) {
        document.getElementById('addProduct').addEventListener('submit', handleAddProduct);
    } else if (currentPath.includes('orders.html')) {
        showSection('orders');
        Orders();
    }
});
  

  

  

  

  