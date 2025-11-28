import Badge from "../models/Badge.model.js";

export const awardBadge = async (userId, badgeTitle) => {
  return Badge.create({ userId, title: badgeTitle });
};
