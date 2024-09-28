
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
        else {
            // spinShapes.appendChild(makeCircle(randSizes()))
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
                    dev.shapeMaker(cols[5].innerHTML)
                    break;
                case 'botRowMatch':
                case 'rightColMatch':
                    dev.shapeMaker(cols[8].innerHTML)
                    break;
                default:
                    console.log('Zero Wins')
            }
        })
    },

}

const SIZE = 50
const head = document.getElementsByTagName('header')[0]
const wrap = document.getElementById('wrap')
const triButton = document.getElementById('tri-shapes-button')
const rectButton = document.getElementById('rect-shapes-button')
const spinShapes = document.getElementById('spin-shapes')
const towerArena = document.getElementById('tower-arena')
const spinButton = document.getElementById('spin-button')

const rand = max => Math.floor(Math.random() * max)

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

spinButton.addEventListener('click', () => {

    const spinResults = dev.parseSpinResults(dev.shapoSpin())

    let wonShapes = Object.keys(spinResults).filter(k =>  spinResults[k] === true)

    dev.populateResults(wonShapes)

}, false)

