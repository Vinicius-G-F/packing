// Função para salvar no LocalStorage
function saveData(data) {
    localStorage.setItem("meuBanco", JSON.stringify(data, null, 2));
}

function addMachine(e) {
    e.preventDefault()
    const name = document.getElementById("name").value
    if (dataBank[getCategoryTypeOnURL()].find(machine => machine.nome == name) != null) {
        alert("Maquina duplicada, use outro nome!")
        return
    }
    const fieldsQtd = document.querySelectorAll(".adding-fields").length
    const materials = []
    let countFields = 0
    for (i = 1; i <= fieldsQtd; i++) {
        let materialName = document.getElementById(`material${i + countFields}`)
        let materialPartNamber = document.getElementById(`part-number${i + countFields}`)
        while (materialName == null) {
            countFields++
            materialName = document.getElementById(`material${i + countFields}`)
        }
        materialPartNamber = document.getElementById(`part-number${i + countFields}`)
        materials.push({ nome: materialName.value, "part number": materialPartNamber.value })
    }

    const machine = {
        nome: name,
        materiais: materials
    }

    dataBank[getCategoryTypeOnURL()].push(machine);
    saveData(dataBank);
    render(dataBank);


    closeModalAdd()
    closeModalEdit()
    resetForm()
}


// UPDATE -> editar um material
function updateItem(e) {
    e.preventDefault()
    const name = document.getElementById("name-edit").value
    const fieldsQtd = document.querySelectorAll(".adding-fields").length
    const materials = []
    let countFields = 0
    for (i = 1; i <= fieldsQtd; i++) {
        let materialName = document.getElementById(`material${i + countFields}`)
        let materialPartNamber = document.getElementById(`part-number${i + countFields}`)
        while (materialName == null) {
            countFields++
            materialName = document.getElementById(`material${i + countFields}`)
        }
        materialPartNamber = document.getElementById(`part-number${i + countFields}`)
        materials.push({ nome: materialName.value, "part number": materialPartNamber.value })
    }

    const machine = {
        nome: name,
        materiais: materials
    }

    let hasDuplicateItem = false
    machine.materiais.forEach((material1, i1) => {
        machine.materiais.forEach((material2, i2) => {
            if (material1.nome == material2.nome && i1 != i2) {
                hasDuplicateItem = true
                return
            }
        })
    })
    if (hasDuplicateItem) {
        alert("Materiais com o mesmo nome encontrados!")
        return
    }
    const { category, index } = getIndexAndCategoryTypeOnURL()
    if (dataBank[category] && dataBank[category][index]) {
        dataBank[category][index] = machine;
        saveData(dataBank);
        render(dataBank);
    }

    closeModalEdit()
}

// mudar os cards de posição
function shiftCards(index, category, direction){
    if(dataBank[category].length <= 1){
        return
    }
    let sideCard = null
    direction = parseInt(direction)
    index = parseInt(index)
    if(index == 0 && direction == -1){
        sideCard = dataBank[category][dataBank[category].length + direction]
        dataBank[category][dataBank[category].length + direction] = dataBank[category][index]
        dataBank[category][index] = sideCard
    } else if(index >= (dataBank[category].length - 1) && direction == +1){
        sideCard = dataBank[category][0]
        dataBank[category][0] = dataBank[category][index]
        dataBank[category][index] = sideCard
    } else {
        sideCard = dataBank[category][index + direction]
        dataBank[category][index + direction] = dataBank[category][index]
        dataBank[category][index] = sideCard
    }
    saveData(dataBank);
    render(dataBank);
}


// DELETE -> remover item de uma categoria
function deleteItem() {
    const { category, index } = getIndexAndCategoryTypeOnURL()
    if (dataBank[category]) {
        dataBank[category].splice(index, 1);
        saveData(dataBank);
        render(dataBank);
    }
    closeModalDelete()
}

// modais
function showModalDelete() {
    document.getElementById('modal-delete').showModal()
    document.querySelector('body').style.opacity = 0.1
}

function closeModalDelete() {
    document.getElementById('modal-delete').close()
    document.querySelector('body').style.opacity = 1
}

