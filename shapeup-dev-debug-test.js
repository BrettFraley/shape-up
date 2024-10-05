// const genRectangles = amt => {
//     for (let i = 0; i < amt; i++) {
//         let rect = makeRectangle(randSizes())
//         spinShapes.appendChild(rect)
//     }
// }

// const genTriangles = amt => {
//     for (let i = 0; i < amt; i++) {
//         let triangle = makeTriangle(randSizes())
//         spinShapes.appendChild(triangle)
//     }
// }

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

    // withinArena: coords => {
    //     return coords.top > game.arena.coords.top &&
    //     coords.bottom < game.arena.coords.bottom &&
    //     coords.left > game.arena.coords.left &&
    //     coords.right < game.arena.coords.right
    // },


















