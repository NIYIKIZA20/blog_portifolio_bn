import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Joi from 'joi';
import dotenv from 'dotenv';
import { Blog } from '../types';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const DATA_FILE = path.join(__dirname, '../blog.json');

app.use(express.json());

// Joi schema for validation
const blogSchema = Joi.object({
  title: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  created: Joi.string().required(),
  updated: Joi.string().required(),
});

function readBlogs(): Blog[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return data ? JSON.parse(data) : [];
}
function writeBlogs(blogs: Blog[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2));
}

// CREATE blog
app.post('/blogs', (req: Request, res: Response) => {
  const { title, name, description } = req.body;
  const now = new Date().toISOString();

  const { error, value } = blogSchema.validate({
    title,
    name,
    description,
    created: now,
    updated: now,
  });
  if (error) {
    return res.status(400).json({ error: error.details });
  }

  const blogs = readBlogs();
  const newBlog: Blog = {
    id: Math.random().toString(36).substr(2, 9),
    ...value,
  };
  blogs.push(newBlog);
  writeBlogs(blogs);
  res.status(201).json(newBlog);
});

// READ all blogs
app.get('/blogs', (req: Request, res: Response) => {
  const blogs = readBlogs();
  res.json(blogs);
});

// READ single blog
app.get('/blogs/:id', (req: Request, res: Response) => {
  const blogs = readBlogs();
  const blog = blogs.find(b => b.id === req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});

// UPDATE blog
app.put('/blogs/:id', (req: Request, res: Response) => {
  const blogs = readBlogs();
  const idx = blogs.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Blog not found' });

  const { title, name, description } = req.body;
  const now = new Date().toISOString();

  const { error, value } = blogSchema.validate({
    title: title ?? blogs[idx].title,
    name: name ?? blogs[idx].name,
    description: description ?? blogs[idx].description,
    created: blogs[idx].created,
    updated: now,
  });
  if (error) {
    return res.status(400).json({ error: error.details });
  }

  blogs[idx] = { ...blogs[idx], ...value };
  writeBlogs(blogs);
  res.json(blogs[idx]);
});

// DELETE blog
app.delete('/blogs/:id', (req: Request, res: Response) => {
  const blogs = readBlogs();
  const idx = blogs.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Blog not found' });
  const [deleted] = blogs.splice(idx, 1);
  writeBlogs(blogs);
  res.json({ message: 'Blog deleted', blog: deleted });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 