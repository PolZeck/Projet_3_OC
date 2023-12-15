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

    


    ////////////////////////////// 2nd MODAL

    // Gestion de la fermeture de la deuxième modale
    closeButton.addEventListener('click', function () {
      uploadModal.style.display = 'none';
      document.getElementById('preview').innerHTML = '';
      const photoFileContent = document.querySelector('.photoFileContent');
      photoFileContent.style.display = 'block';
    });

    // Fermeture de la deuxième modale si l'utilisateur clique en dehors de celle-ci
    window.addEventListener('click', function (event) {
      if (event.target === uploadModal) {
          uploadModal.style.display = 'none';
          document.getElementById('preview').innerHTML = '';
          const photoFileContent = document.querySelector('.photoFileContent');
          photoFileContent.style.display = 'block';
      }
      
  });

    // Retour sur la page modale d'avant lors du clique sur la fleche
  returnButton.addEventListener('click', function (event) {
    event.preventDefault();
    galleryModal.style.display = 'block';
    uploadModal.style.display = 'none';
    document.getElementById('preview').innerHTML = '';
    const photoFileContent = document.querySelector('.photoFileContent');
    photoFileContent.style.display = 'block';
  });

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
  
    // Gestion miniaturiser photo 

    const photoInput = document.getElementById('photo');
    const preview = document.getElementById('preview');
    const photoFileContent = document.querySelector('.photoFileContent');
        
    photoInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
              const img = document.createElement('img');
              img.src = e.target.result;
              img.alt = file.name;
              img.classList.add('thumbnail');
              img.style.maxWidth = '100px'; 
              img.style.maxHeight = '100px'; 
              preview.appendChild(img);

              // Cacher la partie photoFileContent
              if (photoFileContent) {
                  photoFileContent.style.display = 'none';
              }
          };
          reader.readAsDataURL(file);
      }
  });


    // Gestion formulaire envoi

    const form = document.getElementById('photoForm');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        
        const token = localStorage.getItem('token');

        // Récupérer les valeurs des champs
        const image = formData.get('photo');
        const title = formData.get('title');
        const category = formData.get('category');

        // Vérifier si les champs requis sont vides
        if (!image || !title || !category) {
            console.error('Veuillez remplir tous les champs du formulaire');
            return;
        }

        try {
            // Envoyer la requête à l'API avec les données
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Projet envoyé avec succès !', data);

                // Réinitialiser la miniature et afficher à nouveau photoFileContent
                preview.innerHTML = '';
                photoFileContent.style.display = 'block';

                // Réinitialiser les champs du formulaire
                form.reset();
            } else {
                console.error('Erreur lors de l\'envoi du projet');
            }
        } catch (error) {
            console.error('Erreur :', error);
        }
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



