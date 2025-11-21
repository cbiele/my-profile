import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative bg-white border border-stone-200 rounded-3xl overflow-hidden hover:border-terracotta-400 transition-all duration-300 hover:shadow-xl hover:shadow-terracotta-500/10 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors z-10" />
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-terracotta-600 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-stone-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span 
              key={tech}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-sand-200 text-stone-700 border border-sand-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          {project.demoUrl && (
            <a 
              href={project.demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-terracotta-600 hover:bg-terracotta-500 text-white text-center py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
            >
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a 
              href={project.repoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-white hover:bg-sand-50 text-stone-700 text-center py-2 rounded-xl text-sm font-semibold transition-colors border border-stone-200 hover:border-stone-300"
            >
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};