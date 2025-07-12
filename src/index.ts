import express, { Request, Response } from 'express';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import {join} from 'path';
import Joi from 'joi';
import multer from 'multer';
import { Blog } from '../types';



const app = express();
const DATA_FILE = join(__dirname, '../blog.json');
const UPLOADS_DIR = join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'));
  }
});

app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Joi schema for validation
const blogSchema = Joi.object({
  title: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  profilePhoto: Joi.string().optional(),
  created: Joi.string().required(),
  updated: Joi.string().required(),
});

function readBlogs(): Blog[] {
  if (!existsSync(DATA_FILE)) return [];
  try {
    const data = readFileSync(DATA_FILE, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read or parse blog.json:', err);
    return [];
  }
}

function writeBlogs(blogs: Blog[]) {
  writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2));
}

app.post('/blogs', upload.single('profilePhoto'), (req: Request, res: Response) => {
  const { title, name, description } = req.body;
  const file = req.file;
  const now = new Date().toISOString();

  const { error, value } = blogSchema.validate({
    title,
    name,
    description,
    profilePhoto: file ? `/uploads/${file.filename}` : undefined,
    created: now,
    updated: now,
  });
  if (error) {
    return res.status(400).json({ status: 'error', message: error.details.map(d => d.message).join(', ') });
  }
  const blogs = readBlogs();
  const newBlog: Blog = {
    id: Math.random().toString(36).substr(2, 12),
    ...value,
  };
  blogs.push(newBlog);
  writeBlogs(blogs);
  res.status(201).json(newBlog);
});

app.get('/blogs', (req: Request, res: Response) => {
  const blogs = readBlogs();
  res.json(blogs);
});


app.get('/blogs/:id', (req: Request, res: Response) => {
  const blogs = readBlogs();
  const blog = blogs.find(b => b.id === req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});

app.put('/blogs/:id', upload.single('profilePhoto'), (req: Request, res: Response) => {
  const blogs = readBlogs();
  const idx = blogs.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Blog not found' });

  const { title, name, description } = req.body;
  const file = req.file;
  const now = new Date().toISOString();

  const { error, value } = blogSchema.validate({
    title: title ?? blogs[idx].title,
    name: name ?? blogs[idx].name,
    description: description ?? blogs[idx].description,
    profilePhoto: file ? `/uploads/${file.filename}` : blogs[idx].profilePhoto,
    created: blogs[idx].created,
    updated: now,
  });
  if (error) {
    return res.status(400).json({ status: 'error', message: error.details.map(d => d.message).join(', ') });
  }
  blogs[idx] = { ...blogs[idx], ...value };
  writeBlogs(blogs);
  res.json(blogs[idx]);
});

app.delete('/blogs/:id', (req: Request, res: Response) => {
  const blogs = readBlogs();
  const idx = blogs.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Blog not found' });
  const [deleted] = blogs.splice(idx, 1);
  writeBlogs(blogs);
  res.json({ message: 'Blog deleted', blog: deleted });
});

 