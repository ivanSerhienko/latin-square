window.onload = emptyTablesGenerator
let N
let lastN
let VALUES = allImages
const width = 320 // 455 350
const height = 260
const board = document.getElementById("board")
let COMPLEXITY_TYPE = "MEDIUM_LEVEL"
let TYPE = "IMAGE"
let latin_square_obj
let initial_square
let emptyCellCounter = 0

function emptyTablesGenerator(width, height) {
    N = 3

    if (board.children.length !== 0)
        board.removeChild(board.children[0])

    latin_square_obj = new Latin(Number(N))
    initial_square = latin_square_obj.square

    const game_table = document.createElement("table")
    game_table.setAttribute("cellspacing", "0")
    board.appendChild(game_table)

    for (let i = 0; i < initial_square.length; i++) {
        const tr = document.createElement("tr")
        game_table.appendChild(tr)
        for (let j = 0; j < initial_square[i].length; j++) {
            const td = document.createElement("td")
            td.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
            tr.appendChild(td)
            td.appendChild(emptySellGenerator())
        }
    }

    const pull = document.getElementById('pull')

    if (pull.children.length !== 0)
        pull.removeChild(pull.children[0])

    const pull_table = document.createElement("table")
    pull_table.setAttribute("id", "table-pull")
    pull_table.setAttribute("cellspacing", "0")
    pull.appendChild(pull_table)

    for (let i = 1; i < Number(N) + 1; i++) {
        const tr = document.createElement("tr")
        pull_table.appendChild(tr)

        const td = document.createElement("td")
        td.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
        tr.appendChild(td)
        td.appendChild(emptySellGenerator())
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

async function generate() {
    function pokeHoles(square, holes, N) {
        let pokedHoles = []
        let count = 0;
        let proposedBoard;
        while (pokedHoles.length < holes) {
            const val = Math.floor(Math.random() * N * N) // Value between 0-N^2
            const randomRowIndex = Math.floor(val / N) // Integer 0-N for row index
            const randomColIndex = val % N
            if (!square[randomRowIndex]) {
                continue // guard against cloning error
            }
            if (square[randomRowIndex][randomColIndex] === 0) {
                continue // If cell already empty, restart loop
            }

            pokedHoles.push({  // Store the current value at the coordinates
                rowIndex: randomRowIndex,
                colIndex: randomColIndex,
                val: square[randomRowIndex][randomColIndex]
            })
            square[randomRowIndex][randomColIndex] = 0 // "poke a hole" in the board at the coords
            proposedBoard = square.map(row => row.slice()) // Clone this changed board
            count++;
        }
        return proposedBoard;
    }

    function isOneComplexityRadioButtonsSelected() {
        let flag = false
        for (const x of labelsComplexityRadioButtons) {
            if(x.children[0].checked === true)
                flag = true
        }
        return flag
    }

    N = orderInput.value
    if (N === "")
        N = 3

    if (N < 2 || N > 10 || !/^\s*\d+\s*$/ig.test(N)) {
        if (generateButton.innerHTML !== "Введіть число від 2 до 10")
            changeTextInGenerateButton("Введіть число від 2 до 10")

        if (lastN > 1 && lastN < 11) N = lastN

        return
    }

    if (N !== lastN)
        lastN = N

    if (generateButton.innerHTML === "Введіть число від 2 до 10")
        changeTextInGenerateButton("Створити")

    if (generateButton.innerHTML === "Виділіть будь-ласка тільки один елемент")
        restoreAfterSelectOneItem()

    if (dropDown.children.length !== 0) {
        fillData()
        if(VALUES.length === 0)
            return;
    }
    else {
        dropDownField(labelsRadioButtons[0])
        await new Promise(resolve => {setTimeout(resolve, 300)})
    }

    if (board.children.length !== 0)
        board.removeChild(board.children[0])

    if(!isOneComplexityRadioButtonsSelected())
        labelsComplexityRadioButtons[1].children[0].checked = true

    latin_square_obj = new Latin(Number(N))
    initial_square = latin_square_obj.square

    let min
    let max
    let coefficient
    let step
    switch (COMPLEXITY_TYPE) {
        case "EASY_LEVEL": {
            coefficient = 0.5 * Number(N)
            step = Math.floor(Number(N) / 3 * coefficient)
            min = Math.ceil(Number(N) / 3) + step
            max = min + step
            break
        }
        case "MEDIUM_LEVEL": {
            coefficient = 0.5 * Number(N)
            step = Math.floor(Number(N) / 3 * coefficient)
            min = Number(N) + step
            max = min + step
            break
        }
        case "HARD_LEVEL": {
            coefficient = 0.5 * Number(N)
            step = Math.floor(Number(N) / 3 * coefficient)
            min = Number(N) + Math.floor(coefficient) + step
            max = min + step
            break
        }
        default: throw new Error("unknown complexity level")
    }

    console.log(min + " " + max)
    const holesAmount = random(min, max + 1)
    pokeHoles(initial_square, holesAmount, Number(N))

    const table = document.createElement("table")
    table.setAttribute("cellspacing", "0")
    table.setAttribute("id", "game-board")
    board.appendChild(table)

    for (let i = 0; i < initial_square.length; i++) {
        const tr = document.createElement("tr")
        table.appendChild(tr)

        for (let j = 0; j < initial_square[i].length; j++) {
            const td = document.createElement("td")
            td.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
            tr.appendChild(td)
            if (TYPE === "IMAGE") {
                if (initial_square[i][j] !== 0) {
                    td.style.background = "#ECECEC"
                    const divImageWrapper = document.createElement("div")
                    divImageWrapper.setAttribute("class", "content-wrapper")
                    divImageWrapper.setAttribute("id", `game-board-base-element${i + j}`)
                    divImageWrapper.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px; background: #ECECEC;`)
                    td.appendChild(divImageWrapper)
                    const img = new Image()
                    img.setAttribute("draggable", "false")
                    img.setAttribute("src", `${VALUES[initial_square[i][j] - 1]}`)
                    let h = img.naturalHeight
                    while (h >= height / Number(N)) h /= 2
                    img.setAttribute("style", `width: auto; height: ${h}px;`)
                    divImageWrapper.appendChild(img)
                } else td.appendChild(emptySellGenerator())
            } else {
                if (initial_square[i][j] !== 0) {
                    td.style.background = "#ECECEC"
                    const divStringWrapper = document.createElement("div")
                    divStringWrapper.setAttribute("class", "content-wrapper")
                    divStringWrapper.setAttribute("id", `game-board-base-element${i + j}`)
                    divStringWrapper.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px; background: #ECECEC;`)
                    divStringWrapper.setAttribute("draggable", "false")
                    divStringWrapper.style.fontSize = `${200 / Number(N)}px`
                    divStringWrapper.innerHTML = VALUES[initial_square[i][j] - 1]
                    td.appendChild(divStringWrapper)
                } else td.appendChild(emptySellGenerator())
            }
        }
    }
    fillPull()

    if (document.getElementById("check").getAttribute("onclick") === null)
        restoreCheckButton()
}

function emptySellGenerator() {
    const div = document.createElement("div")
    //div.setAttribute("class", "empty-cell")
    div.setAttribute("id", `empty-cell-${emptyCellCounter++}`)
    div.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
    div.setAttribute("ondrop", "drop(event)")
    div.setAttribute("ondragover", "allowDrop(event)")
    return div
}

function fillPull() {
    const pull = document.getElementById('pull')

    if (pull.children.length !== 0)
        pull.removeChild(pull.children[0])

    const table = document.createElement("table")
    table.setAttribute("id", "table-pull")
    table.setAttribute("cellspacing", "0")
    pull.appendChild(table)

    for (let i = 0; i < Number(N); i++) {
        const tr = document.createElement("tr")
        table.appendChild(tr)

        const td = document.createElement("td")
        td.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
        tr.appendChild(td)

        if (TYPE === "IMAGE") {
            const divImageWrapper = document.createElement("div")
            divImageWrapper.setAttribute("class", "content-wrapper")
            divImageWrapper.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
            divImageWrapper.setAttribute("id", `pull-bord-el${i}`)
            divImageWrapper.setAttribute("draggable", "true")
            divImageWrapper.setAttribute("ondragstart", "dragstart(event)")
            divImageWrapper.ontouchstart = (ev) => touchstart(ev)
            divImageWrapper.ontouchmove = (ev) => touchmove(ev)
            divImageWrapper.ontouchend = (event) => touchend(event)
            td.appendChild(divImageWrapper)

            const img = new Image()
            img.setAttribute("src", `${VALUES[i]}`)
            img.setAttribute("draggable", "false")
            let h = img.naturalHeight
            while (h >= height / Number(N)) h /= 2
            img.setAttribute("style", `width: auto; height: ${h}px;`)
            divImageWrapper.appendChild(img)
        } else {
            const divStringWrapper = document.createElement("div")
            divStringWrapper.setAttribute("class", "content-wrapper")
            divStringWrapper.setAttribute("id", `pull-bord-el${i}`)
            divStringWrapper.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
            divStringWrapper.setAttribute("draggable", "true")
            divStringWrapper.setAttribute("ondragstart", "dragstart(event)")
            divStringWrapper.ontouchstart = (ev) => touchstart(ev)
            divStringWrapper.ontouchmove = (ev) => touchmove(ev)
            divStringWrapper.ontouchend = (event) => touchend(event)
            divStringWrapper.style.fontSize = `${200 / Number(N)}px`
            divStringWrapper.innerHTML = VALUES[i]
            td.appendChild(divStringWrapper)
        }
    }
}

function restoreCheckButton() {
    const checkButton = document.getElementById("check")
    checkButton.classList.add("cta-primary")
    checkButton.classList.remove("wrong")
    checkButton.classList.remove("correct")
    checkButton.setAttribute("onclick", "check()")
    checkButton.innerHTML = "Перевірити"
}

function check() {
    const game_board = document.getElementById("game-board")

    if (game_board === null)
        return;

    function isUniqueInLine(arrayTd, td, index) {
        for (let i = 0; i < arrayTd.length; i++) {
            if (i === index) continue

            if (TYPE === "IMAGE") {
                const divImageWrapperOne = arrayTd[i].children[0]
                const imageOne = divImageWrapperOne.children[0]
                const divImageWrapperTwo = td.children[0]
                const imageTwo = divImageWrapperTwo.children[0]

                if (imageOne.src === imageTwo.src) return false
            } else {
                if (arrayTd[i].innerText === td.innerText) return false
            }
        }
        return true
    }

    function isUniqueInRow(arrayTr, tr, tdIndex) {
        for (let i = 0; i < arrayTr.length; i++) {
            if (arrayTr[i] === tr) continue
            const tdOne = arrayTr[i].children[tdIndex]
            const tdTwo = tr.children[tdIndex]

            if (TYPE === "IMAGE") {
                const divImageWrapperOne = tdOne.children[0]
                const imageOne = divImageWrapperOne.children[0]
                const divImageWrapperTwo = tdTwo.children[0]
                const imageTwo = divImageWrapperTwo.children[0]

                if (imageOne.src === imageTwo.src) return false
            } else {
                if (tdOne.innerText === tdTwo.innerText) return false
            }
        }
        return true
    }

    function isGameBoardFilled(game_board) {
        const arrayTr = game_board.children
        for (let i = 0; i < arrayTr.length; i++) {
            const arrayTd = arrayTr[i].children
            for (let j = 0; j < arrayTd.length; j++) {
                if (arrayTd[j].children[0].id.includes("empty-cell"))
                    return false;
            }
        }
        return true
    }

    const checkButton = document.getElementById("check")

    if (!isGameBoardFilled(game_board)) {
        checkButton.removeAttribute("onclick")
        checkButton.innerHTML = "Заповни усі клітинки"
        return;
    }

    let flag = true
    const arrayTr = game_board.children
    for (let i = 0; i < arrayTr.length; i++) {

        const arrayTd = arrayTr[i].children

        for (let j = 0; j < arrayTd.length; j++) {
            if (arrayTd[j].children[0].id.includes("game-board-base-element"))
                continue
            const divImageWrapper = arrayTd[j].children[0]
            if (isUniqueInLine(arrayTd, arrayTd[j], j)
                && isUniqueInRow(arrayTr, arrayTr[i], j)) {
                divImageWrapper.style.background = "#A3D76E"
                arrayTd[j].style.background = "#A3D76E"
            } else {
                arrayTd[j].style.background = "#CD001C"
                divImageWrapper.style.background = "#CD001C"
                checkButton.classList.add("wrong")
                checkButton.classList.remove("cta-primary")
                checkButton.removeAttribute("onclick")
                checkButton.innerHTML = "Неправильно"
                flag = false
            }
        }
    }
    if (flag) {
        checkButton.classList.add("correct")
        checkButton.classList.remove("cta-primary")
        checkButton.removeAttribute("onclick")
        checkButton.innerHTML = "Правильно"
    }
}

function retry() {
    const game_board = document.getElementById("game-board")

    if (game_board === null)
        return;

    Array.from(game_board.children).map(tr => Array.from(tr.children).map(td => {
        const divImageWrapper = td.children[0]
        if (!divImageWrapper.id.includes("game-board-base-element")) {
            td.replaceChild(emptySellGenerator(), divImageWrapper)
            td.style.background = "white"
        }
    }))

    if (document.getElementById("check").getAttribute("onclick") === null)
        restoreCheckButton()
}

function selectOneItem() {
    const gameBoard = document.getElementById("game-board")
    const pullBoard = document.getElementById("table-pull")
    const checkButton = document.getElementById("check")
    const generateButton = document.getElementById("generate")
    const retryButton = document.querySelector("body footer button")

    gameBoard.style.border = "3px solid red"
    Array.from(gameBoard.children).forEach(tr =>
        Array.from(tr.children).forEach(td =>
            td.style.border = "3px solid red")
    )

    pullBoard.style.border = "3px solid red"
    Array.from(pullBoard.children).forEach(tr =>
        Array.from(tr.children).forEach(td =>
            td.style.border = "3px solid red")
    )

    generateButton.classList.replace("cta-primary", "cta-primary-js-one-item")
    generateButton.innerHTML = "Виділіть будь-ласка тільки один елемент"
    generateButton.style.fontSize = "0.8em"
    generateButton.style.width = "450px"

    checkButton.classList.replace("cta-primary", "cta-primary-js-one-item")
    checkButton.innerHTML = "Виділіть будь-ласка тільки один елемент"
    checkButton.removeAttribute("onclick")

    retryButton.removeAttribute("onclick")
}

function restoreAfterSelectOneItem() {
    const gameBoard = document.getElementById("game-board")
    const pullBoard = document.getElementById("table-pull")
    const checkButton = document.getElementById("check")
    const generateButton = document.getElementById("generate")
    const retryButton = document.querySelector("body footer button")

    gameBoard.style.border = "3px solid #5B9BD5"
    Array.from(gameBoard.children).forEach(tr =>
        Array.from(tr.children).forEach(td =>
            td.style.border = "3px solid #5B9BD5")
    )

    pullBoard.style.border = "3px solid #5B9BD5"
    Array.from(pullBoard.children).forEach(tr =>
        Array.from(tr.children).forEach(td =>
            td.style.border = "3px solid #5B9BD5")
    )


    generateButton.classList.replace("cta-primary-js-one-item", "cta-primary")
    generateButton.innerHTML = "Створити"
    generateButton.style.fontSize = "1.2em"
    generateButton.style.width = "156px"

    checkButton.classList.replace("cta-primary-js-one-item", "cta-primary")
    checkButton.innerHTML = "Перевірити"
    checkButton.setAttribute("onclick", "check()")

    retryButton.setAttribute("onclick", "retry()")
}

function fillData() {
    VALUES = []
    TYPE = dropDown.getAttribute("selectedType")
    let selectedArray = []
    let isOrderSelected = false

    if (orderInput.value !== "")
        isOrderSelected = true

    switch (TYPE) {
        case "IMAGE": {
            Array.from(dropDown.children).forEach(el => {
                if (el.getAttribute("selected") === "true")
                    selectedArray.push(el.getAttribute("src"))
            })
            break
        }
        case "NUMBERS": {
            Array.from(dropDown.children).forEach(el => {
                if (el.getAttribute("selected") === "true")
                    selectedArray.push(el.innerHTML)
            })
            break
        }
        case "ENG_LETTERS": {
            const input = dropDown.children[0]
            selectedArray = input.value.split(/\s|,/g)
            selectedArray = selectedArray.filter(el => el !== "")
            for (let i = 0; i < selectedArray.length; i++) {
                selectedArray[i] = selectedArray[i].toLowerCase()
                if (selectedArray[i].length !== 1) {
                    lettersInputError("Літера - один знак. Вводи будь-ласка по одному символу.")
                    return
                }
                if(!allEnglishLetters.includes(selectedArray[i])) {
                    lettersInputError("Вводи будь-ласка тільки англійські маленькі літери.")
                    return;
                }
                for (let j = 0; j < selectedArray.length; j++) {
                    if (j === i) continue
                    if(selectedArray[j] === selectedArray[i]) {
                        lettersInputError("Вводи будь-ласка кожну літеру тільки один раз")
                        return;
                    }
                }
            }
            break
        }
        case "UKR_LETTERS": {
            const input = dropDown.children[0]
            selectedArray = input.value.split(/\s|,/g)
            selectedArray = selectedArray.filter(el => el !== "")
            for (let i = 0; i < selectedArray.length; i++) {
                selectedArray[i] = selectedArray[i].toLowerCase()
                if (selectedArray[i].length !== 1) {
                    lettersInputError("Літера - один знак. Вводи будь-ласка по одному символу.")
                    return
                }
                if(!allUkrainianLetters.includes(selectedArray[i])) {
                    lettersInputError("Вводи будь-ласка тільки українські маленькі літери.")
                    return;
                }
                for (let j = 0; j < selectedArray.length; j++) {
                    if (j === i) continue
                    if(selectedArray[j] === selectedArray[i]) {
                        lettersInputError("Вводи будь-ласка кожну літеру тільки один раз")
                        return;
                    }
                }
            }
            break
        }
    }

    switch (true) {
        case selectedArray.length === 0: {
            switch (TYPE) {
                case "IMAGE": {
                    VALUES = allImages
                    break
                }
                case "NUMBERS": {
                    VALUES = allNumbers
                    break
                }
                case "UKR_LETTERS": {
                    VALUES = allUkrainianLetters
                    break
                }
                case "ENG_LETTERS": {
                    VALUES = allEnglishLetters
                    break
                }
            }
            break
        }

        case !isOrderSelected: {
            if(selectedArray.length === 1) {
                changeTextInGenerateButton("Обери щонайменше два елементи")
                return;
            }

            VALUES = selectedArray
            N = selectedArray.length.toString()
            break
        }

        case selectedArray.length === Number(N) && isOrderSelected: {
            VALUES = selectedArray
            break
        }

        case selectedArray.length !== Number(N) && isOrderSelected: {
            changeTextInGenerateButton("Обери кількість елементів відповідно до порядку квадрата", "0.7em")
            return;
        }
    }
}

function lettersInputError(massage) {
    const input = dropDown.children[0]
    lastInput = input.value
    input.value = massage
    input.classList.add("wrong-input")
}