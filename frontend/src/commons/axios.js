import _axios from 'axios';

// Having the online Heroku link with our web app and the localhost connection
 const axios = baseUrl => { 

    const instance = _axios.create({ 
        baseURL: 'https://snackvendor.herokuapp.com' || 'http://localhost:5000'
    });
    return instance;
}

export default axios();
