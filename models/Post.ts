import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPost extends Document {
  title: string
  content: string
  date: Date
  slug: string
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug'],
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
)

// Create index for slug
PostSchema.index({ slug: 1 }, { unique: true })

// Prevent model recompilation in development
const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

export default Post