function setModalColor(color) {
    if (color == 'green') {
        document.documentElement.style.setProperty('--border-modal-color', 'rgb(43, 226, 76)');
        document.documentElement.style.setProperty('--background-modal', 'rgb(0, 57, 11)');
        document.documentElement.style.setProperty('--color-modal', 'rgb(0, 57, 11)');
    } else if (color == 'blue') {
        document.documentElement.style.setProperty('--border-modal-color', 'rgb(74, 79, 238)');
        document.documentElement.style.setProperty('--background-modal', 'rgb(0, 12, 57)');
        document.documentElement.style.setProperty('--color-modal', 'rgb(0, 12, 57)');
    } else if (color == 'red') {
        document.documentElement.style.setProperty('--border-modal-color', 'rgb(204, 69, 69)');
        document.documentElement.style.setProperty('--background-modal', 'rgb(38, 5, 5)');
        document.documentElement.style.setProperty('--color-modal', 'rgb(38, 5, 5)');
    }
}

function showModalEdit(color) {
    setModalColor(color)
    document.getElementById('modal-edit').showModal()
    document.querySelector('body').style.opacity = 0.1

    const { category, index } = getIndexAndCategoryTypeOnURL()
    const item = dataBank[category][index]
    const nameEdit = document.getElementById("name-edit")
    nameEdit.value = item.nome
    item.materiais.forEach(() => {
        materialsADDEdit()
    })
    item.materiais.forEach((material, i) => {
        const materialField = document.getElementById(`material${i + 1}`)
        const partNumberField = document.getElementById(`part-number${i + 1}`)
        materialField.value = material.nome
        partNumberField.value = material["part number"]
    })
}

function closeModalEdit() {
    document.getElementById('modal-edit').close()
    document.querySelector('body').style.opacity = 1
    resetForm()
}

function showModalAdd(color) {
    setModalColor(color)
    document.getElementById('modal-add').showModal()
    document.querySelector('body').style.opacity = 0.1
}

function closeModalAdd() {
    document.getElementById('modal-add').close()
    document.querySelector('body').style.opacity = 1
    resetForm()
}


// Função para carregar dados do LocalStorage
function loadData() {
    const data = localStorage.getItem("meuBanco");
    if (data) {
        return JSON.parse(data)
    }
    else {
        const initialData = {
            "notebooks-desktops": [
            ],
            "servidores": [
            ],
            "pré-kitting": [
            ]
        }
        saveData(initialData)
        const dataSaved = localStorage.getItem("meuBanco");
        return JSON.parse(dataSaved)
    }
}

// templates html
function cardHTML(name, materials, color, index, category) {
    let materialsHTML = ''
    materials.forEach(material => {
        materialsHTML += `<span>${material.nome}: ${material['part number']}</span>`
    })

    const indexOriginal = dataBank[category].findIndex(item=>item.nome==name)

    return `<div class="card card--${color}">
        <h3>${name}</h3>
        <div class="card-info">
          ${materialsHTML}
        </div>
        <div class="card-buttons">
          <button class="card-button card-button--edit" onclick="sendMachineIndexAndCategory('${indexOriginal}', '${category}'); showModalEdit('${color}');"></button>
          <button class="card-button card-button--delete" onclick="showModalDelete(); sendMachineIndexAndCategory('${indexOriginal}', '${category}');"></button>
        </div>
        <button type="button" class="chevrons-left" onclick="shiftCards('${indexOriginal}', '${category}', '-1')"></button>
        <button type="button" class="chevrons-right" onclick="shiftCards('${indexOriginal}', '${category}', '+1')"></button>
      </div>`
}

