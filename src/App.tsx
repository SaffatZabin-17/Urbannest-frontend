import { Routes, Route } from 'react-router-dom';
import Header from '@/components/common/header/header';
import Footer from '@/components/common/footer/footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import ListingCreatePage from './pages/ListingCreatePage';
import ListingsPage from './pages/ListingsPage';
import ListingViewPage from './pages/ListingViewPage';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/listing" element={<ListingsPage />} />
        <Route path="/listing/create" element={<ListingCreatePage />} />
        <Route path="/listing/:id" element={<ListingViewPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
