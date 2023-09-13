import mongoose from 'mongoose';

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const RoomSchema = new mongoose.Schema({
    roomNumber: {
        required: true,
        type: Number,
        unique : true
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  schemaOptions
)

export default mongoose.model('Room', RoomSchema)