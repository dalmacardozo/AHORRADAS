const $ = (selector) => document.querySelector(selector);
const $$ = (selectors) => document.querySelectorAll(selectors);

const filterContainer = $('.column-filter');
const showfilters = $('#showFilters');
const showFiltersButton = $('#showFilters')
const hideFiltersButton = $('#hideFilters');
const categoriesSection = $('#categories')
const reportesSection = $('#reports')
const balanceSection = $('#balance')
const categoriesContainer = $('.container-categorias')
const balanceContainer = $('.column-balance');
const reportesContainer = $('.container-reportes');
const operationContainer = $('.column-operation');
const newOperationButton = $('#newOperationBtn');
const newOperationContainer = $('.container-newOperation')

// DOM FUNCTIONS
const hideElement = (element) => {
    element.classList.add('is-hidden');
}

const showElement = (element) => {
    element.classList.remove('is-hidden');
}

hideFiltersButton.addEventListener('click', () => {
    hideElement(filterContainer);
    showElement(showfilters);
})

showFiltersButton.addEventListener('click', () => {
    hideElement(showfilters);
    showElement(filterContainer);
})

categoriesSection.addEventListener('click', () => {
    hideElement(balanceContainer);
    hideElement(operationContainer);
    hideElement(filterContainer);
    showElement(categoriesContainer);
})

reportesSection.addEventListener('click', () => {
    hideElement(balanceContainer);
    hideElement(operationContainer);
    hideElement(filterContainer);
    showElement(reportesContainer);
})

newOperationButton.addEventListener('click', () =>{
    hideElement(filterContainer);
    hideElement(balanceContainer);
    hideElement(operationContainer);
    showElement(newOperationContainer);
})

//LOCAL STORAGE
const getDataFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
};
const sendDataFromLocalStorage = (key, array) => {
    return localStorage.setItem(key, JSON.stringify(array));
};
const removeDataFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};