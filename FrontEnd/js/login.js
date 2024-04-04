function ajoutListenerEnvoyerLog() {
    const formulaireLog = document.querySelector(".loginform");
    formulaireLog.addEventListener("submit", function (event) {
        event.preventDefault();

        // Création de l'objet du Log
        const identifiants = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };

        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(identifiants);

        // Appel de fetch avec les information nécessaires
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        })
            .then(res => {
                 res.json()
            })
            .then(data => {
                console.log(data);
                if (data.status === 200) {
                    // Stockage du token dans le localStorage
                    window.localStorage.setItem("token", data.token);
                    // Redirection vers la page d'accueil
                    window.location.href = 'index.html';
                }
                if (data.status === 401) {
                    const inputError = document.querySelector(".buttonlog");
                    inputError.setCustomValidity("Non autorisé")
                }
                if (data.status === 404) {
                    const inputError = document.querySelector(".buttonlog");
                    inputError.setCustomValidity("Utilisateur non trouvé")
                }
            })


    });


}

ajoutListenerEnvoyerLog()