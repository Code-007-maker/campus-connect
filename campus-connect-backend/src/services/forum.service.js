import Forum from "../models/Forum.model.js";

export const createPost = (data) => Forum.create(data);
export const getForumPosts = () => Forum.find().populate("user");
