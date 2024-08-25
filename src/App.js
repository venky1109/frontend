import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCartIcon from './components/FloatingCartIcon';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);


  return (
    <div style={{ paddingTop: '100px',marginRight: '1rem',marginLeft: '0.5rem'}}>
      <ToastContainer />
      <Header />
      <main className='py-4'>
        <Container>
          <Outlet />
        </Container>
      </main>
      <FloatingCartIcon /> 
      <Footer />
    </div>
  );
};

export default App;
