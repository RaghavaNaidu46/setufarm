import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginScreen from './screens/shared/LoginScreen';
import RoleSelectionScreen from './screens/shared/RoleSelectionScreen';
import ProductsScreen from './screens/shared/ProductsScreen';

const queryClient = new QueryClient();

const FarmerHome = () => <div style={{ padding: '2rem' }}><h2>farmer home</h2></div>;
const BuyerHome  = () => <div style={{ padding: '2rem' }}><h2>buyer home</h2></div>;
const DriverHome = () => <div style={{ padding: '2rem' }}><h2>driver home</h2></div>;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/"               element={<ProductsScreen />} />
          <Route path="/login"          element={<LoginScreen />} />
          <Route path="/role-selection" element={<RoleSelectionScreen />} />
          <Route path="/farmer"         element={<FarmerHome />} />
          <Route path="/buyer"          element={<BuyerHome />} />
          <Route path="/driver"         element={<DriverHome />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
