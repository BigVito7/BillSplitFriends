let users = JSON.parse(localStorage.getItem('users')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [];

// Сохраняет данные в LocalStorage
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('products', JSON.stringify(products));
}

// Рассчитывает долю пользователя за товары
function calculateUserSum(username) {
    return products.reduce((sum, product) => {
        if (product.users && product.users.includes(username)) {
            return sum + (product.price / product.users.length);
        }
        return sum;
    }, 0);
}

// Отображает список пользователей
function renderUsers() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    let subtotal = 0;

    users.forEach(user => {
        const userSum = calculateUserSum(user.username);
        const userAmount = user.amount || 0; // Обеспечиваем, что `user.amount` не `undefined`
        const difference = userAmount - userSum;

        subtotal += userSum;

        const li = document.createElement('li');
        li.className = 'user-item';
        li.innerHTML = `
            <span class="name">${user.username} 
                <span class="user-sum">(You eat: $${userSum.toFixed(2)})</span>
                <span class="user-amount">(You spent already: $${userAmount.toFixed(2)})</span>
                <span class="user-difference">(You have to pay: $${difference.toFixed(2)*(-1)})</span>
            </span>
            <div>
                <button class="button-mod" onclick="modifyUser('${user.username}')">Modify</button>
                <button class="button-del" onclick="deleteUser('${user.username}')">Delete</button>
            </div>
        `;
        userList.appendChild(li);
    });

    const totalsDiv = document.getElementById('totals');
    const totalAmounts = users.reduce((sum, user) => sum + (user.amount || 0), 0); // Обеспечиваем, что `user.amount` не `undefined`

    totalsDiv.innerHTML = `
        <p class="bill">The Bill: $${subtotal.toFixed(2)}</p>
        <p class = "bank">Users Bank: $${totalAmounts.toFixed(2)}</p>
    `;
}

// Добавляет нового пользователя
function addUser(username, amount) {
    if (!users.some(u => u.username === username)) {
        users.push({ username, amount: parseFloat(amount) || 0 }); // Убедимся, что `amount` всегда число
        saveData();
        renderUsers();
    } else {
        alert('Username already exists!');
    }
}

// Модифицирует данные пользователя
function modifyUser(oldUsername) {
    const user = users.find(u => u.username === oldUsername);
    const newUsername = prompt('Enter new username:', oldUsername);
    const newAmount = parseFloat(prompt('Enter new amount:', user.amount)) || 0;

    if (newUsername && !isNaN(newAmount)) {
        if (!users.some(u => u.username === newUsername && u.username !== oldUsername)) {
            users = users.map(u => u.username === oldUsername
                ? { username: newUsername, amount: newAmount }
                : u
            );
            products.forEach(product => {
                if (product.users) {
                    const index = product.users.indexOf(oldUsername);
                    if (index !== -1) {
                        product.users[index] = newUsername;
                    }
                }
            });
            saveData();
            renderUsers();
        } else {
            alert('Username already exists!');
        }
    }
}

// Удаляет пользователя
function deleteUser(username) {
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
        users = users.filter(u => u.username !== username);
        products.forEach(product => {
            if (product.users) {
                product.users = product.users.filter(u => u !== username);
            }
        });
        saveData();
        renderUsers();
    }
}

// Добавляет обработчик события для формы
document.getElementById('add-user-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const usernameInput = document.getElementById('username');
    const amountInput = document.getElementById('user-amount');
    const username = usernameInput.value.trim();
    const amount = parseFloat(amountInput.value) || 0; // Убедимся, что `amount` всегда число

    if (username) {
        addUser(username, amount);
        usernameInput.value = '';
        amountInput.value = '';
    }
});

// Инициализирует начальный рендер
renderUsers();
