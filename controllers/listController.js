const chalk = require("chalk");
const Board = require('../models/Board');
const User = require('../models/User');
const Card = require('../models/Card');
const List = require('../models/List');

module.exports = {
    addList: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const title = req.body.title;
            const boardId = req.header('boardId');

            // Create and save the list
            const newList = new List({ title });
            const list = await newList.save();

            // Assign the list to the board
            const board = await Board.findById(boardId);
            board.lists.push(list.id);

            // Log activity
            const user = await User.findById(req.user.id);
            board.activity.unshift({
                text: `${user.name} added '${title}' to this board`,
            });
            await board.save();

            res.json(list);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    getBoardLists: async (req, res) => {
        try {
            const board = await Board.findById(req.params.boardId);
            if (!board) {
                return res.status(404).json({ msg: 'Board not found' });
            }
    
            const lists = [];
            for (const listId of board.lists) {
                lists.push(await List.findById(listId));
            }
    
            res.json(lists);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    getListById: async (req, res) => {
        try {
            const list = await List.findById(req.params.id);
            if (!list) {
              return res.status(404).json({ msg: 'List not found' });
            }
        
            res.json(list);
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    moveList: async (req, res) => {
        try {
            const toIndex = req.body.toIndex ? req.body.toIndex : 0;
            const boardId = req.header('boardId');
            const board = await Board.findById(boardId);
            const listId = req.params.id;
            if (!listId) {
              return res.status(404).json({ msg: 'List not found' });
            }
        
            board.lists.splice(board.lists.indexOf(listId), 1);
            board.lists.splice(toIndex, 0, listId);
            await board.save();
        
            res.send(board.lists);
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
}