/*
*   Mouse AnimationS on Canvas
*
*   Stuff Here:
*   - Custom Mouse Icon
*   - Mouse Trail
*   - Mouse Click Animation
*   - Mouse Hover Animation
*
*
*   Global Variables:
*   - canvas
*   - ctx
 */

const mouse = {
    // The mouse position
    currentX: 0,
    currentY: 0,

    // The position drawn on the canvas
    x: 0,
    y: 0,

    click: false,

    hover: false,
    hoverEl: null,
    hoverElCenterReached: false,
    // hoverAnimation: 'default' | 'icon'
    // default: the mouse will outline the element
    // icon: the mouse will be an icon depending on the element | e.g. on the Love button it will be a heart ; on the 'alias' it will be an arrow
    hoverAnimation: 'default',

    // Direction of the mouse in Radians
    direction: 0,
    // Speed of the mouse
    speed: 0,

    transformBaseCSS: "",
}

window.addEventListener('mousemove', (e) => {
    if (mouse.hoverElCenterReached) return
    mouse.currentX = e.clientX
    mouse.currentY = e.clientY
})
window.addEventListener('mousedown', () => {
    mouse.click = true
})
window.addEventListener('mouseup', () => {
    mouse.click = false
})
// This needs to be a variable because it will be used in SOTD as well
const mouseHoverHandler = (el) => {
    el.addEventListener('mouseover', () => {
        mouse.hover = true
        mouse.hoverEl = el

        if (el.dataset.hoveranimationicon) {
            mouse.hoverAnimation = el.dataset.hoveranimationicon
            mouseEl.classList.add(mouse.hoverAnimation, "hoverIcon")
        } else {
            mouse.hoverAnimation = 'default'
            mouseEl.classList.add('hovering')
        }
    })
    el.addEventListener('mouseout', ev => {
        if (ev.relatedTarget.dataset.hoveranimationicon) return

        mouse.hover = false
        mouse.hoverEl = null
        // mouseEl.classList.remove('hovering')
        mouse.hoverElCenterReached = false
        mouseEl.className = ''
        mouse.hoverAnimation = 'default'

        const rect = el.getBoundingClientRect()
        mouse.x = rect.left
        mouse.y = rect.top

        console.log(ev)
    })
}
document.querySelectorAll('.mouse-hover, [target="_blank"], [regu]').forEach(mouseHoverHandler)

function lerp(a, b, t) {
    return a + (b - a) * t
}

let t = 0.02
/**
 * Every frame it interpolates the mouse size
 */
function mouseSizeInterpolation() {
    if (
        Math.abs(mouse.x - mouse.currentX) < 1 && Math.abs(mouse.y - mouse.currentY) < 1
    ) return
    mouse.direction = Math.atan2(mouse.y - mouse.y, mouse.x - mouse.x)
    mouse.speed = Math.hypot(mouse.x - mouse.x, mouse.y - mouse.y)

    mouse.x = lerp(mouse.x, mouse.currentX, t)
    mouse.y = lerp(mouse.y, mouse.currentY, t)
}

addCanvasRenderer(mouseSizeInterpolation)

const mouseEl = document.querySelector('[mouse]')
mouse.transformBaseCSS = getComputedStyle(mouseEl).transform
// Custom Mouse Icon - NOT USING CANVAS
// This is the Canvas Renderers array only to load it every frame
function customMouseIcon() {
    if (mouse.hover && mouse.hoverAnimation == "default") {
        // Decrease the interpolation speed
        t = 0.1
        // Mouse should follow the element
        const rect = mouse.hoverEl.getBoundingClientRect()

        // checks if the mouse has reached the center of the element
        if (Math.abs(mouse.currentX - (rect.left + rect.width / 2)) < 1 && Math.abs(mouse.currentY - (rect.top + rect.height / 2)) < 1) {
            mouse.hoverElCenterReached = true
        }

        mouse.currentX = rect.left + rect.width / 2
        mouse.currentY = rect.top + rect.height / 2

        // mouseEl.style.left = `${rect.left + rect.width / 2}px`
        // mouseEl.style.top = `${rect.top + rect.height / 2}px`
        mouseEl.style.width = `${rect.width}px`
        mouseEl.style.height = `${rect.height}px`

        mouseEl.style.transform = ``
    } else {
        // Reset the interpolation speed
        t = 0.2

        mouseEl.style.transform = `${mouse.transformBaseCSS} rotate(${mouse.direction}rad)`
        mouseEl.style.height = `${(1 / (mouse.speed / 15 + 1)) * 20}px`
    }
    mouseEl.style.left = `${mouse.x}px`

    const bodyTop = document.body.getBoundingClientRect().top

    mouseEl.style.top = `${
        Math.abs(bodyTop) + mouse.y
    }px`
}
addCanvasRenderer(customMouseIcon)


// Test
// log canvasRenderers
console.log(canvasRenderers)
