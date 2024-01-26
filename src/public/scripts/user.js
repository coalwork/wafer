addEventListener('DOMContentLoaded', () => {
  const deleteButton = document.getElementById('delete-user');

  let userConfirmedOnce = false;
  deleteButton.onclick = async () => {
    if (userConfirmedOnce) {
      await fetch(`/api/users/${$user}`, {
        method: 'DELETE'
      });
      location.replace('/home');
      return;
    }

    userConfirmedOnce = true;
    deleteButton.textContent = 'are you sure?';

    let time = 5;

    await new Promise(resolve => {
      const timeoutID = setInterval(() => {
        if (time === 0) {
          clearInterval(timeoutID);
          return resolve();
        }
        deleteButton.textContent = `are you sure? ${time--}`
      }, 1000);
    });

    deleteButton.textContent = 'delete';
    userConfirmedOnce = false;
  };
});
