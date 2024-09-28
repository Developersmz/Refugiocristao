document.addEventListener("DOMContentLoaded", () => {
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
menuButton = document.querySelector('.menu')

menuButton.onclick = () => {
    document.querySelector('.nav').classList.toggle('open')
    if (document.querySelector('.nav').classList.contains('open')) {
        document.querySelector('.theme-toggler').style.display = 'none'
    }
    else{
        document.querySelector('.theme-toggler').style.display = 'block'
    }
}

window.onscroll = () => {
    document.querySelector('.nav').classList.remove('open')
}
