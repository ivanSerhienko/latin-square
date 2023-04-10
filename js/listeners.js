const fullscreenButton = document.getElementById("fullscreenButton");
const labelsRadioButtons = document.querySelectorAll(`main section label`)
const orderInput = document.getElementById("order")
const generateButton = document.getElementById("generate")
const dropDown = document.getElementById("drop-down")
const radioButtonsSection = document.getElementById("radio-buttons-section")
let lastInput

// Fullscreen logic
fullscreenButton.addEventListener("click", () => {
    if (fullscreenButton.children[0].innerHTML === "fullscreen") {
        document.documentElement.requestFullscreen()
        fullscreenButton.children[0].innerHTML = "fullscreen_exit"
        changeWidthDependFullscreenMode("on")
    } else {
        document.exitFullscreen()
        fullscreenButton.children[0].innerHTML = "fullscreen"
        changeWidthDependFullscreenMode("off")
    }
})

document.addEventListener('fullscreenchange', exitFullscreen, false)

function exitFullscreen() {
    if (document.fullscreenElement === null) {
        fullscreenButton.children[0].innerHTML = "fullscreen"
        changeWidthDependFullscreenMode("off")
    }
}

function changeWidthDependFullscreenMode(mode) {
    if (mode === "on")
        document.body.setAttribute("style", "max-width: 100%;")
    if (mode === "off")
        document.body.setAttribute("style", "max-width: 776px;")
}

// Focus and click on radio buttons
labelsRadioButtons.forEach(label => {
    label.onfocus = (event) =>
        event.target.querySelector(".inner").style.setProperty("--change-opacity", "1")
    label.onblur = (event) =>
        event.target.querySelector(".inner").style.setProperty("--change-opacity", "0")
    label.onclick = () => dropDownField(label)
})

// Drop down field
function dropDownField(label) {
    const type = label.children[0].getAttribute("value")
    if (dropDown.children.length !== 0)
        dropDown.innerHTML = ""
    switch (type) {
        case "IMAGE": {
            dropDown.setAttribute("selectedType", "IMAGE")
            Array.from(allImages).forEach(image => {
                const img = document.createElement("img")
                img.setAttribute("src", image)
                img.setAttribute("selected", "false")
                img.setAttribute("draggable", "false")
                img.onclick = () => {
                    if (img.getAttribute("selected") === "false") {
                        img.classList.add("js-element-selected")
                        img.setAttribute("selected", "true")
                    } else {
                        img.classList.remove("js-element-selected")
                        img.setAttribute("selected", "false")
                    }
                }
                dropDown.appendChild(img)
            })
            break
        }
        case "NUMBERS": {
            dropDown.setAttribute("selectedType", "NUMBERS")
            for (let i = 0; i < 10; i++) {
                const div = document.createElement("div")
                div.setAttribute("selected", "false")
                div.innerText = i
                div.style.cursor = "default"
                div.classList.add("content-wrapper")
                div.style.width = "30px"
                div.onclick = () => {
                    if (div.getAttribute("selected") === "false") {
                        div.classList.add("js-element-selected")
                        div.setAttribute("selected", "true")
                    } else {
                        div.classList.remove("js-element-selected")
                        div.setAttribute("selected", "false")
                    }
                }
                dropDown.appendChild(div)
            }
            break
        }
        case "UKR_LETTERS": {
            dropDown.setAttribute("selectedType", "UKR_LETTERS")
            const input = document.createElement("input")
            input.setAttribute("type", "text")
            input.style.width = "93%"
            input.setAttribute("placeholder", "Введи українські маленькі літери через пробіл або кому.")
            dropDown.appendChild(input)
            input.addEventListener("mousedown", inputListener)
            break
        }
        case "ENG_LETTERS": {
            dropDown.setAttribute("selectedType", "ENG_LETTERS")
            const input = document.createElement("input")
            input.setAttribute("type", "text")
            input.style.width = "93%"
            input.setAttribute("placeholder", "Введи англійські маленькі літери через пробіл або кому.")
            dropDown.appendChild(input)
            input.addEventListener("mousedown", inputListener)
            break
        }
        default:
            throw new Error("unknown element type")
    }

    createDropDownButton()

    inputShow()
}

function inputListener(ev) {
    if (ev.target.classList.contains("wrong-input")) {
        ev.target.classList.remove("wrong-input")
        ev.target.value = lastInput
    }
}

function createDropDownButton() {
    const button = document.createElement("button")
    button.setAttribute("type", "button")
    button.setAttribute("id", "drop")
    button.classList.add("cta")
    button.classList.add("cta-icon")
    button.classList.add("cta-secondary")
    button.classList.add("drop-down-button")
    dropDown.appendChild(button)
    const i = document.createElement("i")
    i.setAttribute("aria-hidden", "true")
    i.classList.add("material-icons")
    i.innerHTML = "keyboard_double_arrow_up"
    button.appendChild(i)

    button.onclick = () => {
        if (radioButtonsSection.querySelector("#show-drop-down-button") === null) {
            const showDropDown = document.createElement("button")
            showDropDown.classList.add("cta")
            showDropDown.classList.add("cta-icon")
            showDropDown.classList.add("cta-secondary")
            showDropDown.classList.add("drop-down-button")
            showDropDown.id = "show-drop-down-button"
            radioButtonsSection.appendChild(showDropDown)
            const i = document.createElement("i")
            i.ariaHidden = "true"
            i.classList.add("material-icons")
            i.innerText = "keyboard_double_arrow_down"
            showDropDown.appendChild(i)
            showDropDown.onclick = () => inputShow()
        }

        Array.from(dropDown.children).forEach(child => child.animate([{transform: 'translateY(0%)'}, {transform: 'translateY(-200%)'}], {duration: 300}))

        setTimeout(() => dropDown.style.display = "none", 280)

        setTimeout(() => {
            radioButtonsSection.style.display = "flex"
            Array.from(radioButtonsSection.children).forEach(child => child.animate([{transform: 'translateY(200%)'}, {transform: 'translateY(0%)'}], {duration: 300}))
        }, 320)
    }
}

function inputShow() {
    Array.from(radioButtonsSection.children).forEach(child => child.animate([{transform: 'translateY(0%)'}, {transform: 'translateY(200%)'}], {duration: 300}))

    setTimeout(() => radioButtonsSection.style.display = "none", 280)

    setTimeout(() => {
        dropDown.style.display = "flex"
        Array.from(dropDown.children).forEach(child => child.animate([{transform: 'translateY(-200%)'}, {transform: 'translateY(0%)'}], {duration: 300}))
    }, 320)
}

// Change text at generate button
orderInput.onmousedown = () => {
    if (generateButton.innerHTML === "Введіть число від 2 до 10")
        changeTextInGenerateButton()
}

function changeTextInGenerateButton() {
    if (generateButton.innerHTML === "Введіть число від 2 до 10") {
        generateButton.innerHTML = "Створити"
        generateButton.style.width = 298 + "px"
        setTimeout(() => generateButton.style.width = 156 + "px", 0)
    } else {
        generateButton.innerHTML = "Введіть число від 2 до 10"
        generateButton.style.width = 156 + "px"
        setTimeout(() => generateButton.style.width = 298 + "px", 0)
    }
}