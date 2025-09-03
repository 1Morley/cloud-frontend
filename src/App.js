import logo from './logo.svg';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    Outlet,
} from "react-router-dom";
import './App.css';
import LoginPage from "./views/login.jsx";
import { Home } from "./components/songstuff/homePage.js";
import ProfilePage from "./components/profile/ProfilePage.tsx";
import "./styles/login.css"
import Main from "./views/main.jsx"
import { UploadForm } from "./components/songstuff/uploadForm.js";



function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>

    // <div className='center'>
    //   <LoginForm></LoginForm>
    // </div>

    <Router>
      {Header()}
      <Routes>
        <Route path="/login" element={
          <div className='center'>
            <LoginPage></LoginPage>
          </div>
          }></Route>
          <Route path="/" element={<Main/>}></Route>
          <Route path="/profile" element={<ProfilePage/>}></Route>
          {/* <Route path='/main' element={<Main />}></Route> */}
      </Routes>
      {/* {Footer()} */}
    </Router>
  );
}

function Header (){
// return (
//             <nav>
//                 <ul>
//                     <li>
//                         <Link to="/">Home</Link>
//                     </li>
//                     <li>
//                         <Link to="/login">Login</Link>
//                     </li>                
//                 </ul>
//             </nav>
//         )
}

//TODO um the footer was breaking some of my pages lmao
function Footer(){
    return (
        <footer>
            <h3>I never know what to put in the footer :/</h3>
            {/* <p>{"foot".repeat(100)}</p> */}
        </footer>

    );
}

export default App;