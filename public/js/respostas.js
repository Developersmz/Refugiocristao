document.addEventListener("DOMContentLoaded", () => {
    
    const searchIcon = document.querySelector("#search-icon")
    const searchSpot = document.querySelector(".search-spot")
    const searchForm = document.querySelector(".search-form")

    searchSpot.addEventListener("click", ( ) => {
        // Ativar formulario de busca
        searchForm.classList.toggle("active")

        // Atualiza o icone com base no estado do formulario
        if (searchForm.classList.contains("active")) {
            searchIcon.classList.replace("fa-search", "fa-close")
        } else {
            searchIcon.classList.replace("fa-close", "fa-search")
        }
    })

})

// Mostrar respostas ao pesquisar
const inputSearch = document.querySelector('#search-box')
const suggestionsBox = document.querySelector('#suggestions');
const labelSearchBtn = document.querySelector('#label-search')
const answers = document.querySelector('.respostas')
const answer = answers.querySelectorAll('.answer')

// Lista de dados para autocomplete e sinônimos
const data = [
    "oração", "fé", "esperança", "amor", "eleição", 
    "Abominar", "Aborto", "Abstinência", "Aceitar Jesus", "Admiração", 
    "Adultério", "Adversidade", "Aflição", "Ajuda ao próximo", "Alegria", 
    "Aliança com Deus", "Alma", "Amar a Deus", "Ambição", "Amizade", 
    "Amor", "Amor ao Próximo", "Amor de Casal", "Amor Próprio", "Angústia", 
    "Animais", "Ânimo", "Ano Novo", "Ansiedade", "Anticristo", 
    "Aparência", "Apostasia", "Arrebatamento", "Arrependimento", "Astrologia", 
    "Ateísmo", "Atitude", "Autocontrole", "Autoestima", "Autoridade", 
    "Beber Álcool", "Beleza", "Bem Aventurado", "Batismo no Espírito Santo", 
    "Benção de Deus", "Benevolência", "Benignidade", "Bíblia, Ensino, Doutrina", 
    "Bispos", "Boas Novas", "Bom ânimo", "Bondade", "Buscar a Deus", 
    "Caridade", "Casa de Deus", "Céu", "Chamado de Deus", "Ciúmes", 
    "Cobiça", "Compaixão", "Conversão", "Compreensão", "Comunhão com Deus", 
    "Concupiscência", "Confiar em Deus", "Confortar", "Consciência", "Contentamento", 
    "Cordeiro de Deus", "Corpo, Templo de Deus", "Crianças", "Cuidado de Deus", 
    "Demônios", "Dependência de Deus", "Dedicação", "Depressão", "Desânimo", 
    "Descansar em Deus", "Desobediência", "Desonestidade", "Denominação", 
    "Deus", "Deus do Impossível", "Deus é Fiel", "Diabo", "Dinheiro", 
    "Disciplina", "Dispensações", "Dívidas", "Divindade de Jesus Cristo", 
    "Divórcio", "Dízimos e Ofertas", "Doença, Enfermidade", "Domínio Próprio", 
    "Dons", "Dons Espirituais", "Drogas", "Dúvida", "Edificação", 
    "Ensinar as Crianças", "Esperança em Deus", "Espiritismo", "Espírito", 
    "Espírito Santo", "Evangelho", "Exaltação a Deus", "Exortação", 
    "Falsos Profetas", "Fé", "Feitiçaria", "Felicidade", "Fidelidade", 
    "Filho de Deus", "Filho do Homem", "Filhos", "Fornicação", "Galardão", 
    "Glorificação", "Grande Tribulação", "Guardar o Coração", "Heresia", 
    "Hipocrisia", "Homossexualidade", "Honrar os Pais", "Humilhação", 
    "Idolatria", "Igreja", "Imoralidade", "Impurezas", "Inferno", 
    "Inimigos", "Jejum", "Jesus Cristo", "Jogos de Azar", "Juízo", 
    "Juízo Final", "Julgamento", "Justiça de Deus", "Justiça Imputada", 
    "Justificação", "Juventude, Jovens", "Legalismo", "Lei de Deus", 
    "Liberdade", "Línguas (Falar em Línguas)", "Livre-Arbítrio", "Longanimidade", 
    "Loucura", "Louvor e Adoração", "Luxúria, Lascívia", "Luz", "Mansidão", 
    "Marca da Besta", "Masturbação", "Marido e Mulher", "Meditação", 
    "Mentiras", "Misericórdia", "Mulher", "Mundo", "Nascer De Novo", 
    "Natal", "Necessidades", "Nova Criatura", "Obediência", "Obediência a Deus", 
    "Obras", "Onipotência de Deus", "Oportunidades", "Oração", "Ouvir a Voz de Deus", 
    "Paraíso", "Paciência", "Palavra de Deus", "Palavra Viva", "Papel da Mulher", 
    "Pastor", "Pastorear", "Paz", "Pecado", "Pensamentos", 
    "Perdão", "Perseguição", "Perseverança", "Profecia, Profeta", "Propósito", 
    "Prosperidade", "Prostituição", "Provação", "Providência de Deus", "Purificação", 
    "Quebrantamento", "Redentor", "Reino de Deus", "Religião", "Reunir-se ao nome do Senhor", 
    "Respeito", "Ressurreição", "Reencarnação", "Revelação", "Riqueza", 
    "Sabedoria", "Sacerdócio", "Salvação", "Salvador", "Santificação", 
    "Saúde", "Sentido da Vida", "Solidão", "Sonhos", "Submissão", 
    "Suicídio", "Superstição", "Suplicar", "Temor de Deus, Temer a Deus", "Tentação", 
    "Tesouros", "Testemunhar", "Traição", "Tribulação", "Trindade", 
    "Tristeza", "Unção", "Vaidade", "Vaso", "Verdade", 
    "Vício", "Vida Eterna", "Volta de Jesus", "Zelo"
];

