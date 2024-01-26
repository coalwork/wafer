addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  
  registerForm.onsubmit = async event => {
    event.preventDefault();

    const response = await fetch('/api/register', {
      method: 'POST',
      body: new URLSearchParams(new FormData(registerForm))
    });

    if (!response.ok) {
      const registerTips = document.getElementById('register-tips') ?? document.createElement('small');
      registerTips.id = 'register-tips';
      registerTips.innerHTML = (await response.json()).errors.join('<br><br>');
      registerForm.append(registerTips);
      return;
    }

    location.replace('/self');
  };
});
