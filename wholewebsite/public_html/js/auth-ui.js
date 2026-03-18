document.addEventListener('DOMContentLoaded', () => {
  const LS_LOGGED_IN = 'auth_logged_in';
  const LS_USER_NAME = 'auth_user_name';
  const authButtons  = document.getElementById('authButtons');
  const userProfile  = document.getElementById('userProfile');
  const welcomeText  = document.getElementById('welcomeText');
  const logoutBtn    = document.getElementById('logoutBtn');

  const isLoggedIn = localStorage.getItem(LS_LOGGED_IN) === '1';
  const userName   = localStorage.getItem(LS_USER_NAME) || '';

  if (isLoggedIn) {
    if (welcomeText) welcomeText.textContent = `Welcome, ${userName}`;
    if (authButtons) authButtons.style.display = 'none';
    if (userProfile) userProfile.style.display = 'flex';
  } else {
    if (authButtons) authButtons.style.display = 'flex';
    if (userProfile) userProfile.style.display = 'none';
  }

  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem(LS_LOGGED_IN);
    localStorage.removeItem(LS_USER_NAME);
    window.location.href = 'login.html';
  });
});
