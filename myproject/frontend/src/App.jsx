import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Practice from './pages/Practice.jsx';
import MockInterview from './pages/MockInterview.jsx';
import Blog from './pages/Blog.jsx';
import Login from './pages/Login.jsx';
import Solve from './pages/Solve.jsx';
import RoleFullStack from './pages/RoleFullStack.jsx';
import QuestionsList from './components/QuestionsList.jsx';
import Register from './pages/Register.jsx';
import VerifyOtp from './pages/VerifyOtp.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const Pricing = () => <div style={{padding:'40px'}}>Pricing - Coming Soon</div>;

const clientId = "455317546114-2umdpa98rio2gcd3j0i13q3f0qra0872.apps.googleusercontent.com";

function App(){
  return(
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/role/fullstack" element={<RoleFullStack />} />
          <Route path="/role/fullstack/:stack" element={<RoleFullStack />} />
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/questions" element={<QuestionsList />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/solve/:id" element={<Solve />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordConfirm />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App;