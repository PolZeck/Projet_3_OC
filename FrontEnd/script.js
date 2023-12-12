document.addEventListener("DOMContentLoaded", function () {
  const buttonsContainer = document.querySelector(".buttons");
  const gallery = document.querySelector('.gallery');
  let worksData = [];
  let categories = [];


  

  fetch('http://localhost:5678/api/categories')
  .then(response => response.json())
  .then(data => {
    categories = data;
    
    populateCategoriesSelect(); // Appel de la fonction pour peupler le select avec les catégories
  })
  .catch(error => console.error('Erreur lors de la récupération des catégories', error));

  function populateCategoriesSelect() {
    const categorySelect = document.getElementById('category');

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  }
  const photoForm = document.getElementById('photoForm');
photoForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Récupérer les valeurs du formulaire
  const title = document.getElementById('title').value;
  const selectedCategoryId = document.getElementById('category').value;
  const photoInput = document.getElementById('photo');
  const photoFile = photoInput.files[0];

  if (title && selectedCategoryId && photoFile) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('categoryId', selectedCategoryId);
    formData.append('photo', photoFile);

    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');

    // Envoi des données à l'API avec le token d'accès dans les en-têtes
    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` // Ajout du token dans les en-têtes
      },
      body: formData
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erreur lors de l\'envoi des données');
        }
      })
      .then(data => {
        console.log('Données envoyées avec succès :', data);
        photoForm.reset();
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
  } else {
    console.error('Veuillez remplir tous les champs du formulaire.');
  }
});

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


});


// adminPart


document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem('token');

  // Vérifie si l'utilisateur est connecté en vérifiant la présence du token
  if (token) {
    const galleryModal = document.getElementById('galleryModal');
    const closeModalSpan = document.querySelector('.close');
    const galleryPhotos = document.querySelector('.gallery-photos');
    const modalButton = document.querySelector('#modal');
    const filterSection = document.querySelector('.filter-container');
    const logoutButton = document.createElement('li');
    logoutButton.textContent = 'logout';
    logoutButton.style.cursor = 'pointer';
    const editionMode = document.getElementById('editionMode');
    let savedGalleryContent = '';
    const returnButton = document.querySelector('.returnButton')
    
    const addPhotoButton = document.getElementById('addPhotoButton');
    const uploadModal = document.getElementById('uploadModal');
    const closeButton = uploadModal.querySelector('.close');



    const loginButton = document.querySelector('#loginButton');

    if (loginButton) {
      loginButton.replaceWith(logoutButton);
    }

    if (filterSection) {
      filterSection.remove();
    }

    if (editionMode) {
      editionMode.style.display = 'block';
    }

    if (modalButton) {
      modalButton.style.display = 'block';
    }

    
    // Gestion de l'ouverture de la boîte modale
    modalButton.addEventListener('click', function () {
      galleryModal.style.display = 'block';
      loadGalleryPhotos(); // Charger les photos depuis l'API dans la galerie
    });

    // Gestion de la fermeture de la boîte modale
    closeModalSpan.addEventListener('click', function () {
      galleryModal.style.display = 'none';
    });

    // Fermer la boîte modale lorsque l'utilisateur clique en dehors de celle-ci
    window.addEventListener('click', function (event) {
      if (event.target === galleryModal) {
        galleryModal.style.display = 'none';
      }
    });

    // Fonction pour charger les photos depuis l'API dans la galerie
    async function loadGalleryPhotos() {
      try {
        const response = await fetch('http://localhost:5678/api/works');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des photos');
        }
        const worksData = await response.json();

        // Effacer les images précédentes
        galleryPhotos.innerHTML = '';

        worksData.forEach(work => {
          const imgContainer = document.createElement('div');
          const img = document.createElement('img');
          const deleteIcon = document.createElement('i');

          img.src = work.imageUrl;
          img.alt = work.title;
          img.classList.add('gallery-photo');

          deleteIcon.classList.add('fa', 'fa-trash', 'delete-icon');
          deleteIcon.style.color = '#ebebeb';
          deleteIcon.addEventListener('click', async () => {
            try {
              const token = localStorage.getItem('token');
              if (!token) {
                throw new Error('Token non trouvé');
              }

              const deleteResponse = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (deleteResponse.ok) {
                imgContainer.remove();
              }
            } catch (error) {
              console.error('Erreur lors de la suppression :', error);
            }
          });

          imgContainer.classList.add('img-container');
          imgContainer.appendChild(img);
          imgContainer.appendChild(deleteIcon);
          galleryPhotos.appendChild(imgContainer);
        });
      } catch (error) {
        console.error('Erreur :', error);
      }
    }

    addPhotoButton.addEventListener('click', function (event) {
      event.preventDefault();
      galleryModal.style.display = 'none';
      // Affichage de la deuxième modale
      uploadModal.style.display = 'block';
    });

    // Gestion de la fermeture de la deuxième modale
    closeButton.addEventListener('click', function () {
        uploadModal.style.display = 'none';
    });


    ////////////////////////////// 2nd MODAL

    // Récupérer les catégories depuis l'API
    
    // Fermeture de la deuxième modale si l'utilisateur clique en dehors de celle-ci
    window.addEventListener('click', function (event) {
        if (event.target === uploadModal) {
            uploadModal.style.display = 'none';
        }
    });

    returnButton.addEventListener('click', function (event) {
      event.preventDefault();
      galleryModal.style.display = 'block';
      uploadModal.style.display = 'none';
    });

    logoutButton.addEventListener('click', function () {
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });

    
   
  }
});


// connexionPart

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
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
        // Redirection vers index.html

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



