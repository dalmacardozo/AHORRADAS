const $ = (selector) => document.querySelector(selector);
const $$ = (selectors) => document.querySelectorAll(selectors);
const randomId = () => self.crypto.randomUUID();

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
const editDateOperation = $("#editDateOperation")

// DOM FUNCTIONS
const hideElement = (element) => element.classList.add('is-hidden');
const showElement = (element) => element.classList.remove('is-hidden');
const clear = (element) => element.innerHTML = "";

hideFiltersButton.addEventListener('click', () => {
    hideElement(filterContainer);
    showElement(showfilters);
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

const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${formattedDay}-${formattedMonth}-${year}`;
};

const day = new Date();
const formattedDate = formatDate(day);
$("#dateOperation").value = formattedDate

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
            <td>${operation.dateOperation}</td>
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
    const editButtons = $$('.btnEdit');
    editButtons.forEach((editButton) => {
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const operationId = editButton.getAttribute('data-id');
            const operationToEdit = getOperationById(operationId);
            fillEditForm(operationToEdit);
        });
    });
};

const generateNewOperation = () => {
    if ($("#description").value === "") {
        return alert("Debe ingresar un nombre para la operación");
    } else {
        clear(tableContainer);
        operations.push(operationContent());
        $("#description").value = "";
        sendDataFromLocalStorage("operations", operations)
        generateOperationTable(operations);
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

//EDIT
const getOperationById = (operationId) => {
    return operations.find((operation) => operation.ids === parseInt(operationId));
};

const fillEditForm = (operation) => {
    editDescription.value = operation.descriptionOperation;
    editAmount.value = operation.amountOperation;
    editType.value = operation.operationType;
    editCategory.value = operation.selectCategoryOperation;
    editDateOperation.value = operation.dateOperation;
    editOperationContainer.setAttribute('data-id', operation.ids);

    showElement(editOperationContainer);
    hideElement(newOperationContainer);
    hideElement(tableContainer);
};

$('#updateOperationBtn').addEventListener('click', () => {
    const operationId = editOperationContainer.getAttribute('data-id');
    const updatedOperation = {
        descriptionOperation: editDescription.value,
        amountOperation: parseInt(editAmount.value),
        operationType: editType.value,
        selectCategoryOperation: editCategory.value,
        dateOperation: editDateOperation.value,
        ids: operationId,
    };
    const indexToUpdate = operations.findIndex((operation) => operation.ids === parseInt(operationId));
    if (indexToUpdate !== -1) {
        operations[indexToUpdate] = updatedOperation;
    }
    sendDataFromLocalStorage('operations', operations);
    generateOperationTable(operations);
    showElement(tableContainer);
    hideElement(editOperationContainer);
});


//CATEGORIESFUNCTIONS
localStorage.clear()
//Traer - Lo que ya está en el local

const traerCategorias = () => {
    return getDataFromLocalStorage('categories')
}

traerCategorias()

//Mi array de objetos

let categorias = traerCategorias() || [{
    nombre: "Comida",
    id: randomId(),
},
{
    nombre: "Servicios",
    id: randomId(),
},
{
    nombre: "Salidas",
    id: randomId(),
},
{
    nombre: "Transporte",
    id: randomId(),
},
{
    nombre: "Educación",
    id: randomId(),
},
{
    nombre: "Trabajo",
    id: randomId(),
},
]

// Lista de categorías

const listaCategorias = (categorias) => {
    $('#categorias').innerHTML = "";
    for (let { nombre, id } of categorias) {
        $('#categorias').innerHTML += `<li class="is-flex is-justify-content-space-between has-text-info is-info is-light mt-4">
    <p>${nombre}</p>
    <div>
      <button onclick="mostrarCategoria('${id}')" id="${id}" class="edit-btn button is-ghost is-size-7 ml-6">Editar</button>
      <button onclick="removerCategoria('${id}')" id="${id}" class="button is-ghost is-size-7">Eliminar</button>
    </div>
    </li>`;
    }
};

listaCategorias(categorias)

//LOCASSTORAGE
//Actualizar - Lo que subo

const actualizarCategorias = (datos) => {
    return sendDataFromLocalStorage('categories', datos)
}

actualizarCategorias(categorias)

//BOTON AGREGAR EN CATEGORIAS

const nuevaCategoria = () => {
    let categoriaAgregada = {
        nombre: $('#categoriesInput').value,
        id: randomId(),
    };
    categorias.push(categoriaAgregada);
    //let newArr = [...categorias, categoriaAgregada]
    actualizarCategorias(categorias)
    console.log(categorias)
    //console.log(newArr)
}


$('#addButton').addEventListener('click', () => nuevaCategoria(listaCategorias(categorias)))
$('#addButton').addEventListener('click', () => listaCategorias(categorias))


//BOTON ELIMINAR EN CATEGORÍAS

const removerCategoria = (id) => {
    const index = categorias.findIndex((categorias)  => categorias.id === id);
    let categoriaAEliminar = categorias.splice(index, 1);
    let categoriaActualizada = categorias.map((categoria) => 
    categoria.id === id ? { ...categoriaAEliminar } : categoria);
    console.log(categoriaActualizada)
    listaCategorias(categoriaActualizada);
    completarSelects(categoriaActualizada);
    actualizarCategorias(categoriaActualizada)
}

//BOTON EDITAR EN LISTA DE CATEGORIAS

 
const mostrarCategoria = (id) => {
    showElement($('.container-editar-categoria'));
    hideElement($('.container-categorias'));
    let categoriaAEditar = categorias.filter((categoria) => categoria.id === id);
    console.log(categoriaAEditar[0])
    $('#categoriesEditInput').value = categoriaAEditar[0].nombre;
    $('#modifyButton').addEventListener('click', () => editarCategoria(categoriaAEditar[0].id)); 
    $('#modifyButton').addEventListener('click', () => showElement($('.container-categorias')))
    $('#cancelarButton').addEventListener('click', () => showElement($('.container-categorias')))
}


const editarCategoria = (id) => {
    const nombre = $('#categoriesEditInput').value
    let nuevaCategoria = {
        id: id,
        nombre: nombre,
    };
    let categoriasActualizadas = categorias.map((categoria) => 
    categoria.id === id ? { ...nuevaCategoria } : categoria 
)
listaCategorias(categoriasActualizadas);
completarSelects(categoriasActualizadas);
actualizarCategorias(categoriasActualizadas)
};

//COMPLETARSELECTS

const completarSelects = (categories) => {
    $$('.completar-selects').forEach(select => {
        select.innerHTML = '';
        for (let { nombre, id } of categories) {
            select.innerHTML += `<option value="${id}">${nombre}</option>`
        }
    });

}

completarSelects(categorias)
$('#selectCategoryFilter').addEventListener('change', ()=> {$('#selectCategoryFilter').value})



