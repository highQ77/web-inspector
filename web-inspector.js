window.addEventListener('DOMContentLoaded', () => {

    document.body.append(showRWDInfo())
    document.body.append(showTagInformation())
    document.body.append(createToolButton('z-index list', '60px', showZIndex()))
    document.body.append(createToolButton('color palettes', '90px', showColorPalettes()))
    document.body.append(createToolButton('github', '30px', null, () => {
        window.open('https://github.com/highQ77/web-inspector', '_blank')
    }))
})

/** tool buttons functions */

function showRWDInfo() {
    const winInfo = document.createElement('div')
    winInfo.style.background = 'rgba(0,0,0,.5)'
    winInfo.style.position = 'fixed'
    winInfo.style.color = 'white'
    winInfo.style.left = '0px'
    winInfo.style.bottom = '0px'
    winInfo.style.padding = '0 10px'

    let device = ''
    let deviceW = 0
    window.addEventListener('resize', () => {
        deviceW = window.innerWidth
        if (deviceW > -1 && deviceW <= 320) device = ` mobileS - 0 ~ 320px`
        else if (deviceW > 320 && deviceW <= 375) device = ` mobileM - 321 ~ 375px`
        else if (deviceW > 375 && deviceW <= 425) device = ` mobileL - 376 ~ 425px`
        else if (deviceW > 425 && deviceW <= 768) device = ` tablet - 426 ~ 768px`
        else if (deviceW > 768 && deviceW <= 1024) device = ` tablet - 769 ~ 1024px`
        else if (deviceW > 1024 && deviceW <= 1440) device = ` laptop - 1025 ~ 1440px`
        else if (deviceW > 1440 && deviceW <= 9999) device = ` laptopL - 1441 ~ 9999px`
        winInfo.innerHTML = `${window.innerWidth} x ${window.innerHeight} ${device}`
    })
    window.dispatchEvent(new Event('resize'))
    return winInfo
}

function showTagInformation() {
    let infoPanel = document.createElement('div')
    infoPanel.style.position = 'fixed'
    infoPanel.style.right = '0px'
    infoPanel.style.top = '0px'
    infoPanel.style.color = 'white'
    infoPanel.style.border = '.5px solid white'
    infoPanel.style.padding = '10px'
    infoPanel.style.backgroundColor = 'rgba(0,0,0,.7)'
    infoPanel.style.fontSize = '14px'
    infoPanel.style.visibility = 'hidden'
    infoPanel.style.pointerEvents = 'none'

    let rectDisplay = document.createElement('div')
    rectDisplay.style.position = 'absolute'
    rectDisplay.style.outline = '3px solid yellowgreen'
    rectDisplay.style.pointerEvents = 'none'
    rectDisplay.style.transition = 'left .25s, top .25s, width .25s, height .25s'
    document.body.append(rectDisplay)

    let tags = [...document.body.getElementsByTagName('*')]
    tags.forEach(tag => {
        tag.onmouseenter = () => {
            let rect = tag.getBoundingClientRect()
            let x = Math.round(rect.x) + window.scrollX
            let y = Math.round(rect.y) + window.scrollY
            let w = Math.round(rect.width)
            let h = Math.round(rect.height)
            let fs = window.getComputedStyle(tag).fontSize
            let ff = window.getComputedStyle(tag).fontFamily.split(',')
            ff = `${ff.shift()}, ${ff.shift()}, ${ff.shift()}`
            let lh = window.getComputedStyle(tag).lineHeight
            let color = window.getComputedStyle(tag).color
            let bgcolor = window.getComputedStyle(tag).backgroundColor
            let m = window.getComputedStyle(tag).margin
            let p = window.getComputedStyle(tag).padding

            let cInfo = rgbToHexColor(color)
            let bgcInfo = rgbToHexColor(bgcolor)

            infoPanel.innerHTML = `
                <div><b>[${tag.tagName.toLowerCase()}]</b></div>
                <div>id: ${tag.id ? tag.id : '--'}</div>
                <div>className: ${tag.className ? tag.className : '--'}</div>
                <div>x: ${x}</div>
                <div>y: ${y}</div>
                <div>w: ${w}</div>
                <div>h: ${h}</div>
                <div>margin: ${m}</div>
                <div>padding: ${p}</div>
                <div>font-family: ${ff}</div>
                <div>font-size: ${fs}</div>
                <div>line-height: ${lh}</div>
                <div style="color:${color}; background-color:${cInfo.grayLevel > 127 ? 'black' : 'white'};">color: ${color} ${cInfo.info}</div>
                <div style="background-color:${bgcolor};">background-color: ${bgcolor} ${bgcInfo.info} a=${bgcInfo.color.a}</div>
            `
            infoPanel.style.visibility = 'visible'
            rectDisplay.style.left = x + 'px'
            rectDisplay.style.top = y + 'px'
            rectDisplay.style.width = w + 'px'
            rectDisplay.style.height = h + 'px'
        }
        tag.onmouseleave = () => {
            infoPanel.innerHTML = ''
            infoPanel.style.visibility = 'hidden'
        }
    })
    return infoPanel
}

