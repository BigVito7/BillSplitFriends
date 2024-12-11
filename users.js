// Инициализация данных из LocalStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [];
let currentLanguage = localStorage.getItem('currentLanguage') || 'en'; // Язык по умолчанию - английский

// Объект переводов для разных языков
const translations = {
    en: {
        title: 'User Management',
        additem: 'Add user',
        userpager: 'Product',
        eat: "Consumption:",
        spent: "Add to bank:",
        diff: "To be paid:",
        placeholders: {
            usersName: 'Username',
            usersPrice: 'Spent',
        },
        currency: '$',
        currency1: '$',
        totalCost: 'Total usage:',
        bigbill: 'The Bill:',
        bigbank: 'Users Bank:',
        dont: 'You still don\'t have enough money to pay the bill: ',
        have: 'In bank you have sufficient money to pay the bill: ',
    },
    md: {
        title: 'Lista persoanelor',
        additem: 'Adauga persoana',
        userpager: 'Persoane',
        eat: "Consumat:",
        spent: "Cheltuit:",
        diff: "De platit:",
        placeholders: {
            usersName: 'Numele',
            usersPrice: 'Cheltuit',
        },
        currency: 'LEI',
        currency1: 'LEI',
        totalCost: 'Cost total:',
        bigbill: 'Nota de plata:',
        bigbank: 'Banca utilizatorilor:',
        dont: 'Încă nu aveți suficienți bani pentru a plăti factura: ',
        have: 'În bancă aveți suficienți bani pentru a plăti factura: ',
    },
    ru: {
        title: 'Список пользователей',
        additem: 'Добавить пользователя',
        userpager: 'Продукты',
        eat: "Употребил:",
        spent: "Потратил:",
        diff: "К оплате:",
        placeholders: {
            usersName: 'Имя пользователя',
            usersPrice: 'Затраты',
        },
        currency: 'RUB',
        currency1: 'RUB',
        totalCost: 'Общая стоимость:',
        bigbill: 'Счет на оплату',
        bigbank: 'Банк пользователей:',
        dont: 'У вас все еще недостаточно денег, чтобы оплатить счет: ',
        have: 'В банке у вас достаточно денег, чтобы оплатить счет: ',
    },
    de: {
        title: 'Benutzerliste',
        additem: 'Benutzer hinzufügen',
        userpager: 'Produkte',
        eat: "Verbrauch:",
        spent: "Gegeben:",
        diff: "Bezahlung:",
        placeholders: {
            usersName: 'Benutzername',
            usersPrice: 'Kosten',
        },
        currency: '€',
        currency1: '€',
        totalCost: 'Gesamtkosten:',
        bigbill: 'Die Rechnung:',
        bigbank: 'Benutzerbank:',
        dont: 'Ihr Geld reicht noch immer nicht, um die Rechnung zu bezahlen: ',
        have: 'Auf der Bank haben Sie genügend Geld, um die Rechnung zu bezahlen: ',
    },
};

// Сохраняет данные пользователей и продуктов в LocalStorage
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('products', JSON.stringify(products));
}

// Рассчитывает долю пользователя за продукты
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
    userList.innerHTML = ''; // Очистить таблицу перед добавлением новых данных

    let subtotal = 0;

    users.forEach(user => {
        const userSum = calculateUserSum(user.username);
        const userAmount = user.amount || 0; // Убедимся, что значение не undefined
        const difference = userAmount - userSum;

        subtotal += userSum;

        // Создаем строку таблицы
        const row = document.createElement('tr');

        // Добавляем ячейки с данными
        row.innerHTML = `
            <td class="usernamefont">${user.username}</td>
            <td class="eat1">
                <span id="eat">${translations[currentLanguage].eat}</span>
                <span class="user-sum">${userSum.toFixed(2)}</span>
                <span class="money0">${translations[currentLanguage].currency}</span>
            </td>
            <td class="spent2">
                <span id="spent">${translations[currentLanguage].spent}</span>
                <span class="user-amount">${userAmount.toFixed(2)}</span>
                <span class="money1">${translations[currentLanguage].currency}</span>
            </td>
            <td class="diff2">
                <span id="diff">${translations[currentLanguage].diff}</span>
                <span class="user-difference" style="color: ${difference < 0 ? 'red' : 'green'};">
                    ${(difference * -1).toFixed(2)}
                </span>
                <span class="money2">${translations[currentLanguage].currency}</span>
            </td>
            <td class="actions">
                <button class="button-mod" onclick="modifyUser('${user.username}')">Modify</button>
                <button class="button-del" onclick="deleteUser('${user.username}')">Delete</button>
            </td>
        `;

        // Добавляем строку в таблицу
        userList.appendChild(row);
    });

    const totalsDiv = document.getElementById('totals');
    const totalAmounts = users.reduce((sum, user) => sum + (user.amount || 0), 0);
    let difference = subtotal - totalAmounts;

    // Обновляем отображение итогов
    totalsDiv.innerHTML = `
        <p class="bill" id="bigbill">${translations[currentLanguage].bigbill} ${subtotal.toFixed(2)} ${translations[currentLanguage].currency1}</p>
        <p class="bank" id="bigbank">${translations[currentLanguage].bigbank} ${totalAmounts.toFixed(2)} ${translations[currentLanguage].currency1}</p>
        <p class="difference" style="color: ${difference > 0 ? 'red' : 'green'};">
            <span id="${difference > 0 ? 'dont' : 'have'}">
                ${difference > 0 ? translations[currentLanguage].dont : translations[currentLanguage].have} 
            </span>
            ${(difference * -1).toFixed(2)} ${translations[currentLanguage].currency1} 
        </p>
    `;
}





