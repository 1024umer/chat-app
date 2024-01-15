const express = require('express');
const {accessChat,fetchChats,groupChat,renameGroup,addToGroup,removeFromGroup} = require('../controllers/chatController.js');
const { protect } = require('../middleware/authMidlleware.js');
const router = express.Router();

router.route('/').post(protect,accessChat)
router.route('/').get(protect,fetchChats)
router.route('/group').post(protect,groupChat)
router.route('/rename').put(protect,renameGroup)
router.route('/removegroup').put(protect,removeFromGroup)
router.route('/add-to-group').put(protect,addToGroup)

module.exports = router;