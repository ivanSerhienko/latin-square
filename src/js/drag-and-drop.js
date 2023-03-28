let counter = 0

function allowDrop(ev) {
    ev.preventDefault()
}

function dragstart(ev) {
    function restoreWrongAndCorrectCells() {
        const game_board = document.getElementById("game-board")
        const arrayTr = game_board.children
        for (let i = 0; i < arrayTr.length; i++) {

            const arrayTd = arrayTr[i].children

            for (let j = 0; j < arrayTd.length; j++) {
                if (arrayTd[j].children[0].id.includes("game-board-base-element"))
                    continue
                const divImageWrapper = arrayTd[j].children[0]
                divImageWrapper.style.background = "none"
                arrayTd[j].style.background = "none"
            }
        }
    }

    if (TYPE === "IMAGE") {
        if (ev.target.children.length === 0)
            return
    } else {
        if (ev.target.tagName === undefined)
            return;
    }

    if (document.getElementById("generate").innerHTML === "Виділіть будь-ласка тільки один елемент")
        restoreAfterSelectOneItem()

    if (ev.target.getAttribute("id").includes("drop"))
        setTimeout(() => {
            ev.target.classList.add("hide")
        }, 0)

    ev.dataTransfer.setData("itemId", ev.target.id)

    if (document.getElementById("check").getAttribute("onclick") === null) {
        restoreCheckButton()
        restoreWrongAndCorrectCells()
    }
}

function dragend(event) {
    event.target.classList.remove("hide")
}

function drop(event) {
    event.stopPropagation();
    event.preventDefault();
    let target = event.target

    if (target.tagName.toLowerCase() === "img")
        target = event.target.parentElement

    const itemId = event.dataTransfer.getData("itemId")

    if (itemId === "") {
        selectOneItem()
        return;
    }

    const divWrapperFromPull = document.getElementById(itemId)
    const divWrapperToPushIntoGameBord = document.createElement('div')

    if (target.getAttribute("id") === divWrapperFromPull.getAttribute("id"))
        return

    divWrapperToPushIntoGameBord.setAttribute("class", "content-wrapper")
    divWrapperToPushIntoGameBord.setAttribute("style", divWrapperFromPull.getAttribute("style"))
    divWrapperToPushIntoGameBord.setAttribute("id", `drop${counter++}`)
    divWrapperToPushIntoGameBord.setAttribute("draggable", "true")
    divWrapperToPushIntoGameBord.setAttribute("ondragover", "allowDrop(event)")
    divWrapperToPushIntoGameBord.setAttribute("ondragstart", "dragstart(event)")
    divWrapperToPushIntoGameBord.setAttribute("ondragend", "dragend(event)")
    divWrapperToPushIntoGameBord.setAttribute("ondrop", "drop(event)")

    if (divWrapperFromPull.getAttribute("id") !== undefined &&
        divWrapperFromPull.getAttribute("id").includes("pull-bord-el")) {
        if (TYPE === "IMAGE")
            divWrapperToPushIntoGameBord.appendChild(divWrapperFromPull.children[0].cloneNode(true))
        else
            divWrapperToPushIntoGameBord.innerText = divWrapperFromPull.innerText
    } else {
        if (TYPE === "IMAGE")
            divWrapperToPushIntoGameBord.appendChild(divWrapperFromPull.children[0])
        else
            divWrapperToPushIntoGameBord.innerText = divWrapperFromPull.innerText
        const parent = divWrapperFromPull.parentElement
        parent.removeChild(divWrapperFromPull)
        parent.appendChild(emptySellGenerator())
    }

    if (target.tagName.toLowerCase() === "div") {
        const cell = target.parentElement
        cell.removeChild(target)
        cell.appendChild(divWrapperToPushIntoGameBord)
    } else target.appendChild(divWrapperToPushIntoGameBord)
}