const synonyms = {
    "oração": ["rezar", "prece", "clamar", "intercessão", "súplica", "rogativa"],
    "fé": ["crença", "confiança", "esperança", "convicção", "segurança", "certeza"],
    "esperança": ["otimismo", "fé", "expectativa", "confiança", "positividade", "ânimo"],
    "amor": ["paixão", "carinho", "afeto", "ternura", "compaixão", "dedicação"],
    "eleição": ["escolha", "seleção", "votação", "decisão", "opção", "nomeação"],
    "perdão": ["remissão", "absolvição", "indulgência", "misericórdia", "compaixão"],
    "justiça": ["equidade", "retidão", "imparcialidade", "honestidade", "moralidade"],
    "paz": ["serenidade", "tranquilidade", "harmonia", "calma", "sossego", "reconciliação"],
    "bondade": ["benevolência", "generosidade", "altruísmo", "caridade", "afabilidade"],
    "virtude": ["qualidade", "moralidade", "retidão", "integridade", "mérito"],
    "glória": ["honra", "renome", "prestígio", "esplendor", "majestade", "celebração"],
    "sabedoria": ["conhecimento", "entendimento", "prudência", "discernimento", "perspicácia"],
    "redenção": ["salvação", "resgate", "libertação", "remissão", "reparação"],
    "gratidão": ["agradecimento", "reconhecimento", "apreço", "obrigação", "contentamento"],
    "benção": ["graça", "favor", "proteção", "aprovação", "benefício"],
    "fortaleza": ["força", "resistência", "vigor", "energia", "coragem"],
    "humildade": ["modéstia", "simplicidade", "despretensão", "submissão", "docilidade"],
    "compaixão": ["piedade", "misericórdia", "altruísmo", "empatia", "benevolência"],
    "louvor": ["elogio", "exaltação", "glorificação", "veneração", "homenagem"],
    "perseverança": ["persistência", "resiliência", "determinação", "firmeza", "constância"],
    "salvação": ["redenção", "libertação", "proteção", "resgate", "remissão"],
    "promessa": ["compromisso", "voto", "juramento", "pacto", "garantia"],
    "caminho": ["trilha", "rota", "via", "passagem", "direção"],
    "vida": ["existência", "sobrevivência", "ser", "alma", "essência"],
    "verdade": ["realidade", "fato", "autenticidade", "sinceridade", "veracidade"],
    "graça": ["favor", "benção", "benevolência", "misericórdia", "gentileza"]
};


// Realçar texto encontrado
const highlightText = (text, query) => {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, `<mark>$1</mark>`);
};

// Função de debounce para otimizar a pesquisa
let debounceTimeout;
const debounce = (func, delay) => {
    return (...args) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func(...args), delay);
    };
};

// Pesquisa e destaque nos resultados
const searchAnswer = () => {
    const val = inputSearch.value.toLowerCase();
    const relatedWords = synonyms[val] || [val];
    const regex = new RegExp(relatedWords.join('|'), 'i');

    answer.forEach(user => {
        let name = user.querySelector("a");
        let text = name.textContent;

        if (regex.test(text.toLowerCase())) {
            name.innerHTML = highlightText(text, val);
           user.style.display = 'flex'
        } else {
            user.style.display = 'none'
        }
    });
};

// Sugestões automáticas
inputSearch.addEventListener("input", () => {
    const query = inputSearch.value.toLowerCase();
    suggestionsBox.innerHTML = '';

    if (query) {
        const matches = data.filter(item => item.toLowerCase().includes(query));
        matches.forEach(match => {
            const li = document.createElement('li');
            li.textContent = match;
            li.addEventListener("click", () => {
                inputSearch.value = match;
                suggestionsBox.innerHTML = '';
                searchAnswer();
            });
            suggestionsBox.appendChild(li);
        });
    }
});

// Vincular a pesquisa ao input com debounce
inputSearch.addEventListener("keyup", debounce(searchAnswer, 300));


