const chalk = require("chalk");
const Board = require('../models/Board');
const User = require('../models/User');
const Card = require('../models/Card');
const List = require('../models/List');

module.exports = {
    createCard: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, listId } = req.body;
            const boardId = req.header('boardId');

            // Create and save the card
            const newCard = new Card({ title });
            const card = await newCard.save();

            // Assign the card to the list
            const list = await List.findById(listId);
            list.cards.push(card.id);
            await list.save();

            // Log activity
            const user = await User.findById(req.user.id);
            const board = await Board.findById(boardId);
            board.activity.unshift({
                text: `${user.name} added '${title}' to '${list.title}'`,
            });
            await board.save();

            res.json({ cardId: card.id, listId });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    listCards: async (req, res) => {
        try {
            const list = await List.findById(req.params.listId);
            if (!list) {
              return res.status(404).json({ msg: 'List not found' });
            }
        
            const cards = [];
            for (const cardId of list.cards) {
              cards.push(await List.findById(cardId));
            }
        
            res.json(cards);
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    getCardById: async (req, res) => {
        try {
            const card = await Card.findById(req.params.id);
            if (!card) {
              return res.status(404).json({ msg: 'Card not found' });
            }
        
            res.json(card);
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    editCardById: async (req, res) => {
        try {
            const { title, description, label } = req.body;
            if (title === '') {
              return res.status(400).json({ msg: 'Title is required' });
            }
        
            const card = await Card.findById(req.params.id);
            if (!card) {
              return res.status(404).json({ msg: 'Card not found' });
            }
        
            card.title = title ? title : card.title;
            if (description || description === '') {
              card.description = description;
            }
            if (label || label === 'none') {
              card.label = label;
            }
            await card.save();
        
            res.json(card);
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    moveCard: async (req, res) => {
        try {
            const { fromId, toId, toIndex } = req.body;
            const boardId = req.header('boardId');
        
            const cardId = req.params.id;
            const from = await List.findById(fromId);
            let to = await List.findById(toId);
            if (!cardId || !from || !to) {
              return res.status(404).json({ msg: 'List/card not found' });
            } else if (fromId === toId) {
              to = from;
            }
        
            const fromIndex = from.cards.indexOf(cardId);
            if (fromIndex !== -1) {
              from.cards.splice(fromIndex, 1);
              await from.save();
            }
        
            if (!to.cards.includes(cardId)) {
              if (toIndex === 0 || toIndex) {
                to.cards.splice(toIndex, 0, cardId);
              } else {
                to.cards.push(cardId);
              }
              await to.save();
            }
        
            // Log activity
            if (fromId !== toId) {
              const user = await User.findById(req.user.id);
              const board = await Board.findById(boardId);
              const card = await Card.findById(cardId);
              board.activity.unshift({
                text: `${user.name} moved '${card.title}' from '${from.title}' to '${to.title}'`,
              });
              await board.save();
            }
        
            res.send({ cardId, from, to });
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
}