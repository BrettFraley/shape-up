
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

}

const SIZE = 50    // max px width/height of a shape
const minSize = 10 // min px width/height of a shape
const head = document.getElementsByTagName('header')[0]
const wrap = document.getElementById('wrap')
const spinShapes = document.getElementById('spin-shapes')
const towerArena = document.getElementById('tower-arena')
const spinButton = document.getElementById('spin-button')
const spinCount = document.getElementById('spin-count')


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

const makeCircle = sizes => {
    const el = document.createElement('div')
    const circleSize = `${sizes[0]}px`
    el.className = 'circle'
    el.style.width = circleSize
    el.style.height = circleSize
    el.style.opacity = randOpacity()
    el.style.borderRadius = `100%`
    el.setAttribute('draggable', true)
    return el
}

spinButton.addEventListener('click', () => {
 
    game.unhighlight()
    
    if (game.player.spinCount < 1) {
        // TODO - pop up to remove block from tower for 10? spins
        spinCount.innerHTML = `Out of spins!`
        return
    }
    game.player.spinCount -= 1
    game.updateSpinCount()

    const spinResults = dev.parseSpinResults(dev.shapoSpin())

    let wonShapes = Object.keys(spinResults).filter(k =>  spinResults[k] === true)

    dev.populateResults(wonShapes)

}, false)

const game = {
    player: {
        spinCount: 50
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

