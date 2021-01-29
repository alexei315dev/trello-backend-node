const fetch = require('node-fetch');

module.exports = {
    createBoard: async (req) => {
        console.log('request', req.name);
        fetch(`https://api.trello.com/1/boards/?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_OAUTH_TOKEN}&name=${req.name}`, {
            method: 'POST'
        })
        .then(response => {
            console.log(
            `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
    }
}