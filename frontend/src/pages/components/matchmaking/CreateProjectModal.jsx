// src/components/matchmaking/CreateProjectModal.jsx
import React, { useState } from "react";
import { projectService } from "../../../services/project.service";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { xpService } from "../../../services/xp.service";

export default function CreateProjectModal({ onClose, onCreated }) {
  const { user } = useAuth() || {};
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [skills, setSkills] = useState("");

  const create = async () => {
    const list = skills.split(",").map((s) => s.trim()).filter(Boolean);

    await projectService.create({
      title,
      description: desc,
      skills: list,
      owner: user?.name,
    });

    xpService.award(user?.name, "project_create", 20);

    onCreated?.();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="glass p-6 rounded-2xl max-w-lg w-full border" style={{ borderColor: "var(--glass-border)" }}>
        <h2 className="text-xl font-bold text-deep">Create New Project</h2>
        
        <div className="space-y-3 mt-4">
          <input
            className="w-full p-3 border rounded-xl"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <textarea
            className="w-full p-3 border rounded-xl h-28"
            placeholder="Project Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded-xl"
            placeholder="Required Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2 border rounded-xl" onClick={onClose}>Cancel</button>
          <button className="btn-cta px-4 py-2 rounded-xl" onClick={create}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
