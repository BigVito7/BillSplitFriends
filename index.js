let users = JSON.parse(localStorage.getItem('users')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [];

function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('products', JSON.stringify(products));
}

// function renderProducts() {
//     const productList = document.getElementById('product-list');
//     productList.innerHTML = '';
//     products.forEach(product => {
//         const li = document.createElement('li');
//         li.className = 'product-item';
//         li.innerHTML = `
//                     <div>
//                         <span>${product.name} - ${product.price.toFixed(2)+" lei"}</span>
//                         <div class="user-checkboxes">
//                             ${users.map(user => `
//                                 <label for="checkbox" class="user-checkbox">
//                                     <input type="checkbox"  id="checkbox"
//                                            onchange="toggleProductUser(${product.id}, '${user.username}')"
//                                            ${product.users && product.users.includes(user.username) ? 'checked' : ''}>
//                                     ${user.username}
//                                 </label>
//                             `).join('')}
//                         </div>
//                     </div>
//                     <div>
//                         <button class ="button-mod" onclick="modifyProduct(${product.id})">Modify</button>
//                         <button class ="button-del" onclick="deleteProduct(${product.id})">Delete</button>
//                     </div>
//                 `;
//         productList.appendChild(li);
//     });
//     updateTotalPrice();
// }



function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.className = 'product-item';
        li.innerHTML = `
            <div>
                <span>${product.name} - ${product.price.toFixed(2)} lei</span>
                <div class="user-checkboxes">
                    ${users.map(user => `
                        <div class="user-checkbox">
                            <input type="checkbox" 
                                   id="checkbox-${product.id}-${user.username}"
                                   onchange="toggleProductUser(${product.id}, '${user.username}')"
                                   ${product.users && product.users.includes(user.username) ? 'checked' : ''}>
                            <label class="container1" for="checkbox-${product.id}-${user.username}">${user.username}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div>
                <button class="button-mod" onclick="modifyProduct(${product.id})">Modify</button>
                <button class="button-del" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        `;
        productList.appendChild(li);
    });
    updateTotalPrice();
}

function updateTotalPrice() {
    const total = products.reduce((sum, product) => sum + product.price, 0);
    document.getElementById('total-price').textContent = `Total cost: ${total.toFixed(2)} lei`;
}

function addProduct(name, price) {
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id, name, price, users: [] });
    saveData();
    renderProducts();
}

function modifyProduct(id) {
    const product = products.find(p => p.id === id);
    const newName = prompt('Enter new name:', product.name);
    const newPrice = parseFloat(prompt('Enter new price:', product.price));
    if (newName && !isNaN(newPrice)) {
        product.name = newName;
        product.price = newPrice;
        saveData();
        renderProducts();
    }
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    saveData();
    renderProducts();
}

function toggleProductUser(productId, username) {
    const product = products.find(p => p.id === productId);
    if (!product.users) {
        product.users = [];
    }
    const index = product.users.indexOf(username);
    if (index === -1) {
        product.users.push(username);
    } else {
        product.users.splice(index, 1);
    }
    saveData();
}

document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nameInput = document.getElementById('product-name');
    const priceInput = document.getElementById('product-price');
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    if (name && !isNaN(price)) {
        addProduct(name, price);
        nameInput.value = '';
        priceInput.value = '';
    }
});

// Initial render
renderProducts();
