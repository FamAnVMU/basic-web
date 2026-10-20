export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'Maritime Tech' | 'Full-Stack Web' | 'Cloud & Systems' | 'Interactive 3D';
  description: string;
  longDescription?: string;
  features: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  status: 'Deployed' | 'Active Development' | 'Prototype';
  metrics?: string;
  systemCode: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  tag: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level: number; // 1-100
    levelLabel: string;
    icon?: string;
    isKeySkill?: boolean;
  }[];
}

export interface Milestone {
  id: string;
  orbitPhase: string;
  year: string;
  title: string;
  organization: string;
  location: string;
  description: string;
  status: 'Completed' | 'Current Phase' | 'Planned Orbit';
  highlights: string[];
  category: 'education' | 'project' | 'skills' | 'future';
}

export interface SocialLink {
  name: string;
  platform: 'facebook' | 'discord' | 'email' | 'github';
  url: string;
  displayValue: string;
  iconName: string;
  actionType: 'link' | 'copy';
}
