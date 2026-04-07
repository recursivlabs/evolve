import * as React from 'react';
import { Platform } from 'react-native';
import { generateAccentColor } from '../constants/theme';

interface ProjectContextValue {
  name: string;
  description: string;
  accentColor: string;
}

const ProjectContext = React.createContext<ProjectContextValue>({
  name: 'My App',
  description: '',
  accentColor: '#10b981',
});

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const value = React.useMemo(() => {
    let name = 'Evolve';
    let description = '';

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      name = params.get('projectName') || name;
      description = params.get('projectDescription') || description;
    }

    return {
      name,
      description,
      accentColor: generateAccentColor(name),
    };
  }, []);

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return React.useContext(ProjectContext);
}
