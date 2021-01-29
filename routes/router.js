const express = require("express");
const router = express.Router();
const verify = require('../middleware/verifyToken');
const authController = require('../controllers/authController');
const boardController = require('../controllers/boardController');
const cardController = require("../controllers/cardController");
const listController = require("../controllers/listController");

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.get('/me', verify, authController.getUser);

router.post('/board/list', verify, boardController.getBoards);
router.post('/board/create', verify, boardController.createBoard);
router.get('/board/detail/:id', verify, boardController.getBoardById);

router.post('/lists/create', verify, listController.addList);
router.get('/lists/boardLists/:boardId', verify, listController.getBoardLists);
router.get('/lists/:id', verify, listController.getListById);
router.patch('/lists/move/:id', verify, listController.moveList);

router.post('/cards/create', verify, cardController.createCard);
router.get('/cards/listCards/:listId' ,verify, cardController.listCards);
router.get('/cards/:id', verify, cardController.getCardById);
router.patch('/cards/edit/:id', verify, cardController.editCardById);
router.patch('/cards/move/:id', verify, cardController.moveCard);

module.exports = router;