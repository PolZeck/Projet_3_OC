document.addEventListener("DOMContentLoaded", function () {
  const buttonsContainer = document.querySelector(".buttons");
  const gallery = document.querySelector('.gallery');
  let worksData = [];
  let categories = [];

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
    addButton("Tous", null);

    categories.forEach(category => {
      addButton(category.name, category.id);
    });
  }

  // Fonction pour ajouter un bouton de filtre
  function addButton(text, categoryId) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", () => filterGallery(categoryId));
    buttonsContainer.appendChild(button);
  }

  // Fonction pour filtrer la galerie en fonction de la catégorie sélectionnée
  function filterGallery(categoryId) {
    const filteredWorks = (categoryId === null) ? worksData : worksData.filter(work => work.category.id === categoryId);
    displayGallery(filteredWorks);
  }

  // Récupère les catégories depuis l'API
  fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
      categories = data;
      createFilterButtons();
    })
    .catch(error => console.error('Erreur lors de la récupération des catégories', error));

  // Récupère les données des travaux depuis l'API
  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
      worksData = data;
      displayGallery(worksData);
    })
    .catch(error => console.error('Erreur lors de la récupération des travaux', error));

  // Vérifier si l'utilisateur est connecté lors du chargement de la page
  const loggedIn = localStorage.getItem('loggedIn');
  if (loggedIn !== 'true') {
    const filterSection = document.querySelector('.filter-container'); // Utilise .filter-container au lieu de .filter
    if (filterSection) {
      filterSection.style.display = 'block'; // Affiche la partie .filter-container si l'utilisateur n'est pas connecté
    }
  }
});

document.getElementById('connectBtn').addEventListener('click', async function () {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('errorMessage');

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        // Redirection vers index.html
        window.location.href = 'index.html';

        // Suppression de la partie filter sur la page index.html
        localStorage.setItem('loggedIn', 'true'); // Enregistrer dans localStorage que l'utilisateur est connecté
      }
    } else {
      errorMessage.style.display = 'block';
      emailInput.style.border = '2px solid red';
      passwordInput.style.border = '2px solid red';
    }
  } catch (error) {
    console.error('Erreur :', error);
  }
});
