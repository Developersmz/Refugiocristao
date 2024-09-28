document.addEventListener("DOMContentLoaded", () => {
    
    document.querySelector('.search-spot').addEventListener("click", () => {
        document.querySelector('.search-form').classList.toggle('active')
    })

    window.onscroll = () => {
        document.querySelector('.search-form').classList.remove('active')
    }

})

// Mostrar respostas ao pesquisar

const inputSearch = document.querySelector('#search-box')
const labelSearchBtn = document.querySelector('#label-search')
const answers = document.querySelector('.respostas')
const answer = answers.querySelectorAll('.answer')

const searchAnswer = () => {
    const val = inputSearch.value.toLowerCase()
    answer.forEach(user => {
        let name = user.querySelector("a").textContent.toLowerCase()
        if (name.indexOf(val) != -1){
            user.style.display = 'flex'
        }
        else {
            user.style.display = 'none'
        }
    })
}

inputSearch.addEventListener("keyup", searchAnswer)
