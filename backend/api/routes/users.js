import express from "express";
import {
   getLogin,
   getUser,
   getPosts,
   getPost,
   getAnswers,
   SetNewAnswers,
   SetNewPost,
   deletePost,
   getChats,
   getMessage,
   SetNewMessage
  } from '../controllers/user.js';

const router = express.Router()

router.get('/', getPosts)

router.post('/view-post', getPost)
router.post('/answers', getAnswers)
router.post('/newPost', SetNewPost)
router.post('/newMessage', SetNewMessage)
router.post('/newAnswers', SetNewAnswers)
router.post('/user', getUser)
router.post('/login', getLogin)
router.post('/chat', getChats)
router.post('/message', getMessage)

router.delete('/post/:id',deletePost)

export default router;