
const dev = {
    test: {
        init: () => console.log('tests init'),
        shapoEngineTest: () => {}
    },

    // NOTE: Order is RTC (rectangle, triangle, circle)
    shapeIcons: ['9647', '9651', '9711'],

    shapeMaker: shape => {
    
        if (shape.charCodeAt() === parseInt(dev.shapeIcons[0]) ) {
            spinShapes.appendChild(makeRectangle(randSizes()))
        }
        else if (shape.charCodeAt() === parseInt(dev.shapeIcons[1])) {
            spinShapes.appendChild(makeTriangle(randSizes()))
        }
        else if (shape.charCodeAt() === parseInt(dev.shapeIcons[2])) {
            spinShapes.appendChild(makeCircle(randSizes()))
        }
    },


    shapoSpin: () => {
        let cols = document.getElementsByClassName('shapo-col')
        let vals = []
        let once = false
        spinButton.disabled = true
        // do this better..as a method above
        let spinnerInterval = setInterval(() => {
            for (let i = 0; i < cols.length; i++) {
                if (!once) {
                    cols[i].style.color = 'rgba(0,0,0,0)'   
                }
                cols[i].style.opacity = randOpacity()
            }
            once = true
        }, 200)

        setTimeout(() => { 
            clearInterval(spinnerInterval)
            for (let i = 0; i < cols.length; i++) {
                cols[i].style.color = 'lime'
                cols[i].style.opacity = 1
            }
            spinButton.disabled = false
        }, 2000)

        for (let i = 0; i < cols.length; i++) {
            let shapeVal = `&#${dev.shapeIcons[rand(3)]}`
            cols[i].innerHTML = shapeVal
            vals.push(shapeVal)
        }
    
        return [
            [vals[0], vals[1], vals[2]],
            [vals[3], vals[4], vals[5]],
            [vals[6], vals[7], vals[8]],
        ]
    },

    match3: trips => trips[0] == trips[1] && trips[0] == trips[2],

    parseSpinResults: results => {
        return {
            topRowMatch:   dev.match3([results[0][0], results[0][1], results[0][2]]),
            midRowMatch:   dev.match3([results[1][0], results[1][1], results[1][2]]),
            botRowMatch:   dev.match3([results[2][0], results[2][1], results[2][2]]),
            leftColMatch:  dev.match3([results[0][0], results[1][0], results[2][0]]),
            midColMatch:   dev.match3([results[0][1], results[1][1], results[2][1]]),
            rightColMatch: dev.match3([results[0][2], results[1][2], results[2][2]]),
        }
    },
    // Accepts win results
    populateResults: won => {
        const cols = document.getElementsByClassName('shapo-col')
        won.forEach(val => {
            switch(val) {
                case 'topRowMatch':
                case 'leftColMatch':                    
                    dev.shapeMaker(cols[0].innerHTML)
                    break;
                case 'midRowMatch':
                case 'midColMatch':                   
                    dev.shapeMaker(cols[4].innerHTML)
                    break;
                case 'botRowMatch':
                case 'rightColMatch':
                    dev.shapeMaker(cols[8].innerHTML)
                    break;
                default:
                    console.log('Zero Wins')
            }
            game.showWinLine(val)
        })
    },
    autoSpin: () => {
        setInterval(() => {
            if (game.player.spinCount > 0) {
                spinButton.click()
            }
            else {
                clearInterval()
            }
        }, 4000)
    }

}

const SIZE = 50    // max px width/height of a shape
const minSize = 10 // min px width/height of a shape
const head = document.getElementsByTagName('header')[0]
const wrap = document.getElementById('wrap')
const spinShapes = document.getElementById('spin-shapes')
const towerArena = document.getElementById('tower-arena')
const spinButton = document.getElementById('spin-button')
const autoSpinButton = document.getElementById('auto-button')
const spinCount = document.getElementById('spin-count')
const shapoMatic = document.getElementById('shapomatic')

const rand = max => Math.floor(Math.random() * max)

const randSizes = () => {
    let size1 = rand(SIZE)
    let size2 = rand(SIZE)
    size1 = size1 >= minSize ? size1 : minSize
    size2 = size2 >= minSize ? size2 : minSize

    return [size1, size2]
}

const randOpacity = () => {
    let op = Math.random().toFixed(1)
    return op > 0 ? op : 0.2
}

const makeTriangle = angles => {
    const el = document.createElement('div')
    el.className = 'shape triangle'
    el.style.borderLeft = `solid ${angles[0]}px transparent`
    el.style.borderRight = `solid ${angles[1]}px transparent`
    el.style.borderBottom = `solid ${SIZE}px`
    el.style.opacity = randOpacity()
    el.setAttribute('draggable', true)
    return el
}

const makeRectangle = sizes => {
    const el = document.createElement('div')
    el.className = 'shape rectangle'
    el.style.width = `${sizes[0]}px`
    el.style.height = `${sizes[1]}px`
    el.style.opacity = randOpacity()
    el.setAttribute('draggable', true)
    return el
}

const makeCircle = sizes => {
    const el = document.createElement('div')
    const circleSize = `${sizes[0]}px`
    el.className = 'shape circle'
    el.style.width = circleSize
    el.style.height = circleSize
    el.style.opacity = randOpacity()
    el.style.borderRadius = `100%`
    el.setAttribute('draggable', true)
    return el
}