function createToolButton(label, bottom, content, callback) {
    const toolButton = document.createElement('div')
    toolButton.style.display = 'flex'
    toolButton.style.position = 'fixed'
    // toolButton.style.left = '10px'
    toolButton.style.margin = '10px'
    bottom && (toolButton.style.bottom = bottom)
    toolButton.style.width = '100px'
    toolButton.style.height = '25px'
    toolButton.style.color = 'rgb(104,104,104)'
    toolButton.style.background = 'white'
    toolButton.style.justifyContent = 'center'
    toolButton.style.alignItems = 'center'
    toolButton.style.border = '1px solid rgb(145,147,147)'
    toolButton.style.borderBottom = '3px solid rgb(210,211,208)'
    toolButton.style.fontSize = '14px'
    toolButton.style.borderRadius = '4px'
    toolButton.style.cursor = 'pointer'
    toolButton.style.marginBottom = '4px'
    toolButton.innerHTML = label
    toolButton.onclick = () => {
        removeToolCover();
        createToolCover(content)
        callback && callback()
    }
    return toolButton
}

function removeToolCover() {
    const cover = document.getElementById('toolCover')
    cover && cover.remove()
}

function createToolCover(content) {
    const cover = document.createElement('div')
    cover.id = 'toolCover'
    cover.style.display = 'flex'
    cover.style.position = 'fixed'
    cover.style.background = 'rgba(0,0,0,.3)'
    cover.style.height = '100vh'
    // cover.style.width = '200px'
    cover.style.left = '0px'
    cover.style.top = '0px'
    cover.style.backdropFilter = 'blur(10px)'
    cover.style.overflow = 'scroll'
    let btn = cover.appendChild(createToolButton('x'))
    btn.style.right = '0px'
    btn.style.width = '25px'
    btn.onclick = () => cover.remove()
    content && cover.appendChild(content)
    document.body.append(cover)
    return cover
}

function showColorPalettes() {
    let s = document.createElement('div')
    s.style.marginTop = '43px'
    s.style.fontSize = '14px'
    s.style.padding = '0px 10px'
    let html = ''
    let cs = []
    let tags = [...document.body.getElementsByTagName('*')]
    tags.forEach(tag => {
        cs.push(window.getComputedStyle(tag).color, window.getComputedStyle(tag).backgroundColor)
    })
    cs = cs.filter(onlyUnique)
    cs.forEach(i => {
        let cInfo = rgbToHexColor(i)
        html += `<div style="border-radius:4px; padding:4px; color:${cInfo.grayLevel > 127 ? 'black' : 'white'}; background-color:${cInfo.info}; margin: 5px 0px">${i} | ${cInfo.info}</div>`
    })
    s.innerHTML = html
    return s
}

function showZIndex() {
    let s = document.createElement('div')
    s.style.marginTop = '43px'
    s.style.fontSize = '14px'
    s.style.padding = '0px 10px'
    let cs = []
    let tags = [...document.body.getElementsByTagName('*')]
    tags.forEach(tag => {
        cs.push({ tag, z: window.getComputedStyle(tag).zIndex })
    })
    cs.forEach(i => {
        if (i.z != 'auto') {
            let d = document.createElement('div')
            d.innerHTML = `<div style="cursor:pointer;border-radius:4px; padding:4px; color: white; background-color:rgba(0,0,0,.3); margin: 5px 0px">${i.tag.tagName} | id:${i.tag.id}  | className:${i.tag.className} | ${i.z}</div>`
            let rectDisplay = i.tag
            let ogOutline = rectDisplay.style.outline
            d.onclick = () => {
                let rect = i.tag.getBoundingClientRect()
                let top = rect.top + window.scrollY - 100
                window.scrollTo({ top, behavior: "smooth" });
                rectDisplay.style.outline = '3px solid rgba(255,125,0,.5)'
                rectDisplay.onmouseenter = () => { rectDisplay.style.outline = ogOutline }
            }
            s.append(d)
        }
    })
    return s
}

/**
 * hex-lize
 */
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

/**
 * rgbaToHex
 */
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * rgbtoHexColor
 */
function rgbToHexColor(c) {
    if (c.indexOf('rgba(') > -1) {
        let [r, g, b, a] = c.split('rgba(')[1].split(')')[0].split(',').map(i => parseInt(i))
        let grayLevel = 0.299 * r + 0.587 * g + 0.114 * b
        return { grayLevel, info: rgbToHex(r, g, b), color: { r, g, b, a } }
    } else if (c.indexOf('rgb(') > -1) {
        let [r, g, b] = c.split('rgb(')[1].split(')')[0].split(',').map(i => parseInt(i))
        let grayLevel = 0.299 * r + 0.587 * g + 0.114 * b
        return { grayLevel, info: rgbToHex(r, g, b), color: { r, g, b, a: 1 } }
    }
    return null
}

/**
 * common func - unique array
 */
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}