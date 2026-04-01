import { Slot } from 'expo-router';
import { AuthProvider } from '../lib/auth';
import { ProjectProvider } from '../lib/project';

export default function RootLayout() {
  return (
    <ProjectProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ProjectProvider>
  );
}
