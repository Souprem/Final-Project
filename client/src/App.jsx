import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthContextProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Details from './pages/Details';
import TweetDetails from './pages/TweetDetails';
import Privacy from './pages/Privacy';
import Navbar from './components/Navbar';
import Rightbar from './components/Rightbar';
import './index.css';

// Layout
const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <Rightbar />
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/profile/:id',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: '/tweet/:id',
        element: <TweetDetails />
      },
      { path: '/search', element: <Explore /> },
      { path: '/details/:mediaId', element: <Details /> },
      { path: '/privacy', element: <Privacy /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
