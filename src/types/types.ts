import mongoose, { Document, Schema } from 'mongoose';

export interface Blog {
  id: string;
  title: string;
  name: string;
  description: string;
  profilePhoto?: string;
  created: string;
  updated: string;
  //deteteAt?: string;    i need add this too
}

export interface BlogDocument extends Blog, Document {}

const BlogSchema = new Schema<BlogDocument>({
  title: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  profilePhoto: { type: String },
  created: { type: String, required: true },
  updated: { type: String, required: true },
  // deteteAt: { type: String },
});

export const BlogModel = mongoose.models.Blog || mongoose.model<BlogDocument>('Blog', BlogSchema); 