function materialsField() {
    countingAddField++;

    // cria o container
    const div = document.createElement("div");
    div.className = "adding-fields";

    // label material
    const labelMaterial = document.createElement("label");
    labelMaterial.setAttribute("for", "material" + countingAddField);
    labelMaterial.textContent = "Nome do material:";
    div.appendChild(labelMaterial);

    // input material
    const inputMaterial = document.createElement("input");
    inputMaterial.type = "text";
    inputMaterial.id = "material" + countingAddField;
    inputMaterial.className = "form-input";
    inputMaterial.required = true;
    div.appendChild(inputMaterial);

    // span +
    const spanPlus = document.createElement("span");
    spanPlus.className = "plus-form";
    spanPlus.textContent = "+";
    div.appendChild(spanPlus);

    // label part-number
    const labelPart = document.createElement("label");
    labelPart.setAttribute("for", "part-number" + countingAddField);
    labelPart.textContent = "Part number:";
    div.appendChild(labelPart);

    // input part-number
    const inputPart = document.createElement("input");
    inputPart.type = "text";
    inputPart.id = "part-number" + countingAddField;
    inputPart.className = "form-input";
    inputPart.required = true;
    div.appendChild(inputPart);

    // botão delete
    const btnDelete = document.createElement("button");
    btnDelete.className = "delete-add-field";
    btnDelete.type = "button";
    btnDelete.onclick = function () {
        deleteFather(btnDelete);
    };
    div.appendChild(btnDelete);

    return div;
}

//adiciona cards de notebooks e desks no DOM
function addNoteDeskCards(cards) {
    const cardsNoteDesk = document.getElementById("cards-notebooks-desks")
    let cardsHTML = ''
    cards.forEach((card, i) => {
        cardsHTML += cardHTML(card.nome, card.materiais, 'green', i, "notebooks-desktops")
    })
    cardsNoteDesk.innerHTML = cardsHTML
}

// manipulando o DOM
//adiciona cards de servidores no DOM
function addServerCards(cards) {
    const cardsServer = document.getElementById("cards-servidores")
    let cardsHTML = ''
    cards.forEach((card, i) => {
        cardsHTML += cardHTML(card.nome, card.materiais, 'blue', i, "servidores")
    })
    cardsServer.innerHTML = cardsHTML
}

//adiciona cards de pré kitting no DOM
function addPreKittingCards(cards) {
    const cardsPreKitting = document.getElementById("cards-pre-kitting")
    let cardsHTML = ''
    cards.forEach((card, i) => {
        cardsHTML += cardHTML(card.nome, card.materiais, 'red', i, "pré-kitting")
    })
    cardsPreKitting.innerHTML = cardsHTML
}

// apaga todos os cards
function cleanCards() {
    const cardsPreKitting = document.getElementById("cards-pre-kitting")
    const cardsServer = document.getElementById("cards-servidores")
    const cardsNoteDesk = document.getElementById("cards-notebooks-desks")

    cardsPreKitting.innerHTML = ''
    cardsServer.innerHTML = ''
    cardsNoteDesk.innerHTML = ''
}

// renderiza todos os cards
function render(db) {
    cleanCards()
    const noteDeskSection = document.getElementById("note-desk-section")
    const serversSection = document.getElementById("server-section")
    const preKittingSection = document.getElementById("preKitting-section")
    if (db['notebooks-desktops']) {
        noteDeskSection.style = 'display: block'
        addNoteDeskCards(db['notebooks-desktops'])
    } else {
        noteDeskSection.style = 'display: none'
    }
    if (db['servidores']) {
        serversSection.style = 'display: block'
        addServerCards(db['servidores'])
    } else {
        serversSection.style = 'display: none'
    }
    if (db['pré-kitting']) {
        preKittingSection.style = 'display: block'
        addPreKittingCards(db['pré-kitting'])
    } else {
        preKittingSection.style = 'display: none'
    }
}

// adicionando campos de materiais da maquinas
function materialsADD() {
    const materialsADDHTML = document.getElementById("materials-adding");
    materialsADDHTML.appendChild(materialsField());
}
function materialsADDEdit() {
    const materialsADDHTML = document.getElementById("materials-edit");
    materialsADDHTML.appendChild(materialsField());
}

