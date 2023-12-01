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
                const img = document.createElement('img');
                img.src = work.imageUrl;
                img.alt = work.title;
                img.classList.add('gallery-photo');
                img.addEventListener('click', function () {
                    openFullImage(work.imageUrl);
                });
                galleryPhotos.appendChild(img);
            });
        } catch (error) {
            console.error('Erreur :', error);
        }
    }


});
