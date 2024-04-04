




fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(categories => {
        let objetTous = { id: 0, name: "Tous" };
        categories.unshift(objetTous);

        let filtresDiv = document.createElement("div");
        filtresDiv.classList.add("filtreProjet");

        let titreH2 = document.querySelector("#portfolio h2");
        titreH2.parentNode.insertBefore(filtresDiv, titreH2.nextElementSibling);

        let projets = document.querySelector(".filtreProjet");
        let uniqueCategories = new Set(categories.map(categorie => categorie.name))
        uniqueCategories.forEach(uniqueCategory => {
            let buttonfiltre = document.createElement("button");
            buttonfiltre.classList.add("filtreBouton");
            buttonfiltre.innerHTML = uniqueCategory

            projets.appendChild(buttonfiltre);
        })

        let buttonfiltres = document.getElementsByClassName('filtreBouton')
        for (let button of buttonfiltres ) {
            for (let category of categories) {
                if (category.name === button.innerText) {
                    button.setAttribute("category-id", category.id)
                }
            }
        }
    })

fetch("http://localhost:5678/api/works")
    .then(res => res.json())
    .then(works => {

        let projets = document.querySelector(".gallery")

        for (let work of works) {
            let figureprojet = document.createElement('figure')

            figureprojet.setAttribute("category-id", work.categoryId);

            let titre = document.createElement("h4")
            titre.textContent = work.title
            let image = document.createElement("img")
            image.src = work.imageUrl

            figureprojet.appendChild(image)
            figureprojet.appendChild(titre)

            projets.appendChild(figureprojet)
        }
    }).then ( () => {
        filterWorksByCategory();
    })

function filterWorksByCategory() {
    let buttonfiltres = document.getElementsByClassName('filtreBouton')
    let works = document.querySelectorAll("figure")

    for (let button of buttonfiltres) {
        button.addEventListener("click", (event) => {
            let monBouton = event.target
            let categorieIdDeMonBouton = button.getAttribute("category-id")
            works.forEach(function(work) {
                let workCategoryId = work.getAttribute("category-id")
                if (workCategoryId == categorieIdDeMonBouton) {
                    work.style.display = 'block'; // Afficher l'élément
                } else if (categorieIdDeMonBouton === "0") {
                    work.style.display = 'block'; // Si j'appuie sur Tous Affiche tous car tous == 0
                } else {
                    work.style.display = 'none'; // Masquer l'élément
                }
            });
        })
    }
}