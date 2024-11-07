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
    /**
     * default: the mouse will outline the element<br>
     * arrow-down: the mouse will be an arrow pointing down<br>
     * like: the mouse will be a heart
     * @type {"default" | "arrow-down" | "like" }
     */
    hoverAnimation: 'default',

    // Direction of the mouse in Radians
    direction: 0,
    // Speed of the mouse
    speed: 0,

    transformBaseCSS: "",
}

window.addEventListener('pointermove', (e) => {
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
// This needs to be a variable because it is used in SOTD as well
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
        if (
            el.dataset.hoveranimationicon &&
            (ev?.relatedTarget?.dataset?.hoveranimationicon == el.dataset.hoveranimationicon)
        ) return

        mouse.hover = false
        mouse.hoverEl = null
        // mouseEl.classList.remove('hovering')
        mouse.hoverElCenterReached = false
        mouseEl.className = 'nomobile'
        if (mouse.hoverAnimation == "default") {
            const rect = el.getBoundingClientRect()
            mouse.x = rect.left
            mouse.y = rect.top + Math.abs(document.body.getBoundingClientRect().top)
        }

        mouse.hoverAnimation = 'default'
    })
}
document.querySelectorAll('.mouse-hover, [target="_blank"], [regu]').forEach(mouseHoverHandler)

function lerp(a, b, t) {
    return a + (b - a) * t
}

let t = 0.02
/**
 * Every frame it interpolates the mouse position
 */
function mousePositionInterpolation() {
    const mouseActualPosition = Math.abs(document.body.getBoundingClientRect().top) + mouse.currentY

    if (
        Math.abs(mouse.x - mouse.currentX) < 1 && Math.abs(mouse.y - mouseActualPosition) < 1
    ) return
    mouse.direction = Math.atan2(mouse.y - mouse.y, mouse.x - mouse.x)
    mouse.speed = Math.hypot(mouse.x - mouse.x, mouse.y - mouse.y)

    mouse.x = lerp(mouse.x, mouse.currentX, t)
    mouse.y = lerp(mouse.y, mouseActualPosition, t)
}

addCanvasRenderer(mousePositionInterpolation)

const mouseEl = document.querySelector('[mouse]')
const fastMouseEl = mouseEl.querySelector("[data-type=\"fast\"]")
mouse.transformBaseCSS = getComputedStyle(mouseEl).transform

// Custom Mouse Icon - NOT USING CANVAS
// This shouldn't be in the Canvas Renderers array, but it is there to be executed every frame
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

    if ((mouse.x < 20 || mouse.y < 20) || (mouse.y > (window.innerHeight + Math.abs(document.body.getBoundingClientRect().top)) - 20 || mouse.x > window.innerWidth - 20)) {
        mouseEl.classList.add('hidden')
    } else {
        mouseEl.classList.remove('hidden')
    }

    // if user is AFK, apply a cos and sin function to the mouse
    if (userIsAFK && !mouse.hover) {
        mouseEl.style.left = `${
            mouse.x + Math.cos(Date.now() / 500) * 25
        }px`

        mouseEl.style.top = `${
            mouse.y - Math.sin(Date.now() / 500) * 25
        }px`
    } else {
        mouseEl.style.left = `${mouse.x}px`

        mouseEl.style.top = `${
            mouse.y
        }px`
    }

    let fastMouseX = mouse.currentX - mouse.x;
    let fastMouseY = Math.abs(document.body.getBoundingClientRect().top) + mouse.currentY - mouse.y;

    fastMouseEl.style.top = `${fastMouseY}px`
    fastMouseEl.style.left = `${fastMouseX}px`
}
addCanvasRenderer(customMouseIcon)
