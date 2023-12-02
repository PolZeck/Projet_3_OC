const filterSection = document.querySelector('.filter-container');

// Vérifier si l'utilisateur est connecté lors du chargement de la page

if (loggedIn === 'true') {
    const filterSection = document.querySelector('.filter-container');
    const logoutButton = document.querySelector('#logoutButton');
    const editionMode = document.querySelector('#editionMode');
    const loginButton = document.querySelector('#loginButton');
    const modalButton = document.querySelector('#modal');

    if (filterSection) {
        filterSection.style.display = 'none';
    }
    if (logoutButton) {
        logoutButton.style.display = 'block';
    }
    if (modalButton) {
        modalButton.style.display = 'block';
    }
    if (editionMode) {
        editionMode.style.display = 'block';
    }
    if (loginButton) {
        loginButton.style.display = 'none';
    }
}


// gérer la déconnexion

document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('loggedIn');

    window.location.href = 'index.html';
});
