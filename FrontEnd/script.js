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


const loggedIn = localStorage.getItem('loggedIn');
const filterSection = document.querySelector('.filter-container');
const logoutButton = document.createElement('li');
logoutButton.textContent = 'logout';
logoutButton.style.cursor = 'pointer';
const editionMode = document.getElementById('editionMode');
const modalButton = document.getElementById('modal');

if (loggedIn === 'true') {
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


  const addPhotoButton = document.getElementById('addPhotoButton');
  const galleryModal = document.getElementById('galleryModal');
  const galleryPhotos = document.querySelector('.gallery-photos');
  const backButton = '<i class="fa-solid fa-arrow-left"></i>';
  let savedGalleryContent = ''; 
  let closeButton;

  const addPhotoModalContent = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Ajout photo</h2>
      <div class="formContainer">  
        <form id="addPhotoForm" enctype="multipart/form-data">
          <label for="photo">Choisir une photo (JPG/PNG) :</label>
          <input type="file" id="photo" name="photo" accept=".jpg, .jpeg, .png" required>
          
          <label for="title">Titre de la photo :</label>
          <input type="text" id="title" name="title" required>
          
          <label for="category">Catégorie :</label>
          <select id="category" name="category" required>
          <!-- Options des catégories à charger dynamiquement -->
          </select>
          
          <input type="submit" value="Envoyer">
        </form>
      </div>
      <div class="backButton">${backButton}</div>
    </div>`;

  // Gestion de l'événement au clic sur "Ajouter une photo"
  addPhotoButton.addEventListener('click', function(event) {
    event.preventDefault();
    
    savedGalleryContent = galleryPhotos.innerHTML;
   
    galleryPhotos.innerHTML = addPhotoModalContent;
    
    addPhotoButton.style.display = 'none';
   
    galleryModal.style.display = 'block';

    // Gestion de l'événement pour le bouton retour
    const backButtonElement = document.querySelector('.backButton');
    backButtonElement.addEventListener('click', function() {
      
      addPhotoButton.style.display = 'block';
      
      galleryPhotos.innerHTML = savedGalleryContent;
      savedGalleryContent = '';
      closeButton.remove();
    });

    // Stocker la référence à la croix de la modale
    closeButton = document.querySelector('.close');
  });
  
  //déconnexion :
  logoutButton.addEventListener('click', function () {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
  });
}


          // modalPart

document.addEventListener("DOMContentLoaded", function () {
  const galleryModal = document.getElementById('galleryModal');
  const closeModalSpan = document.querySelector('.close');
  const galleryPhotos = document.querySelector('.gallery-photos');
  const modalButton = document.querySelector('#modal');
  
  

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
        localStorage.setItem('loggedIn', 'true');
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



