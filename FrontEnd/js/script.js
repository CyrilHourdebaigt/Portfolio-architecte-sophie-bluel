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
        for (let button of buttonfiltres) {
            for (let category of categories) {
                if (category.name === button.innerText) {
                    button.setAttribute("category-id", category.id)
                }
            }
        }
    })
    .then(() => gererInterfaceLogInOrLogOut())

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

    }).then(() => {
        filterWorksByCategory();
    })

function filterWorksByCategory() {
    let buttonfiltres = document.getElementsByClassName('filtreBouton')
    let works = document.querySelectorAll("figure")

    for (let button of buttonfiltres) {
        button.addEventListener("click", (event) => {
            let monBouton = event.target
            let categorieIdDeMonBouton = button.getAttribute("category-id")
            works.forEach(function (work) {

                if (work.closest('#introduction')) {
                    return; // Empêche de filtrer la figure dans section "introduction"
                }
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

function gererInterfaceLogInOrLogOut() {

    // Récupération du token
    const token = localStorage.getItem("token");
    const loginLink = document.getElementById("loginLink");
    const logoutLink = document.getElementById("logoutLink");
    const barreBlack = document.querySelector(".barreBlack");
    const btnmodifier = document.querySelector(".btnmodifier");
    const titreProjet = document.getElementById('titreProjet');
    const barreFiltresProjet = document.querySelector(".filtreProjet");
    const header = document.querySelector("header");

    if (token) {
        // Si un token est présent, afficher le logout et masquer le login
        logoutLink.style.display = "inline";
        loginLink.style.display = "none";

        // Afficher la barre noire en haut de la page
        barreBlack.style.display = "block";

        // Afficher le bouton modifier
        btnmodifier.style.display = 'inline-block';
        titreProjet.insertAdjacentElement('beforeend', btnmodifier);

        // Masquer les filtres
        barreFiltresProjet.style.display = "none";
        header.style.marginTop = "70px";

    } else {
        // Si aucun token n'est présent, afficher le login et masquer le logout, la barre noir et le bouton modifier
        logoutLink.style.display = "none";
        loginLink.style.display = "inline";
        barreBlack.style.display = "none";
        btnmodifier.style.display = "none";
    }

    // Ajoutez un gestionnaire d'événements pour le lien de déconnexion
    logoutLink.addEventListener("click", function (e) {
        e.preventDefault(); // Empêche le comportement par défaut du lien
        // Supprimer le token du localStorage
        localStorage.removeItem("token");
        // Rediriger vers la page de login ou tout autre comportement que vous souhaitez
        window.location.href = "login.html";
    });
}

// Fenêtre modale

let modal = null

const openModal = function (e, modalId) {
    e.preventDefault()

    const target = document.getElementById(modalId);
    if (target) {
        target.style.display = null;
        target.setAttribute("aria-hidden", "false");
        target.setAttribute("aria-modal", "true");
        modal = target;
        modal.addEventListener("click", function (event) { closeModal(event, modalId); });
        modal.querySelector(".closeModal").addEventListener("click", function (event) { closeModal(event, modalId); });
        modal.querySelector(".modalStop").addEventListener("click", stopPropagation);
    }

    if (openModal) {
        fetch("http://localhost:5678/api/works")
            .then(res => res.json())
            .then(works => {

                let projetsModal = document.querySelector(".contenuModal");
                projetsModal.innerHTML = ''; // Effacer les anciens contenus du modal

                for (let work of works) {
                    let figureprojetmodal = document.createElement('figure');

                    figureprojetmodal.setAttribute("category-id", work.categoryId);
                    figureprojetmodal.setAttribute("work-id", work.id);

                    let image = document.createElement("img")
                    image.src = work.imageUrl

                    let deleteButton = document.createElement("button");
                    deleteButton.classList.add("delete-button");
                    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Icône de poubelle FontAwesome
                    deleteButton.onclick = function () { deleteWork(work.id, figureprojetmodal); }; // Associez la fonction de suppression avec l'id du travail et la figure à supprimer


                    figureprojetmodal.appendChild(image)
                    figureprojetmodal.appendChild(deleteButton); // Ajoutez le bouton de suppression à la figure

                    projetsModal.appendChild(figureprojetmodal)
                }
            })
    }
}

const closeModal = function (e, modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", function (event) { closeModal(event, modalId); });
    modal.querySelector(".closeModal").removeEventListener("click", function (event) { closeModal(event, modalId); });
    modal.querySelector(".modalStop").removeEventListener("click", stopPropagation);
}

document.querySelectorAll(".btnmodifier").forEach(a => {
    a.addEventListener("click", function (e) {
        openModal(e, 'modal1');
    });
});

document.querySelector(".btnModal").addEventListener("click", function (e) {
    openModal(e, 'modal2');
});

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll(".btnmodifier").forEach(a => {
    a.addEventListener("click", openModal)
})

// Navigation de la modale 2 à la modale 1
document.querySelector(".backModal").addEventListener("click", function (e) {
    // Fermez la seconde modale
    closeModal(e, 'modal2');
    // Ouvrez la première modale
    openModal(e, 'modal1');
});

function deleteWork(workId, figureElement) {
    // Confirmer avec l'utilisateur avant la suppression
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        console.log("Vous devez être connecté pour supprimer un projet.");
        return;
    }

    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                // Suppression de l'élément de la modale
                figureElement.remove();
                console.log(`Le projet avec l'ID ${workId} a été supprimé.`);
            } else if (response.status === 401) {
                // Message si l'utilisateur n'est pas autorisé à supprimer le projet
                console.error("Action non autorisée. Assurez-vous d'être connecté avec les bonnes autorisations.");
            } else {
                // Message pour les autres réponses HTTP non réussies
                console.error(`Erreur lors de la suppression du projet: ${response.statusText}`);
            }
        })
        .catch(error => {
            // Message pour les erreurs de connexion
            console.error("Erreur lors de l'appel API:", error);
        });
        e.preventDefault();
}

document.querySelector('.upload-btn').addEventListener('click', function () {
    document.getElementById('imageUpload').click();
});

document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {

            // Sélectionnez le conteneur qui a la classe upload-icon
            const uploadIconContainer = document.querySelector('.upload-icon');
            if (uploadIconContainer) {
                uploadIconContainer.style.display = 'none'; // Cacher les éléments à l'intérieur
            }
            // Afficher l'image
            const imagePreview = document.getElementById('previewImage');
            if (imagePreview) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
        };

        reader.onerror = function (e) {
            console.error("Erreur de FileReader: ", e);
        };

        reader.readAsDataURL(file); // Commence la lecture du fichier
    }
});

document.getElementById('photoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    console.log(e.target);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // La réponse de l'API inclut un champ 'imageUrl' avec l'URL de l'image téléchargée
            const imageUrl = data.imageUrl;

            // Créez une nouvelle figure et une image dans votre galerie
            const gallery = document.querySelector('.gallery');
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Nouvelle image ajoutée';

            // Ajoutez l'image à la figure et la figure à la galerie
            figure.appendChild(img);
            gallery.appendChild(figure);
        })
        .catch(error => {
            console.error('Il y a eu un problème avec l’opération fetch: ' + error.message);
            // Affichez un message d'erreur à l'utilisateur ici si nécessaire
        });
});