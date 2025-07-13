import { Request, Response } from 'express';
import { Blog } from '../types/types';
import { blogSchema } from '../utils/fileHelpers';
import { readBlogs, writeBlogs } from '../utils/fileHelpers';

export const createBlog = (req: Request, res: Response) => {
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
};

export const getBlogs = (req: Request, res: Response) => {
  const blogs = readBlogs();
  res.json(blogs);
};

export const getBlogById = (req: Request, res: Response) => {
  const blogs = readBlogs();
  const blog = blogs.find(b => b.id === req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
};

export const updateBlog = (req: Request, res: Response) => {
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
};

export const deleteBlog = (req: Request, res: Response) => {
  const blogs = readBlogs();
  const idx = blogs.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Blog not found' });
  const [deleted] = blogs.splice(idx, 1);
  writeBlogs(blogs);
  res.json({ message: 'Blog deleted', blog: deleted });
};