//gestion nouvel affichage des travaux sans html
fetch('http://localhost:5678/api/works')
  .then(response => {
    if (!response.ok) {
      throw new Error('La requête a échoué');
    }
    return response.json();
  })
  .then(data => {
    const gallery = document.querySelector('.gallery');

    for (let i = 0; i < data.length; i++) {
        const work = data[i];
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
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des données de l\'API', error);
  });