function mostComumMaterials(element) {
    let materialsName = []
    const category = getCategoryTypeOnURL()
    if (category == 'notebooks-desktops') {
        materialsName = [
            "Caixa",
            "Saco",
            "Cushion",
            "Pré kitting",
            "Flanela",
            "Acessório",
            "Teclado",
            "Adapter"
        ]
    } else if (category == "servidores") {
        materialsName = [
            "caixa",
            "cushion 1",
            "cushion 2",
            "cushion 3",
            "cushion 4"
        ]
    } else if (category == "pré-kitting") {
        materialsName = [
            "cabo",
            "mouse",
            "parafuso",
            "cabo flat"
        ]
    }
    materialsName.forEach(() => {
        materialsADD()
    })
    let countFields = 0
    materialsName.forEach((name, i) => {
        let count = i + 1 + countFields
        let materialName = document.getElementById(`material${count}`)
        while (materialName == null) {
            countFields++
            materialName = document.getElementById(`material${countFields + count}`)
        }
        materialName.value = name
    })
    element.style = 'display: none;'
}

function mostComumMaterialsEdit(element) {
    const materialsAddedQTD = document.querySelectorAll(".adding-fields").length
    let materialsName = []
    const category = getCategoryTypeOnURL()
    if (category == 'notebooks-desktops') {
        materialsName = [
            "Caixa",
            "Saco",
            "Cushion",
            "Pré kitting",
            "Flanela",
            "Acessório",
            "Teclado",
            "Adapter"
        ]
    } else if (category == "servidores") {
        materialsName = [
            "Caixa",
            "Cushion 1",
            "Cushion 2",
            "Cushion 3",
            "Cushion 4"
        ]
    } else if (category == "pré-kitting") {
        materialsName = [
            "Cabo",
            "Mouse",
            "Parafuso",
            "Cabo Flat"
        ]
    }
    materialsName.forEach(() => {
        materialsADDEdit()
    })
    let countFields = 0
    materialsName.forEach((name, i) => {
        let count = i + 1 + countFields + materialsAddedQTD
        let materialName = document.getElementById(`material${count}`)
        while (materialName == null) {
            countFields++
            materialName = document.getElementById(`material${countFields + count}`)
        }
        materialName.value = name
    })
    element.style = 'display: none;'
}


// deletando elemtento pai
function deleteFather(element) {
    element.parentNode.remove()
}

//resetando formulario
function resetForm() {
    const name = document.getElementById("name")
    name.value = ''
    const addButtonComum = document.getElementById("add-button-comum")
    addButtonComum.style = 'display: block;'
    const addButtonComumEdit = document.getElementById("add-button-comum-edit")
    addButtonComumEdit.style = 'display: block;'
    const addingFields = document.querySelectorAll(".adding-fields")
    addingFields.forEach(element => {
        element.remove()
    })
    countingAddField = 0
}


// passando informações pela url
function sendToURLCategory(categoryType) {
    const newURL = "main.html?categoria=" + encodeURIComponent(categoryType);
    window.history.pushState({}, "", newURL);
}


function getCategoryTypeOnURL() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("categoria");
    return category
}

function sendMachineIndexAndCategory(index, category) {
    const newURL = "main.html?index=" + encodeURIComponent(index) + "&categoria=" + encodeURIComponent(category);
    window.history.pushState({}, "", newURL);
}

function getIndexAndCategoryTypeOnURL() {
    const params = new URLSearchParams(window.location.search);
    const index = params.get("index");
    const category = params.get("categoria")
    return { index, category }
}


// Inicializar
const dataBank = loadData();
render(dataBank)
let countingAddField = 0

//event listeners
//lógica do input search 
const search = document.getElementById('search')
search.addEventListener("input", function () {
    if (this.value == '') {
        render(dataBank)
        return
    }
    const searchItem = this.value.toLowerCase()
    let dbSearched = {}
    let categoriaMaquinas = []
    Object.keys(dataBank).forEach((item) => {
        dataBank[item].forEach(maquina => {
            if (maquina.nome.toLowerCase().includes(searchItem) || maquina.materiais.find(material => material['part number'].toLowerCase().includes(searchItem)) != null || maquina.materiais.find(material => material['nome'].toLowerCase().includes(searchItem)) != null) {
                categoriaMaquinas.push(maquina)
            }
        })
        if (categoriaMaquinas.length > 0) {
            dbSearched[item] = categoriaMaquinas
            categoriaMaquinas = []
        }
    })
    render(dbSearched)
})