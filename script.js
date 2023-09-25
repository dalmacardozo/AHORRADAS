const $ = (selector) => document.querySelector(selector);
const $$ = (selectors) => document.querySelectorAll(selectors);
const randomId = () => self.crypto.randomUUID();

const filterContainer = $('.column-filter');
const showfilters = $('#showFilters');
const showFiltersButton = $('#showFilters');
const hideFiltersButton = $('#hideFilters');
const categoriesSection = $('#categories');
const reportesSection = $('#reportsContainer');
const reportsContainerTable = $('#reportsContainerTable');
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
const reportesButton = $('#reportesButton');
const homeButton = $('#home');
const tableContainer = $(".column-operation");
// DOM FUNCTIONS
const hideElement = (element) => element.classList.add('is-hidden');
const showElement = (element) => element.classList.remove('is-hidden');
const clear = (element) => element.innerHTML = "";

 
const showHomeElements = () => {
    showElement(operationContainer);
    showElement(balanceContainer);
    hideElement(showFiltersButton);
    hideElement(reportesSection);
    hideElement(reportsContainerTable)
    showElement(hideFiltersButton);
    showElement(filterContainer);
}

const hideHomeElements = () => {
    hideElement(operationContainer);
    hideElement(balanceContainer);
    showElement(showFiltersButton);
    hideElement(hideFiltersButton);
    hideElement(filterContainer);
}

homeButton.addEventListener('click', () => {
    showHomeElements();
});

window.addEventListener('load', () => {
    completarSelects(categorias)
    const currentURL = window.location.href;
    if (currentURL.endsWith('index.html')) { 
        showHomeElements(); 
    } else {
        hideHomeElements(); 
    }
});

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
    hideElement(reportsContainerTable);
    showElement(categoriesContainer);
    showElement($('.box-categorias'));
    hideElement($('.contenedor-operaciones-agregar'))
});
reportesSection.addEventListener('click', () => {
    hideElement(balanceContainer);
    hideElement(operationContainer);
    hideElement(filterContainer);
    hideElement(newOperationContainer);
    hideElement($('.contenedor-operaciones-agregar'))
    generateReports(operations)
});
reportesButton.addEventListener('click', () => {
    hideElement(filterContainer);
    hideElement(balanceContainer);
    hideElement(operationContainer);
    hideElement(newOperationContainer);
    hideElement($('.box-categorias'));
    hideElement($('.container-categorias'))
    generateReports(operations)
});
newOperationButton.addEventListener('click', () => {
    hideElement(filterContainer);
    hideElement(balanceContainer);
    hideElement(operationContainer);
    hideElement(reportesContainer);
    hideElement(reportsContainerTable);
    showElement(newOperationContainer);
});
const showBalanceAndFilters = () => {
    showElement(balanceContainer);
    showElement(filterContainer);
    hideElement(tableContainer);
};

const showOperationTable = () => {
    hideElement(balanceContainer);
    hideElement(filterContainer);
    showElement(tableContainer);
};

editOperationContainer.addEventListener('click', () => {
    hideElement(filterContainer);
    hideElement(balanceContainer);
    hideElement(operationContainer);
    hideElement(newOperationContainer);
    hideElement(tableContainer)
    showElement(editOperationContainer);
});
const updateBalanceDOM = ({ totalGain, totalSpending, totalBalance }) => {
    const gainElement = $('.has-text-success');
    const spendingElement = $('.has-text-danger');
    const totalElement = $('.is-size-4');
    gainElement.textContent = `+${totalGain}`;
    spendingElement.textContent = `-${totalSpending}`;
    totalElement.textContent = `$${totalBalance}`;
};

const initializeBalance = (operations) => {
    const balanceContainer = $('.column-balance');
    updateBalanceDOM(calculateTotalBalance(operations));
}; 

