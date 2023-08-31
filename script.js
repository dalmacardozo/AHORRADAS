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
const hideElement = (element) => element.classList.add('is-hidden');
const showElement = (element) => element.classList.remove('is-hidden');
const clear = (element) => element.innerHTML = "";

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

newOperationButton.addEventListener('click', () => {
    hideElement(filterContainer);
    hideElement(balanceContainer);
    hideElement(operationContainer);
    showElement(newOperationContainer);
})

//LOCAL STORAGE
const getDataFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key));
const sendDataFromLocalStorage = (key, array) => localStorage.setItem(key, JSON.stringify(array));
const removeDataFromLocalStorage = (key) => localStorage.removeItem(key);

// NEW OPERATION
let operationsDefault = [];

let operations = getDataFromLocalStorage("operations")
    ? getDataFromLocalStorage("operations") : operationsDefault;

if (!localStorage.getItem("operations")) {
    sendDataFromLocalStorage("operations", operations)
}

const generateID = () => {
    let length = 4
    let characters = "0123456789"
    let idObtained = ""
    for (let i = 0, n = characters.length; i < length; ++i) {
        idObtained += characters.charAt(Math.floor(Math.random() * n));
    }
    return idObtained
}

const operationContent = () => {
    const ids = parseInt(generateID());
    const descriptionOperation = $("#description").value;
    const amountOperation = parseInt($("#amountOperation").value);
    const operationType = $("#operationType").value;
    const selectCategoryOperation = $("#selectCategoryOperation").value;
    const dateOperation = $("#dateOperation").value;
    return {
        descriptionOperation,
        amountOperation,
        operationType,
        selectCategoryOperation,
        dateOperation,
        ids,
    };
};

const generateOperationTable = (operations) => {
    const tableContainer = $("#tableContainer");
    tableContainer.innerHTML = `
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Categoría</th>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Monto</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${operations.map((operation) => `
          <tr>
            <td>${operation.descriptionOperation}</td>
            <td>${operation.selectCategoryOperation}</td>
            <td class="${operation.operationType === 'gain' ? 'has-text-success' : 'has-text-danger'}">
              ${operation.operationType === 'spending' ? '-' : '+'}
            </td>
            <td class="${operation.operationType === 'gain' ? 'has-text-success' : 'has-text-danger'}">
              $${operation.amountOperation}
            </td>
            <td>
                <i class="fas fa-edit"></i>
              </button>
              <button class="button is-small is-danger btnDeleted" data-id="${operation.ids}">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

const generateNewOperation = () => {
    if ($("#description").value === "") {
        return alert("Debe ingresar un nombre para la operación");
    } else {
        clear(tableContainer);;
        operations.push(operationContent());
        $("#description").value = "";
        localStorage.setItem("operations", JSON.stringify(operations));
        generateOperationTable(JSON.parse(localStorage.getItem("operations")));
    };
}

$('#createOperationBtn').addEventListener('click', generateNewOperation)

const tableContainer = $("#tableContainer");
tableContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnDeleted")) {
        e.stopPropagation();
        const operationId = e.target.getAttribute("data-id");
        deleteOperation(operationId);
        deleteOperationFromTable(operationId);
    }
});

const deleteOperation = (operationId) => {
    clear(tableContainer);
    let operationsLocal = getDataFromLocalStorage("operations");
    let newOperations = operationsLocal.filter((operation) => {
        return operation.ids !== parseInt(operationId);
    });
    operations = newOperations;
    sendDataFromLocalStorage("operations", operations);
    generateOperationTable(operations);
};

const deleteOperationFromTable = (operationId) => {
    const btnDeleted = $(`.btnDeleted[data-id="${operationId}"]`);
    if (btnDeleted) {
        const tableRow = btnDeleted.closest("tr");
        if (tableRow) {
            tableRow.remove();
        }
    }
};

//CATEGORIESFUNCTIONS

const categoriesList = [];

const addItem = () => {
   let newItem = $('#categoriesInput').value;
   categoriesList.push(newItem);
   let liContent = document.createTextNode(`${newItem}`);
   let liItem = document.createElement('li');
   liItem.appendChild(liContent);
   $('#list').appendChild(liItem);
   console.log(categoriesList)
}

$('#addButton').addEventListener('click', addItem)

