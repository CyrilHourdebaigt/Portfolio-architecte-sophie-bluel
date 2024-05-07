fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(categories => {
        let objetTous = { id: 0, name: "Tous" };
        categories.unshift(objetTous);

        let filtresDiv = document.createElement("div");
        filtresDiv.classList.add("filtreProjet");

        let titreH2 = document.querySelector("#portfolio h2");
        if (titreH2) {
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
        }
    })
    .then(() => gererInterfaceLogInOrLogOut())

fetch("http://localhost:5678/api/works")
    .then(res => res.json())
    .then(works => {

        let projets = document.querySelector(".gallery")
        if (projets) {
            for (let work of works) {
                let figureprojet = document.createElement('figure')

                figureprojet.setAttribute("category-id", work.categoryId);
                figureprojet.id = work.id
                let titre = document.createElement("h4")
                titre.textContent = work.title
                let image = document.createElement("img")
                image.src = work.imageUrl

                figureprojet.appendChild(image)
                figureprojet.appendChild(titre)

                projets.appendChild(figureprojet)
            }
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
                    // Afficher l'élément
                    work.style.display = 'block'; 
                } else if (categorieIdDeMonBouton === "0") {
                    // Si j'appuie sur Tous Affiche tous car tous == 0
                    work.style.display = 'block'; 
                } else {
                    // Masquer l'élément
                    work.style.display = 'none'; 
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

    // si tu es connecté 
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
        console.log(logoutLink);
        logoutLink.style.display = "none";
        loginLink.style.display = "inline";
        barreBlack.style.display = "none";
        if (btnmodifier !== null) {
            btnmodifier.style.display = "none" ;
        }
    }

    // Ajout d'un événement pour le lien de déconnexion
    logoutLink.addEventListener("click", function (e) {
        e.preventDefault(); // Empêche le comportement par défaut du lien
        // Supprimer le token du localStorage
        localStorage.removeItem("token");
        // Redirection vers la page de login
        window.location.href = "login.html";
    });
}

// Fenêtre modale

const openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Vérifie si la modale nécessite le chargement des données avant de s'afficher
        if (modalId === "modal1") {
            fetch("http://localhost:5678/api/works")
                .then(res => res.json())
                .then(works => {
                    let projetsModal = document.querySelector(".contenuModal");
                    projetsModal.innerHTML = ''; // Nettoyer les contenus précédents
                    works.forEach(work => {
                        let figure = document.createElement('figure');
                        figure.setAttribute("category-id", work.categoryId);
                        figure.setAttribute("work-id", work.id);
                        figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">`;

                        let deleteButton = document.createElement("button");
                        deleteButton.classList.add("delete-button");
                        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                        deleteButton.onclick = () => deleteWork(work.id, figure);
                        figure.appendChild(deleteButton);

                        projetsModal.appendChild(figure);
                    });
                    // Afficher la modale après le chargement des données
                    showModal(modal);
                })
                .catch(err => {
                    console.error('Error loading the works: ', err);
                    alert("Failed to load projects. Please try again.");
                });
        } else {
            // Pour les autres modales qui ne nécessitent pas de chargement dynamique
            showModal(modal);
        }
    }
}

// Fonction pour montrer la modale
const showModal = function (modal) {
    modal.style.display = 'flex';
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
}

// Fermer les modales avec l'id
const closeModalById = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute("aria-hidden", "true");
        modal.removeAttribute("aria-modal");
    }
}

// Fermer toutes les modales
const closeAllModals = function () {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
    });
}

// Ajout d'écouteurs pour les boutons ou liens d'ouverture des modales
document.querySelectorAll("[data-toggle='modal']").forEach(element => {
    element.addEventListener("click", function (e) {
        const modalId = element.getAttribute('data-target');
        e.preventDefault(); // Empêcher le comportement par défaut du lien
        openModal(modalId);
    });
});

// Ajout des écouteurs pour les boutons de fermeture dans les modales
let closebuttonModal = document.querySelectorAll(".closeModal")
document.querySelectorAll(".closeModal").forEach(button => {
    button.addEventListener("click", function () {
        closeAllModals(); // Fermer toutes les modales
    });
});

// Gestion du bouton de retour de la modale 2 à la modale 1
let backModalButton = document.querySelector('.backModal');
if (backModalButton) {
    backModalButton.addEventListener("click", function (e) {
        e.preventDefault(); // Prévenir le comportement par défaut du boutton
        closeModalById('modal2'); // Fermer la modal2 par ID
        openModal('modal1'); // Ouvrir la modal1 par ID
    });
}

// Supprimer un projet de la gallery

function deleteWork(workId, figureElement) {

    // Confirmer avant la suppression
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

                // Suppression de l'élément de la page d'accueil aussi
                let figureHome = document.querySelector(`.gallery figure[id ="${workId}"]`);
                figureHome.remove();
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
}

let uploadbtn = document.querySelector('.upload-btn')
if (uploadbtn !== null) {
    uploadbtn.addEventListener("click", function () {
        document.getElementById('imageUpload').click();
    })
}

// Affichage de l'image à la place du logo

let imageUpload = document.getElementById('imageUpload')
if (imageUpload !== null) {
    imageUpload.addEventListener('change', function (event) {

        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {

                // Sélection du conteneur qui à la classe upload-icon
                const uploadIconContainer = document.querySelector('.upload-icon');
                if (uploadIconContainer) {
                    uploadIconContainer.style.display = 'none'; // Cacher les éléments à l'intérieur
                }
                // Affichage image
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
}

// Ajout d'un projet à la gallery

let photoForm = document.getElementById('photoForm')
if (photoForm !== null) {
    photoForm.addEventListener('submit', function (e) {
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
                // La réponse inclut un champ 'imageUrl' avec l'URL de l'image téléchargée
                const imageUrl = data.imageUrl;

                // Création nouvelle figure et image dans gallery
                const gallery = document.querySelector('.gallery');
                const figure = document.createElement('figure');

                // Ajout l'id  et categorie à la figure
                figure.id = data.id
                category.id = data.categoryId

                // Ajout titre
                const newtitle = document.createElement("h4")
                newtitle.textContent = data.title

                // Ajout image
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'Nouvelle image ajoutée';

                // Ajoutez l'image, le titre et la figure 
                figure.appendChild(img);
                figure.appendChild(newtitle);
                gallery.appendChild(figure);

                // Fermer la modale
                closeAllModals();

            })
            .catch(error => {
                // Affichez un message d'erreur
                console.error('Il y a eu un problème avec l’opération fetch: ' + error.message);
            });
    });
}