const $ = (selector) => document.querySelector(selector);
const $$ = (selectors) => document.querySelectorAll(selectors);

const filterContainer = $('.column-filter');
const showfilters = $('#showFilters');
const showFiltersButton = $('#showFilters');
const hideFiltersButton = $('#hideFilters');
const categoriesSection = $('#categories');
const reportesSection = $('#reports');
const balanceSection = $('#balance');
const categoriesContainer = $('.container-categorias');
const balanceContainer = $('.column-balance');
const reportesContainer = $('.container-reportes');
const operationContainer = $('.column-operation');
const newOperationButton = $('#newOperationBtn');
const newOperationContainer = $('.container-newOperation');
const editOperationContainer = $('.container-editOperation');
const editDescription = $("#editDescriptionOperation");
const editAmount = $("#editAmountOperation");
const editType = $("#editTypeOperation");
const editCategory = $("#editCategoryOperation");

// DOM FUNCTIONS
const hideElement = (element) => element.classList.add('is-hidden');
const showElement = (element) => element.classList.remove('is-hidden');
const clear = (element) => element.innerHTML = "";

hideFiltersButton.addEventListener('click', () => {
  hideElement(filterContainer);
  showElement(showfilters);
});

showFiltersButton.addEventListener('click', () => {
  hideElement(showfilters);
  showElement(filterContainer);
});

categoriesSection.addEventListener('click', () => {
  hideElement(balanceContainer);
  hideElement(operationContainer);
  hideElement(filterContainer);
  showElement(categoriesContainer);
});

reportesSection.addEventListener('click', () => {
  hideElement(balanceContainer);
  hideElement(operationContainer);
  hideElement(filterContainer);
  showElement(reportesContainer);
});

newOperationButton.addEventListener('click', () => {
  hideElement(filterContainer);
  hideElement(balanceContainer);
  hideElement(operationContainer);
  showElement(newOperationContainer);
});

editOperationContainer.addEventListener('click', () => {
  hideElement(filterContainer);
  hideElement(balanceContainer);
  hideElement(operationContainer);
  hideElement(newOperationContainer);
  hideElement(tableContainer)
  showElement(editOperationContainer);
});

// LOCAL STORAGE
const getDataFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key));
const sendDataFromLocalStorage = (key, array) => localStorage.setItem(key, JSON.stringify(array));
const removeDataFromLocalStorage = (key) => localStorage.removeItem(key);

// NEW OPERATION
let operationsDefault = [];

let operations = getDataFromLocalStorage("operations")
  ? getDataFromLocalStorage("operations") : operationsDefault;

if (!localStorage.getItem("operations")) {
  sendDataFromLocalStorage("operations", operations);
}

const generateID = () => {
  let length = 4;
  let characters = "0123456789";
  let idObtained = "";
  for (let i = 0, n = characters.length; i < length; ++i) {
    idObtained += characters.charAt(Math.floor(Math.random() * n));
  }
  return idObtained;
};

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
                <button class="button is-small is-warning btnEdit" data-id="${operation.ids}">
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
    clear(tableContainer);
    operations.push(operationContent());
    $("#description").value = "";
    localStorage.setItem("operations", JSON.stringify(operations));
    generateOperationTable(JSON.parse(localStorage.getItem("operations")));
  }
};

$('#createOperationBtn').addEventListener('click', generateNewOperation);

//DELETE
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
    const tableRow = btnDeleted("tr");
    if (tableRow) {
      tableRow.remove();
    }
  }
};

//CATEGORIESFUNCTIONS

const randomId = () => self.crypto.randomUUID();

let categoria = [{
  nombre: "comida",
  id: randomId(),
},
{
  nombre: "servicios",
  id: randomId(),
},
{
  nombre: "salidas",
  id: randomId(),
},
{
  nombre: "transporte",
  id: randomId(),
},
{
  nombre: "educación",
  id: randomId(),
},
{
  nombre: "trabajo",
  id: randomId(),
},
]

sendDataFromLocalStorage('categorias', categoria);

const listaCategorias = (categoria) => {
  console.log(categoria);
  $('#categorias').innerHTML = "";
  for (let { nombre, id } of categoria) {
    $('#categorias').innerHTML += `<li class="is-flex is-justify-content-space-between">
    <p>${nombre}</p>
    <div>
      <button onclick="showEditCategory('${id}')" id="${id}" class="is-primary edit-btn">Editar</button>
      <button onclick="removeCategory('${id}')" id="${id}" class="is-primary">Eliminar</button>
    </div>
    </li>`;
  }
};


listaCategorias(categoria)
console.log(categoria)

//const categoriesList = [];

//const addItem = () => {
//let newItem = $('#categoriesInput').value;
//categoriesList.push(newItem);
//createList(categoriesList)
//$('#categoriesForm').reset();
//}


//const createList = (lista) => {
//$('#list').innerHTML = "";
//lista.forEach((item) => {
//let liContent = document.createTextNode(`${item}`);
//let liItem = document.createElement('li');
//let deleteButton = document.createElement('button');
//let editButton = document.createElement('button')
//liItem.classList.add('has-text-info', 'tag', 'is-info', 'is-light', 'mt-4');
//editButton.classList.add('button', 'is-ghost', 'is-size-7', 'ml-6');
//editButton.innerText = "Editar";
//editButton.addEventListener('click', () => editItem(item));
//deleteButton.classList.add('button', 'is-ghost', 'is-size-7');
//deleteButton.innerText = "Eliminar";
//deleteButton.addEventListener('click', () => deleteItem(item))
//liItem.appendChild(liContent);
//liItem.appendChild(editButton);
//liItem.appendChild(deleteButton);
//$('#list').appendChild(liItem);
//})
//}

//const editItem = (item) => {
  //$('.container-editar-categoria').classList.remove('is-hidden');
  //$('.container-categorias').classList.add('is-hidden')
//}

//const modificarItem = (item) => {
//let newElement = $('#categoriesEditInput').value;
//let itemIndex = categoriesList.indexOf(item);
//categoriesList[itemIndex] = newElement
//createList(categoriesList)
//console.log(categoriesList)
//}


//const deleteItem = (item) => {
//const itemIndex = categoriesList.indexOf(item);
//categoriesList.splice(itemIndex, 1);
//createList(categoriesList);
//}


//$('#addButton').addEventListener('click', addItem)
//$('#modifyButton').addEventListener('click', modificarItem)
//$('#cancelarButton').addEventListener('click')

//EDIT
const getOperationById = (operationId) => {
  return operations.find((operation) => operation.ids === parseInt(operationId));
};

tableContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnEdit")) {
    e.stopPropagation();
    const operationId = e.target.getAttribute("data-id");
    const operationToEdit = getOperationById(operationId);
    fillEditForm(operationToEdit);
  }
});

const fillEditForm = (operation) => {
  editDescription.value = operation.descriptionOperation;
  editAmount.value = operation.amountOperation;
  editType.value = operation.operationType;
  editCategory.value = operation.selectCategoryOperation;
  showElement(editOperationContainer);
  hideElement(newOperationContainer)
  hideElement(tableContainer)
};

