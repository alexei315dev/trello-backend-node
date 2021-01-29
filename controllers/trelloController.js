const Trello = require('trello-node-api')(process.env.TRELLO_API_KEY, process.env.TRELLO_OAUTH_TOKEN);

module.exports = {
    createBoard: async (req) => {
        console.log('request', req.name);
        const data = {
            name: req.name, // REQUIRED
            defaultLabels: false,
            defaultLists: false,
            desc: 'Board description.',
            idOrganization: 'ORGANIZATION_ID',
            idBoardSource: 'BOARD_ID',
            keepFromSource: 'none',
            powerUps: 'all',
            prefs_permissionLevel: 'private',
            prefs_voting: 'disabled',
            prefs_comments: 'members',
            prefs_invitations: 'members',
            prefs_selfJoin: true,
            prefs_cardCovers: true,
            prefs_background: 'blue',
            prefs_cardAging: 'regular'
        }

        Trello.board.create(data).then(function (response) {
            console.log('response ', response);
        }).catch(function (error) {
            console.log('error', error);
        });
    }
}