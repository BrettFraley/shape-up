
const SIZE = 100

const wrap = document.getElementById('wrap')
const triButton = document.getElementById('tri-shapes-button')
const rectButton = document.getElementById('rect-shapes-button')

const rand = max => Math.floor(Math.random(max) * 100)

const randSizes = () => {
    return [rand(SIZE), rand(SIZE)]
}

const randOpacity = () => {
    let op = Math.random().toFixed(1)
    return op > 0 ? op : 0.1
}

const makeTriangle = angles => {
    const el = document.createElement('div')
    el.className = 'triangle'
    el.style.borderLeft = `solid ${angles[0]}px transparent`
    el.style.borderRight = `solid ${angles[1]}px transparent`
    el.style.borderBottom = `solid 100px`
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
        wrap.appendChild(rect)
    }
}

const genTriangles = amt => {
    for (let i = 0; i < amt; i++) {
        let triangle = makeTriangle(randSizes())
        wrap.appendChild(triangle)
    }
}

triButton.addEventListener('click', () => genTriangles(5), false)
rectButton.addEventListener('click', () => { genRectangles(5) }, false)


