import React, { useEffect, useState } from "react";
import { projectService } from "../services/project.service";

import ProjectCard from "./components/matchmaking/ProjectCard.jsx";
import RecommendedUsers from "./components/matchmaking/RecommendedUsers.jsx";
import CreateProjectModal from "./components/matchmaking/CreateProjectModal.jsx";
import Filters from "./components/matchmaking/Filters.jsx";

import { useAuth } from "../hooks/useAuth.jsx";
import { xpService } from "../services/xp.service";

export default function Matchmaking() {
  const [projects, setProjects] = useState([]);
  const [openNew, setOpenNew] = useState(false);
  const [filters, setFilters] = useState([]);
  const { user } = useAuth() || {};

  useEffect(() => {
    (async () => setProjects(await projectService.list()))();

    if (!window.__campus_bus) window.__campus_bus = document.createElement("div");

    const onCreate = (e) => setProjects((p) => [e.detail, ...p]);
    const onJoin = (e) => {
      setProjects((p) =>
        p.map((pr) =>
          pr.id === e.detail.projectId
            ? { ...pr, members: [...pr.members, e.detail.user] }
            : pr
        )
      );
    };

    window.__campus_bus.addEventListener("project:created", onCreate);
    window.__campus_bus.addEventListener("project:joined", onJoin);
    return () => {
      window.__campus_bus.removeEventListener("project:created", onCreate);
      window.__campus_bus.removeEventListener("project:joined", onJoin);
    };
  }, []);

  const handleJoin = async (id) => {
    await projectService.join(id, user?.name);
    xpService.award(user?.name, "project_join", 10);
  };

  const filteredProjects =
    filters.length === 0
      ? projects
      : projects.filter((p) =>
          p.skills.some((s) => filters.includes(s))
        );

  return (
    <div className="pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-deep">Project Matchmaking</h1>
            <p className="muted mt-1">Find teammates. Join hackathon-ready teams. Collaborate smartly.</p>
          </div>
          <button className="btn-cta px-5 py-3 rounded-xl" onClick={() => setOpenNew(true)}>
            + Create Project
          </button>
        </div>

        <Filters onChange={setFilters} />

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {filteredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} onJoin={handleJoin} />
          ))}
        </div>

        <div className="mt-12">
          <RecommendedUsers skills={filters} />
        </div>

        {openNew && (
          <CreateProjectModal
            onClose={() => setOpenNew(false)}
            onCreated={() => setOpenNew(false)}
          />
        )}
      </div>
    </div>
  );
}
