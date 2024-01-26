addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.onsubmit = async event => {
      event.preventDefault();

      const response = await fetch('/api/login', {
        method: 'POST',
        body: new URLSearchParams(new FormData(loginForm))
      });

      if (!response.ok) {
        const copy = document.getElementById('login-tip');

        const loginTip = document.createElement('small');
        loginTip.id = 'login-tip';
        loginTip.textContent = (await response.json()).message;
        document.querySelector('#login-form input[type=submit]').after(loginTip);

        if (copy) copy.remove();
        return;
      }

      // change this at some point
      location.reload();
    };
  }

  const logoutButton = document.getElementById('log-out');

  if (logoutButton) {
    logoutButton.onclick = () => fetch('/api/logout', {
      method: 'POST'
    }).then(() => location.reload());
  }
});