let day = new Date();
$("#dateOperation").value =
    day.getFullYear() +
    "-" +
    ("0" + (day.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + day.getDate()).slice(-2);

const formatDate = (day) => {
    const newDate = day.split("-").reverse();
    return newDate.join("-");
};

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
    const tableContainer = $(".column-operation");
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
            <td>${getCategoryNameById(operation.selectCategoryOperation)}</td>
            <td>${formatDate(operation.dateOperation)}</td>
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
    </div>
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
const getCategoryNameById = (categoryId) => {
    const category = categorias.find(cat => cat.id === categoryId);
    return category ? category.nombre : '';
};

const generateNewOperation = () => {
    if ($("#description").value === "") {
        return alert("Debe ingresar un nombre para la operación");
    } else {
        clear(tableContainer);
        operations.push(operationContent());
        $("#description").value = "";
        sendDataFromLocalStorage("operations", operations);
        showBalanceAndFilters();
        generateOperationTable(operations);
    }
};
showOperationTable();

$('#createOperationBtn').addEventListener('click', generateNewOperation);

//DELETE

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
    actualizarCategorias(categorias);
    completarSelects(categorias);
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

// BALANCE

const calculateTotalBalance = (operations) => {
    let totalGain = 0;
    let totalSpending = 0;

    operations.forEach((operation) => {
        if (operation.operationType === 'gain') {
            totalGain += operation.amountOperation;
        } else {
            totalSpending += operation.amountOperation;
        }
    });
    const totalBalance = totalGain - totalSpending;
    return { totalGain, totalSpending, totalBalance };
};
initializeBalance(operations);

// REPORTES
const reportsContainer = $('.reportsContainer');

const generateReports = (operations) => {
    if (operations.length < 2) {
        showInsufficientOperationsMessage();
    } else {
        const reportData = generateReportData(operations);
        generateReportsTable(reportData);
        showElement(reportsContainerTable)
    }
};

const showInsufficientOperationsMessage = () => {
    showElement(reportesContainer)
};

const generateReportData = (operations) => {
    const categoryWithHighestGain = getCategoryWithHighestGain(operations);
    const categoryWithHighestSpending = getCategoryWithHighestSpending(operations);
    const categoryWithHighestBalance = getCategoryWithHighestBalance(operations);
    const monthWithHighestGain = getMonthWithHighestGain(operations);
    const monthWithHighestSpending = getMonthWithHighestSpending(operations);
    const totalByCategory = calculateTotalByCategory(operations);
    const totalByMonth = calculateTotalByMonth(operations);

    return {
        categoryWithHighestGain,
        categoryWithHighestSpending,
        categoryWithHighestBalance,
        monthWithHighestGain,
        monthWithHighestSpending,
        totalByCategory,
        totalByMonth,
    };
};

const generateReportsTable = ({
    categoryWithHighestGain,
    categoryWithHighestSpending,
    categoryWithHighestBalance,
    monthWithHighestGain,
    monthWithHighestSpending,
    totalByCategory,
    totalByMonth,
}) => {
    $('#reportsContainerTable').innerHTML = `
        <h2 class="title is-4">Resumen de Informes</h2>
        <table class="table is-bordered is-fullwidth">
            <tbody>
                <tr>
                    <td>Categoría con mayor ganancia:</td>
                    <td>${categoryWithHighestGain}</td>
                </tr>
                <tr>
                    <td>Categoría con mayor gasto:</td>
                    <td>${categoryWithHighestSpending}</td>
                </tr>
                <tr>
                    <td>Categoría con mayor balance:</td>
                    <td>${categoryWithHighestBalance}</td>
                </tr>
                <tr>
                    <td>Mes con mayor ganancia:</td>
                    <td>${monthWithHighestGain}</td>
                </tr>
                <tr>
                    <td>Mes con mayor gasto:</td>
                    <td>${monthWithHighestSpending}</td>
                </tr>
            </tbody>
        </table>   
        <h3 class="title is-5">Totales por Categoría:</h3>
        <table class="table is-bordered is-fullwidth">
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${Object.keys(totalByCategory).map(category => `
                    <tr>
                        <td>${category}</td>
                        <td>$${totalByCategory[category]}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>    
        <h3 class="title is-5">Totales por Mes:</h3>
        <table class="table is-bordered is-fullwidth">
            <thead>
                <tr>
                    <th>Mes</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${Object.keys(totalByMonth).map(month => `
                    <tr>
                        <td>${month}</td>
                        <td>$${totalByMonth[month]}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
};
const getCategoryWithHighestGain = (operations) => {
    const gainByCategory = operations.reduce((result, operation) => {
        if (operation.operationType === 'gain') {
            const category = operation.selectCategoryOperation;
            result[category] = (result[category] || 0) + operation.amountOperation;
        }
        return result;
    }, {});

    const highestGainCategory = Object.keys(gainByCategory).reduce((prevCategory, currentCategory) => {
        return gainByCategory[currentCategory] > gainByCategory[prevCategory] ? currentCategory : prevCategory;
    }, Object.keys(gainByCategory)[0]);

    return highestGainCategory;
};

const getCategoryWithHighestSpending = (operations) => {
    const spendingByCategory = operations.reduce((result, operation) => {
        if (operation.operationType === 'spending') {
            const category = operation.selectCategoryOperation;
            result[category] = (result[category] || 0) + operation.amountOperation;
        }
        return result;
    }, {});

    const highestSpendingCategory = Object.keys(spendingByCategory).reduce((prevCategory, currentCategory) => {
        return spendingByCategory[currentCategory] > spendingByCategory[prevCategory] ? currentCategory : prevCategory;
    }, Object.keys(spendingByCategory)[0]);

    return highestSpendingCategory;
};

const getCategoryWithHighestBalance = (operations) => {
    const { totalGain, totalSpending } = calculateTotalBalance(operations);
    return totalGain > totalSpending ? 'Ganancias' : 'Gastos';
};

const getMonthWithHighestGain = (operations) => {
    const gainByMonth = operations.reduce((result, operation) => {
        if (operation.operationType === 'gain') {
            const monthYear = operation.dateOperation.slice(0, 7);
            result[monthYear] = (result[monthYear] || 0) + operation.amountOperation;
        }
        return result;
    }, {});

    const highestGainMonth = Object.keys(gainByMonth).reduce((prevMonth, currentMonth) => {
        return gainByMonth[currentMonth] > gainByMonth[prevMonth] ? currentMonth : prevMonth;
    }, Object.keys(gainByMonth)[0]);

    return highestGainMonth;
};

const getMonthWithHighestSpending = (operations) => {
    const spendingByMonth = operations.reduce((result, operation) => {
        if (operation.operationType === 'spending') {
            const monthYear = operation.dateOperation.slice(0, 7);
            result[monthYear] = (result[monthYear] || 0) + operation.amountOperation;
        }
        return result;
    }, {});

    const highestSpendingMonth = Object.keys(spendingByMonth).reduce((prevMonth, currentMonth) => {
        return spendingByMonth[currentMonth] > spendingByMonth[prevMonth] ? currentMonth : prevMonth;
    }, Object.keys(spendingByMonth)[0]);

    return highestSpendingMonth;
};

const calculateTotalByCategory = (operations) => {
    const totalsByCategory = operations.reduce((result, operation) => {
        const category = operation.selectCategoryOperation;
        if (!result[category]) {
            result[category] = 0;
        }
        if (operation.operationType === 'gain') {
            result[category] += operation.amountOperation;
        } else {
            result[category] -= operation.amountOperation;
        }
        return result;
    }, {});

    return totalsByCategory;
};

const calculateTotalByMonth = (operations) => {
    const totalsByMonth = operations.reduce((result, operation) => {
        const monthYear = operation.dateOperation.slice(0, 7);
        if (!result[monthYear]) {
            result[monthYear] = 0;
        }
        if (operation.operationType === 'gain') {
            result[monthYear] += operation.amountOperation;
        } else {
            result[monthYear] -= operation.amountOperation;
        }
        return result;
    }, {});

    return totalsByMonth;
};
generateReports(operations);


//FILTROS
const operacionesAgregar = () => {
    hideElement($('.contenedor-operaciones-agregar'));
}

$('#newOperationBtn').addEventListener('click', ()=> operacionesAgregar())

const mostrarOperaciones = () => {
    hideElement($('.container-newOperation'));
    showElement($('.column-operation'));
    showElement($('.column-filter'));
    showElement($('.column-balance'));
    showElement($('.contenedor-operaciones-agregar'))

}

$('#createOperationBtn').addEventListener('click', ()=> mostrarOperaciones())

//FILTRAR POR TIPO

const filtrarPorTipo = (operations, operationType) => {
    return operations.filter((operation) => operation.operationType === operationType
    );
  };

 const aplicarFiltroTipo = () => {
    let operacionesFiltradas = [...operations];
    let filtroTipo = $("#filterType").value;
    operacionesFiltradas = filtrarPorTipo(operations, filtroTipo);
    generateOperationTable(operacionesFiltradas);
}

$('#filterType').addEventListener('change', ()=> aplicarFiltroTipo())

//FILTRAR POR CATEGORIA

const filtrarPorCategoria = (operations, selectCategoryOperation,) => {
    return operations.filter((operation) => operation.selectCategoryOperation === selectCategoryOperation);
 };

 const aplicarFiltroCategoria = () => {
    let operacionesFiltradas = [...operations];
    let filtroCategoria = $('#selectCategoryFilter').value;
    operacionesFiltradas = filtrarPorCategoria(operations, filtroCategoria);
    generateOperationTable(operacionesFiltradas)
 }

 $('#selectCategoryFilter').addEventListener('change', () => aplicarFiltroCategoria())

 //FILTRAR POR FECHA

const filtrarPorFecha = (operations, dateOperation) => {
    return operations.filter((operation) => operation.dateOperation === dateOperation)
      };

const aplicarFiltroFecha = () => {
    let operacionesFiltradas = [...operations];
    let filtroFecha = $('#input-fecha').value;
    operacionesFiltradas = filtrarPorFecha(operations, filtroFecha);
    generateOperationTable(operacionesFiltradas);
    };

$('#input-fecha').addEventListener('change', ()=> aplicarFiltroFecha())
    
//