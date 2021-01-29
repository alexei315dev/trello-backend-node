const chalk = require("chalk");
const Board = require('../models/Board');
const User = require('../models/User');
const trelloController = require('./trelloController');

module.exports = {
  createBoard: async (req, res) => {
    try {
        console.log('createBoard', req.body);
        const { title, backgroundURL, userID } = req.body;
  
        // Create and save the board
        const newBoard = new Board({ title, backgroundURL });
        const board = await newBoard.save();
  
        // Add board to user's boards
        const user = await User.findById(userID);
        user.boards.unshift(board.id);
        await user.save();
  
        // Add user to board's members as admin
        board.members.push({ user: user.id, name: user.username });
  
        // Log activity
        board.activity.unshift({
          text: `${user.username} created this board`,
        });
        await board.save();

        trelloController.createBoard({ name: board.title });
  
        res.status(200).json({
            success: true,
            board: board,
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
  },

  getBoards: async (req, res) => {
    try {
        const user = await User.findById(req.body.userID);
    
        const boards = [];
        for (const boardId of user.boards) {
          boards.push(await Board.findById(boardId));
        }
    
        res.status(200).json(boards);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
  },

  getBoardById: async (req, res) => {
    try {
        console.log('req.params.id', req.params.id);
        const board = await Board.findById(req.params.id);
        if (!board) {
          return res.status(404).json({ msg: 'Board not found' });
        }
    
        res.status(200).json(board);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
  },

  getActivity: async (req, res) => {
    try {
        const board = await Board.findById(req.params.boardId);
        if (!board) {
            return res.status(404).json({ msg: 'Board not found' });
        }
        res.json(board.activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
  }
}

