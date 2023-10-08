import mongoose from 'mongoose';

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const UserSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique : true
    },
    rooms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room"
    }],
    victoryPoints:{ 
      required: true,
      type: Number,
      default: 0
    },
    wins:{ 
      required: true,
      type: Number,
      default: 0
    }
  },
  schemaOptions
)

export default mongoose.model('User', UserSchema)