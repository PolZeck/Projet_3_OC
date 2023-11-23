document.addEventListener("DOMContentLoaded", function () {
	  const buttonsContainer = document.querySelector(".buttons");
	  const gallery = document.querySelector('.gallery');
	  let worksData = [];
	  let categories = [];

	// Récupère les catégories depuis l'API
	  fetch('http://localhost:5678/api/categories')
		    .then(response => response.json())
		    .then(data => {
			      categories = data;
			      createFilterButtons(); // Crée les boutons de filtre après avoir récupéré les catégories
		})
		    .catch(error => console.error('Erreur lors de la récupération des catégories', error));

	// Récupère les données des travaux depuis l'API
	  fetch('http://localhost:5678/api/works')
		    .then(response => response.json())
		    .then(data => {
			      worksData = data;
			      displayGallery(worksData); // Affiche la galerie après avoir récupéré les travaux
		    })
		    .catch(error => console.error('Erreur lors de la récupération des travaux', error));

	// Fonction pour afficher la galerie
	  function displayGallery(works) {
		    gallery.innerHTML = "";
		    works.forEach(work => {
			      const figure = document.createElement('figure');
			      const img = document.createElement('img');
			      const figcaption = document.createElement('figcaption');

			  img.src = work.imageUrl;
			  img.alt = work.title;
			  figcaption.textContent = work.title;

			  figure.appendChild(img);
			  figure.appendChild(figcaption);

			  gallery.appendChild(figure);
		});
	}

	// Fonction pour créer les boutons de filtre
	  function createFilterButtons() {
		    addButton("Tous", null); // Ajoute le bouton "Tous"

		    categories.forEach(category => {
			      addButton(category.name, category.id); // Ajoute un bouton pour chaque catégorie
		});
	}

	// Fonction pour ajouter un bouton de filtre
	  function addButton(text, categoryId) {
		    const button = document.createElement("button");
		    button.textContent = text;
		    button.addEventListener("click", () => filterGallery(categoryId)); // Ajoute un gestionnaire d'événements pour filtrer au clic
		    buttonsContainer.appendChild(button);
	}

	// Fonction pour filtrer la galerie en fonction de la catégorie sélectionnée
	  function filterGallery(categoryId) {
		    const filteredWorks = (categoryId === null) ? worksData : worksData.filter(work => work.category.id === categoryId);
		    displayGallery(filteredWorks);
	}
});

document.getElementById('connectBtn').addEventListener('click', function() {
  // Récupération des valeurs des champs email et mot de passe
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Vérification des identifiants et mots de passe
  if (email === 'sophie.bluel@test.tld' && password === 'S0phie') {
      // Si les identifiants sont corrects, redirection vers modif.html
      window.location.href = 'modif.html';
  } else {
      // Si les identifiants sont incorrects, affichage du message d'erreur
      alert('Erreur dans l’identifiant ou le mot de passe');
  }
});