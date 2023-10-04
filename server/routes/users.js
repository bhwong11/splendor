import express from "express";
import UserModel from '../models/UserModel.js';
import RoomModel from '../models/RoomModel.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
      const room = await RoomModel.findOne(
        {roomNumber:req.body.roomNumber }
      )

      if(!room){
        return res.status(400).json({message: 'room not found'})
      }

      const newUser = new UserModel({
        username:req.body.username,
        rooms: [room._id]
      })

      await newUser.save()

      await RoomModel.findByIdAndUpdate(
        room._id,
        { 
          $set: { roomNumber: req.body.roomNumber },
          $addToSet: { users: newUser._id } 
        },
        { new:true  }
      )
      res.status(200).json(newUser)
  }
  catch (error) {
      res.status(500).json({message: error.message})
  }
})


router.get('/getAll', async (req, res) => {
  try{
      const usersData = await UserModel.find();
      res.status(200).json(usersData)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})

//Get by ID Method
router.get('/getOne-id/:id', async (req, res) => {
  try{
    const userData = await UserModel.findById(req.params.id).populate("rooms")
    console.log('userData',userData)
    if(!userData) return res.status(400).json({message: 'no user found'})
    res.json(userData._doc)
  }
  catch(error){
    res.status(500).json({message: error.message})
  }
})

//Get by username Method
router.get('/getOne/:username', async (req, res) => {
  try{
    const userData = await UserModel.findOne(
      {username:req.params.username}
    ).populate("rooms")
    console.log('userData',userData)
    if(!userData) return res.status(400).json({message: 'no user found'})
    res.json(userData._doc)
  }
  catch(error){
    res.status(500).json({message: error.message})
  }
})

router.patch('/update-id/:id', async (req, res) => {
  try {
    const id = req.params.id;
    //will need to pass in new rooms on frontend
    const updatedData = req.body;
    const options = { new: true };

    const result = await UserModel.findByIdAndUpdate(
        id, {
          $set:updatedData,
          ...(req.body?.roomNumber?{$addToSet: { rooms: req.body?.roomNumber } }:{})
        }, options
    )

    res.status(200).json(result)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})

router.patch('/update/:username', async (req, res) => {
  try {
    const username = req.params.username;
    //will need to pass in new rooms on frontend
    const updatedData = req.body;
    const options = { new: true };
    const room = await RoomModel.findOne({roomNumber:req.body?.roomNumber})
    if(!room && req.body.roomNumber){
      return res.status(400).json({message:'room not found'})
    }

    const result = await UserModel.findOneAndUpdate(
        {username}, {
          $set:updatedData,
          ...(room?{$addToSet: { rooms: room?._id } }:{})
        }, options
    )

    res.status(200).json(result)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await UserModel.findByIdAndDelete(id)
    res.send(`Document with ${data.name} has been deleted..`)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})

export default router;