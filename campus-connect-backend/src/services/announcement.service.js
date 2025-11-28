import Announcement from "../models/Announcement.model.js";

export const createAnnouncement = (data) => Announcement.create(data);
export const getAnnouncements = () => Announcement.find().sort({ createdAt: -1 });
export const deleteAnnouncement = (id) => Announcement.findByIdAndDelete(id);
