
const dev = {
    test: () => console.log('tests init'),

    initPalletView: () => {
        let op = 0.1
        for (let i = 3; i <= 12; i++) {
            let el = document.createElement('div')
            el.className = 'lime-box'
            el.style.opacity = op
            head.appendChild(el)
            op += 0.1
        }
    }

}

const SIZE = 50

const head = document.getElementsByTagName('header')[0]
const wrap = document.getElementById('wrap')
const triButton = document.getElementById('tri-shapes-button')
const rectButton = document.getElementById('rect-shapes-button')
const spinShapes = document.getElementById('spin-shapes')
const towerArena = document.getElementById('tower-arena')


const rand = max => Math.floor(Math.random(max) * 100)

const randSizes = () => [rand(SIZE), rand(SIZE)]

const randOpacity = () => {
    let op = Math.random().toFixed(1)
    return op > 0 ? op : 0.1
}

const makeTriangle = angles => {
    const el = document.createElement('div')
    el.className = 'triangle'
    el.style.borderLeft = `solid ${angles[0]}px transparent`
    el.style.borderRight = `solid ${angles[1]}px transparent`
    el.style.borderBottom = `solid ${SIZE}px`
    el.style.opacity = randOpacity()
    el.setAttribute('draggable', true)
    return el
}

const makeRectangle = sizes => {
    const el = document.createElement('div')
    el.className = 'rectangle'
    el.style.width = `${sizes[0]}px`
    el.style.height = `${sizes[1]}px`
    el.style.opacity = randOpacity()
    el.setAttribute('draggable', true)
    return el
}

const genRectangles = amt => {
    for (let i = 0; i < amt; i++) {
        let rect = makeRectangle(randSizes())
        spinShapes.appendChild(rect)
    }
}

const genTriangles = amt => {
    for (let i = 0; i < amt; i++) {
        let triangle = makeTriangle(randSizes())
        spinShapes.appendChild(triangle)
    }
}

triButton.addEventListener('click', () => genTriangles(5), false)
rectButton.addEventListener('click', () => { genRectangles(5) }, false)

dev.initPalletView()
