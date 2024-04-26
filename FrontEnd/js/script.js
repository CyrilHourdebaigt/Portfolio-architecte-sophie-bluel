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
    modal.style.display = 'block';
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
}

// Fonction pour fermer une modale spécifique
//
// Fermer toutes les modales
// const closeModalById = function (modalId) {
//     const modal = document.getElementById(modalId);
//     if (modal) {
//         modal.style.display = 'none';
//         modal.setAttribute("aria-hidden", "true");
//         modal.removeAttribute("aria-modal");
//     }
// }

// Fermer toutes les modales
const closeAllModals = function () {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none !important';
        console.log(modal);
        //modal.setAttribute('aria-hidden', 'true');
        //modal.removeAttribute('aria-modal');
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

// Ajouter des écouteurs pour les boutons de fermeture dans les modales
let closebuttonModal = document.querySelectorAll(".closeModal")
console.log(closebuttonModal);
document.querySelectorAll(".closeModal").forEach(button => {
    button.addEventListener("click", function () {
        closeAllModals(); // Fermer toutes les modales
    });
});

// Gestion du bouton de retour de la modale 2 à la modale 1
let backModalButton = document.querySelector('.backModal');
if (backModalButton) {
    backModalButton.addEventListener("click", function (e) {
        e.preventDefault(); // Prévenir le comportement par défaut du bouton
        //closeModalById('modal2'); // Fermer la modal2 par ID
        openModal('modal1'); // Ouvrir la modal1 par ID
    });
}

// Supprimer un projet de la gallery

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
    if (event) {
        event.preventDefault();
    }
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
}