document.addEventListener("DOMContentLoaded", () => {
    
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('logged_in')) {
        const cleanUrl = window.location.href.split('?')[0]
        window.history.replaceState({}, document.title, cleanUrl)
        
        window.location.reload()
    }
    
    let themeButton = document.querySelector('.theme-toggler')

    themeButton.onclick = () => {
        themeButton.classList.toggle('dark-mode-on')
        document.body.classList.toggle('dark-theme')

        if (localStorage.getItem("theme") == "dark"){
            localStorage.setItem("theme", "light")
        }
        else{
            localStorage.setItem("theme", "dark")
        }
    }

    if (localStorage.getItem("theme") == "light"){
        themeButton.classList.remove('dark-mode-on')
        document.body.classList.remove("dark-theme")
    }
    else if (localStorage.getItem("theme") == "dark"){
        themeButton.classList.add("dark-mode-on")
        document.body.classList.add("dark-theme")
    }
    else {
        localStorage.setItem("theme", "light")
    }
        
})

// Nav
const menuButton = document.querySelector('.menu')
const menuIcon = document.querySelector("#menu-icon")
const navElements = document.querySelector('.nav')
const themeToggler = document.querySelector('.theme-toggler')

menuButton.onclick = () => {
    navElements.classList.toggle('open')
    if (navElements.classList.contains('open')) {
        themeToggler.style.display = 'none'
        menuIcon.classList.replace("fa-bars", "fa-close")
    }
    else{
        themeToggler.style.display = 'block'
        menuIcon.classList.replace("fa-close", "fa-bars")
    }
}

window.onscroll = () => {
    navElements.classList.remove('open')
}
