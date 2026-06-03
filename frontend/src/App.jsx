import AppRoutes from './routes/AppRoutes.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useSessionReminders } from './hooks/useSessionReminders.js';

function App() {
  const { isAuthenticated } = useAuth();
  useSessionReminders(isAuthenticated);

  return <AppRoutes />;
}

export default App;
