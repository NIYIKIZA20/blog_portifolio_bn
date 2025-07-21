import mongoose from "mongoose"

export interface BlogInterface{
    _id?:string
    slug:string
    title: string
    author: { type: typeof mongoose.Types.ObjectId; ref: string; }
    content:string,
    blog_image_url:string
    isPublished: boolean
    description: string
    comments: { type: typeof mongoose.Types.ObjectId[]; ref: string; }
    likes: { type: typeof mongoose.Types.ObjectId[]; ref: string; }
    createdAt: NativeDate
    updatedAt: NativeDate
    deletedAt: null|string |undefined
}
export interface interfaceAddBlog extends Omit<BlogInterface,'id'>{}
export interface GetAllBlogs{
    blogs:BlogInterface[]
}