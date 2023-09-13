import express from "express";
import UserModel from '../models/UserModel.js';
import RoomModel from '../models/RoomModel.js';

const router = express.Router();

router.post('/create', async (req, res) => {

  try {
      const room = await RoomModel.findOneAndUpdate(
        {roomNumber:req.body.roomNumber },
        { $set: { roomNumber: req.body.roomNumber } },
        { upsert: true, new:true  }
      )

      console.log('ROOM!',room)
    
      const newUser = await UserModel.findOneAndUpdate(
        {username:req.body.username},
        {
          $set: { username: req.body.username },
          $push: { rooms: room._id }
        },
        { upsert: true, new:true  }
      )
      console.log('newUSER',newUser)

      res.status(200).json(newUser)
  }
  catch (error) {
      res.status(400).json({message: error.message})
  }
})


router.get('/getAll', async (req, res) => {
  try{
      const usersData = await UserModel.find();
      res.json(usersData)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
  try{
    const userData = await UserModel.findById(req.params.id);
    const allUserRooms= await RoomModel.find({
      user:userData._id
    })
    res.json({
      ...userData._doc,
      rooms:allUserRooms
    })
  }
  catch(error){
    res.status(500).json({message: error.message})
  }
})

router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    //will need to pass in new rooms on frontend
    const updatedData = req.body;
    const options = { new: true };

    const result = await UserModel.findByIdAndUpdate(
        id, updatedData, options
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