spinButton.addEventListener('click', () => {
    if (!this.disabled) {
        game.unhighlight()
        
        if (game.player.spinCount < 1) {
            // TODO - pop up to remove block from tower for 10? spins
            spinCount.innerHTML = `Out of spins!`
            return
        }
        game.player.spinCount -= 1
        game.updateSpinCount()
        const spinResults = dev.parseSpinResults(dev.shapoSpin())

        setTimeout(() => {
            let wonShapes = Object.keys(spinResults).filter(k =>  spinResults[k] === true)
            dev.populateResults(wonShapes)
        }, 2050)
    }

}, false)

autoSpinButton.addEventListener('click', () => {
    dev.autoSpin()
}, false)

// TODO: Move drag and drop POC work
document.addEventListener('drag', e => {
    game.arena.draggedShape = e.target.classList.contains('shape') ? e.target : null
})

towerArena.addEventListener('dragover', e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
}, false)

// TODO: fine tune drop x,y related to mouse grab point
// Figure out how far mouseX is from top left of shape, > or <
// Figure out how far mouseY is from top left of shape, > or <
towerArena.addEventListener('drop', e => {
    e.preventDefault()
    if (game.arena.draggedShape) {

        let shape = game.arena.draggedShape

        const shapeInfo = shape.getBoundingClientRect()
        const shapeW = Math.floor(shapeInfo.width / 2)
        const shapeH = Math.floor(shapeInfo.height / 2)

        const mouseX = e.clientX - shapeW 
        const mouseY = e.clientY + shapeH

        shape.style.position = 'absolute'
        shape.style.left = `${mouseX}px`
        shape.style.top = `${mouseY}px`
        e.target.appendChild(game.arena.draggedShape)

        game.arena.drop(shape)
    }
}, false)
// END Place holder for drag POC work

const game = {
    player: {
        spinCount: 50,
        towerLevel: 0
    },

    arena: {
        draggedShape: null,
        coords: towerArena.getBoundingClientRect(),
        
        // If any shapes left side is within the dropping shape's left and right side
        // or right side is within dropping shape's left and right side, and shape's top
        // is below the dropping shape's bottom, then it is below the dropping shape
        getTowerShapes: () => {
            let = rects = []
            let shapes = towerArena.getElementsByClassName('shape')

            for (let i = 0; i < shapes.length; i++) {
                if (!shapes[i].classList.contains('active-drop')) {
                    rects.push(shapes[i].getBoundingClientRect())
                }
            }
            console.log('rects', rects)
            return rects
        },
        // Any one shape may not be dragged within another's bounding box / path
        detectShapeBelow: shape => {
            console.log(shape)
            let shapes = game.arena.getTowerShapes()
            let belowShapes = shapes.filter(s => {

                return  (s.left > shape.left && s.left < shape.right)   ||
                        (s.right > shape.left && s.right < shape.right) ||
                        (s.left < shape.left && s.right > shape.right) 
            })
            console.log('Below Shapes: ', belowShapes)
            return belowShapes
        },

        drop: shape => {
            let increase = 0
            const dims = shape.getBoundingClientRect()
            shape.classList.add('active-drop')
            shape.classList.add('tower-shape')

            const belowShapes = game.arena.detectShapeBelow(dims)
            let topPoint = belowShapes.map(s => s.top).sort()[belowShapes.length - 1]

            let floor = topPoint !== undefined ? topPoint + dims.height : game.arena.coords.bottom

            console.log(floor)

            setInterval(() => {
                if (dims.top + dims.height + increase < floor) {
                    shape.style.top = `${dims.top + increase}px`
                    increase += 1
                }
                else {
                    clearInterval()
                }
            }, 5)
            shape.classList.remove('active-drop')
        }
    },

    updateSpinCount: () => spinCount.innerHTML = `Spins: ${game.player.spinCount}`,

    highlight: el => el.classList.add('highlighted'),

    unhighlight: () => {
        const divs = document.getElementsByClassName('highlighted')
        const len = divs.length

        if (len > 0) {

            for (let i = len - 1; i > -1; i--) {
                divs[i].className = divs[i].classList.contains('shapo-row')
                ? 'row shapo-row' : 'col-4 shapo-col'
            }
        }
    },

    showWinLine: lines => {
        let rows = document.getElementsByClassName('shapo-row')
        let cols = document.getElementsByClassName('shapo-col')

        let colMap = {
            left:   [cols[0], cols[3], cols[6]],
            middle: [cols[1], cols[4], cols[7]],
            right:  [cols[2], cols[5], cols[8]]
        }
        const highlightCol = colList => {
            for (let i = 0; i < colList.length; i++) {
                game.highlight(colList[i])
            }
        }

        switch(lines) {
            case 'topRowMatch':   game.highlight(rows[0]);     break;
            case 'midRowMatch':   game.highlight(rows[1]);     break;
            case 'botRowMatch':   game.highlight(rows[2]);     break;
            case 'leftColMatch':  highlightCol(colMap.left);   break;
            case 'midColMatch':   highlightCol(colMap.middle); break;
            case 'rightColMatch': highlightCol(colMap.right);  break;
            default:
                console.log('Zero Wins')
        }
    },

}

