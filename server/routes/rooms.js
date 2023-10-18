import express from "express";
import RoomModel from '../models/RoomModel.js';

const router = express.Router();

//NEW room/User routes
router.post('/create', async (req, res) => {
  const room = await RoomModel.findOne(
    {roomNumber:req.body.roomNumber}
  )

  if(room){
    return res.status(400).json({message: 'room exist'})
  }

  const newRoom = new RoomModel({
    roomNumber: req.body.roomNumber,
  })

  try {
      const room = await newRoom.save();
      res.status(200).json(room)
  }
  catch (error) {
      res.status(500).json({message: error.message})
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
router.get('/getOne-id/:id', async (req, res) => {
  try{
    const roomData = await RoomModel.findById(req.params.id).populate("users");
    if(!roomData) return res.status(400).json({message: 'no room found'})
    res.json(roomData._doc)
  }
  catch(error){
    res.status(500).json({message: error.message})
  }
})

//Update by ID Method
router.patch('/update-id/:id', async (req, res) => {
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

//Get by roomNumber Method
router.get('/getOne/:roomNumber', async (req, res) => {
  try{
    const roomData = await RoomModel.findOne(
      {roomNumber:req.params.roomNumber}
    ).populate("users");

    if(!roomData) return res.status(400).json({message: 'no room found'})
    res.json(roomData._doc)
  }
  catch(error){
    res.status(500).json({message: error.message})
  }
})

//Update by roomNumber Method
router.patch('/update/:roomNumber', async (req, res) => {
  try {
    const roomNumber = req.params.roomNumber;
    const updatedData = req.body;
    const options = { new: true };

    const result = await RoomModel.findOneAndUpdate(
        {roomNumber}, updatedData, options
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