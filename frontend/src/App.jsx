import './App.css';
import Layout from './layout/Layout';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;