import Resource from "../models/Resource.model.js";

export const addResource = (data) => Resource.create(data);
export const getResources = () => Resource.find();
export const updateResource = (id, data) => Resource.findByIdAndUpdate(id, data, { new: true });
export const deleteResource = (id) => Resource.findByIdAndDelete(id);
