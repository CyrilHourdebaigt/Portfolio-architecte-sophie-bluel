fetch("http://localhost:5678/api/works")
    .then(res => res.json())
    .then(works => {
        let projets = document.querySelector(".gallery")

        for (let work of works) {
            let figureprojets = document.createElement('figure')
        
            let titre = document.createElement("h4")
            titre.textContent = work.title
            let image = document.createElement("img")
            image.src = work.imageUrl
        
            figureprojets.appendChild(image)
            figureprojets.appendChild(titre)
            
            projets.appendChild(figureprojets)
    }})
