const totalBalance  = document.querySelector('.total__balance');
const totalMoney  = document.querySelector('.total__money');
const totalMoneyIncome  = document.querySelector('.total__money-income');
const totalMoneyExpenses  = document.querySelector('.total__money-expenses');
const historyList  = document.querySelector('.history__list');
const form  = document.querySelector('#form');
const operationName  = form.querySelector('.operation__name');
const operationAmount  = form.querySelector('.operation__amount');

// генерация id записи
const generateId = () => {
    return `Hello${Math.round(Math.random()*1e8).toString(16)}`
};

// извлечение списка операций из localStorage
let dbOperations = JSON.parse(localStorage.getItem('calc')) || [];

// отображение операции
const renederOperation = el => {
    const className = el.amount < 0 ? 'history__item-minus' : 'history__item-plus';
    const listItem = document.createElement('li');
    
    listItem.classList.add('history__item');
    listItem.classList.add(className);
    
    listItem.innerHTML = `${el.description}
    <span class="history__money rub">${el.amount}</span>
    <button class="history__delete" data-id="${el.id}">x</button>`;
    
    historyList.append(listItem);
 };

// обновление баланса
const updateBalance = () => {
    const resultIncome = dbOperations
    .filter(el => el.amount > 0)
    .reduce((accumulator, el) => accumulator + el.amount, 0)
    const resultExpenses = dbOperations
    .filter(el => el.amount < 0)
    .reduce((accumulator, el) => accumulator + el.amount, 0)
    
    totalMoneyIncome.textContent = resultIncome;
    totalMoneyExpenses.textContent = resultExpenses;
    totalBalance.textContent = resultIncome + resultExpenses;
};

// слушатель события "submit" на форму для добавления новых операций 
form.addEventListener('submit', (e) => {
    e.preventDefault();
    operationName.style.borderColor = '';
    operationAmount.style.borderColor = '';

    const operationNameValue = operationName.value;
    const operationAmountValue = operationAmount.value;

    if (operationNameValue && operationAmountValue) {
        const operation = {
            id: generateId(),
            description: operationNameValue,
            amount: +operationAmountValue
        };

        dbOperations.push(operation);
        init();
    } else {
        if (!operationNameValue) operationName.style.borderColor = 'red';
        if (!operationAmountValue) operationAmount.style.borderColor = 'red';
    }

    operationName.value = '';
    operationAmount.value = '';
});

// удаление операции
const deleteOperation = (e) => {
    const target = e.target;

    if (target.classList.contains('history__delete')) {
        dbOperations = dbOperations.filter(el => el.id != target.dataset.id);
        init();
    }
};

historyList.addEventListener('click', deleteOperation);

const init = () => {
    historyList.textContent = '';
    dbOperations.forEach(renederOperation);
    updateBalance();
    localStorage.setItem('calc', JSON.stringify(dbOperations));
};

init();