
const filterSection = document.querySelector('.filter-container');

// Vérifier si l'utilisateur est connecté lors du chargement de la page

if (loggedIn === 'true') {
  const filterSection = document.querySelector('.filter-container');
  const logoutButton = document.querySelector('#logoutButton');
  if (filterSection) {
    filterSection.style.display = 'none';
  }
  if (logoutButton) {
    logoutButton.style.display = 'block';
  }
}




document.getElementById('logoutButton').addEventListener('click', function() {
    // Effacer l'indication de connexion dans le localStorage
    localStorage.removeItem('loggedIn');
    
    // Rediriger vers la page de connexion (ou toute autre page appropriée après la déconnexion)
    window.location.href = 'index.html';
  });
  