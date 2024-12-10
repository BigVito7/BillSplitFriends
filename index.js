let users = JSON.parse(localStorage.getItem('users')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [];
let currentLanguage = localStorage.getItem('currentLanguage') || 'en'; // Default language is English if not set

const translations = {
    en: {
        title: 'Product List',
        additem: 'Add Item',
        userpager: 'Persons',
        placeholders: {
            productName: 'Product name',
            productPrice: 'Price',
        },
        currency: '$',
        totalCost: 'Total cost:',
    },
    md: {
        title: 'Lista produselor',
        additem: 'Adauga produs',
        userpager: 'Persoane',
        placeholders: {
            productName: 'Nume produs',
            productPrice: 'Preț',
        },
        currency: 'LEI',
        totalCost: 'Cost total:',
    },
    ru: {
        title: 'Список продуктов питания',
        additem: 'Добавить продукт',
        userpager: 'Участники',
        placeholders: {
            productName: 'Название товара',
            productPrice: 'Цена',
        },
        currency: 'RUB',
        totalCost: 'Общая стоимость:',
    },
    de: {
        title: 'Liste der Lebensmittel',
        additem: 'Artikel hinzufügen',
        userpager: 'Personen',
        placeholders: {
            productName: 'Produktname',
            productPrice: 'Preis',
        },
        currency: '€',
        totalCost: 'Gesamtkosten:',
    },
};

// Сохраняет данные в LocalStorage
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('products', JSON.stringify(products));
}

function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.className = 'product-item';
        li.innerHTML = `
            <div>
                <span>${product.name} - ${product.price.toFixed(2)} <span class="money">${translations[currentLanguage].currency}</span></span>
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
    document.getElementById('total-price').textContent = `${translations[currentLanguage].totalCost} ${total.toFixed(2)} ${translations[currentLanguage].currency}`;
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

function saveLanguage(lang) {
    localStorage.setItem('currentLanguage', lang);
}

function applyLanguage() {
    const translation = translations[currentLanguage];
    document.getElementById('title').textContent = translation.title;
    document.getElementById('additem').textContent = translation.additem;
    document.getElementById('userpager').textContent = translation.userpager;
    document.getElementById('product-name').placeholder = translation.placeholders.productName;
    document.getElementById('product-price').placeholder = translation.placeholders.productPrice;
    renderProducts();
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

document.addEventListener('DOMContentLoaded', function () {
    const flagButtons = document.querySelectorAll('.flag-button');

    flagButtons.forEach(button => {
        button.addEventListener('click', function () {
            currentLanguage = button.getAttribute('data-language');
            saveLanguage(currentLanguage);
            applyLanguage();
        });
    });

    applyLanguage(); // Apply saved language on page load
    renderProducts(); // Initial render
});

// For demonstration purposes, let's log the current state
console.log('Current language:', currentLanguage);
console.log('Users:', users);
console.log('Products:', products);

// Simulating a language change
// currentLanguage = 'ru';
// renderProducts();
// console.log('Language changed to Russian. New product list:');
// document.getElementById('product-list').innerHTML.split('\n').forEach(line => console.log(line.trim()));

