import User from "./models/User.model.js";

export const getAllUsers = () => User.find();
export const getUserById = (id) => User.findById(id);
export const updateUser = (id, data) => User.findByIdAndUpdate(id, data, { new: true });
export const deleteUser = (id) => User.findByIdAndDelete(id);
