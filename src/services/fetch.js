export default (url, options) =>
  fetch(url, options)
    .then((response) => {
      if (response.status < 400) {
        return response.json();
      }
      const error = new Error('Bad HTTP Response')
      err.response = response;
      throw error;
    });
