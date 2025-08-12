import './App.css';
import LoginForm from '../components/auth/loginForm';
import "./styles/login.css"


export default function Login() {
  return (
    <div className='background'>
        <div className='center'>
            <LoginForm></LoginForm>
        </div>
    </div>
  );
}