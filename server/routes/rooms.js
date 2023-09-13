import express from "express";
import UserModel from '../models/UserModel.js';
import RoomModel from '../models/RoomModel.js';

const router = express.Router();

//NEW room/User routes
router.post('/create', async (req, res) => {
  const newRoom = new RoomModel({
    roomNumber: req.body.roomNumber,
  })

  try {
      const room = await newRoom.save();
      res.status(200).json(room.populate({path:'user_id'}))
  }
  catch (error) {
      res.status(400).json({message: error.message})
  }
})

//Get all Method
router.get('/getAll', async (req, res) => {
  try{
      const data = await RoomModel.find();
      res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
  try{
    const roomData = await RoomModel.findById(req.params.id);
    res.json(roomData)
  }
  catch(error){
    res.status(500).json({message: error.message})
  }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await RoomModel.findOneAndUpdate(
        {_id: id}, updatedData, options
    )

    res.status(200).json(result)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await RoomModel.findByIdAndDelete(id)
    res.send(`Document with ${data.name} has been deleted..`)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})

export default router;