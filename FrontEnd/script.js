document.addEventListener("DOMContentLoaded", function () {
  const buttonsContainer = document.querySelector(".buttons"); 
  const gallery = document.querySelector('.gallery'); 
  let worksData = []; 

  fetch('http://localhost:5678/api/works')
    .then(response => response.json()) 
    .then(data => {
      worksData = data; 
      displayGallery(worksData); 
      createFilterButtons(); 
    })
    .catch(error => console.error('Erreur lors de la récupération des données de l\'API', error));

  function displayGallery(works) {
    gallery.innerHTML = ""; 
    for (let i = 0; i < works.length; i++) {
      const work = works[i];
      const figure = document.createElement('figure'); 
      const img = document.createElement('img'); 
      const figcaption = document.createElement('figcaption'); 

      img.src = work.imageUrl; 
      img.alt = work.title; 
      figcaption.textContent = work.title; 

      figure.appendChild(img); 
      figure.appendChild(figcaption); 

      gallery.appendChild(figure); 
    }
  }

  function createFilterButtons() {
    addButton("Tous", null); 
    
    const categoryIds = [1, 2, 3];
    for (let i = 0; i < categoryIds.length; i++) {
      const categoryId = categoryIds[i];
      if (hasCategory(categoryId)) {
        addButton(getCategoryName(categoryId), categoryId); 
      }
    }
  }

  function addButton(text, categoryId) {
    const button = document.createElement("button"); 
    button.textContent = text; 
    button.addEventListener("click", () => filterGallery(categoryId)); 
    buttonsContainer.appendChild(button); 
  }

  function filterGallery(categoryId) {
    const filteredWorks = (categoryId === null) ? worksData : worksData.filter(work => work.category.id === categoryId); 
    displayGallery(filteredWorks); 
  }

  function hasCategory(categoryId) {
    return worksData.some(work => work.category.id === categoryId); 
  }

  function getCategoryName(categoryId) {
    switch (categoryId) {
      case 1:
        return "Objets";
      case 2:
        return "Appartements";
      case 3:
        return "Hôtels & Restaurants";
      default:
        return "Tous";
    }
  }
});