// Добавляет нового пользователя
function addUser(username, amount) {
    if (!username || isNaN(amount)) {
        alert('Invalid username or amount.');
        return;
    }
    if (!users.some(u => u.username === username)) {
        users.push({ username, amount: parseFloat(amount) || 0 });
        saveData();
        renderUsers();
    } else {
        alert('Username already exists!');
    }
}

console.log('Users:', users);

// Модифицирует данные существующего пользователя
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

// Сохраняет текущий язык в LocalStorage
function saveLanguage(lang) {
    localStorage.setItem('currentLanguage', lang);
}

// Применяет текущий язык ко всем элементам интерфейса
function applyLanguage() {
    const translation = translations[currentLanguage];
    document.getElementById('title').textContent = translation.title;
    document.getElementById('additem').textContent = translation.additem;
    document.getElementById('userpager').textContent = translation.userpager;

    // Обновляем текст для итогов, если они существуют
    const bigBillElement = document.getElementById('bigbill');
    const bigBankElement = document.getElementById('bigbank');
    const dontElement = document.getElementById('dont');
    const haveElement = document.getElementById('have');

    if (bigBillElement) bigBillElement.textContent = `${translation.bigbill} ${bigBillElement.textContent.split(':')[1]}`;
    if (bigBankElement) bigBankElement.textContent = `${translation.bigbank} ${bigBankElement.textContent.split(':')[1]}`;
    if (dontElement) dontElement.textContent = translation.dont;
    if (haveElement) haveElement.textContent = translation.have;

    updateUserLanguage(); // Обновляет текст строк пользователей
    renderUsers(); // Перерисовывает интерфейс
}

// Обновляет текст для всех пользователей в соответствии с текущим языком
function updateUserLanguage() {
    const userItems = document.querySelectorAll('.user-item');

    userItems.forEach(item => {
        const eat = item.querySelector('#eat');
        const spent = item.querySelector('#spent');
        const diff = item.querySelector('#diff');

        if (eat) eat.textContent = translations[currentLanguage].eat;
        if (spent) spent.textContent = translations[currentLanguage].spent;
        if (diff) diff.textContent = translations[currentLanguage].diff;
    });
}

// Добавляет обработчик смены языка
document.addEventListener('DOMContentLoaded', function () {
    const flagButtons = document.querySelectorAll('.flag-button');
    flagButtons.forEach(button => {
        button.addEventListener('click', function () {
            currentLanguage = button.getAttribute('data-language');
            saveLanguage(currentLanguage);
            applyLanguage();
        });
    });

    applyLanguage(); // Применяет язык при загрузке
});

document.getElementById('add-user-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы

    const usernameInput = document.getElementById('users-name'); // Поле для имени пользователя
    const amountInput = document.getElementById('users-price'); // Поле для суммы

    const username = usernameInput.value.trim(); // Извлекаем имя пользователя
    const amount = parseFloat(amountInput.value); // Извлекаем сумму и преобразуем в число

    if (username && !isNaN(amount)) {
        addUser(username, amount); // Вызываем функцию добавления пользователя
        usernameInput.value = ''; // Очищаем поле имени пользователя
        amountInput.value = '';   // Очищаем поле суммы
    } else {
        alert('Please enter a valid username and amount!'); // Сообщение об ошибке
    }
});