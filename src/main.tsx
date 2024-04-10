import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Layout from './layout.tsx';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Bill from './components/Bill/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout />} >
                {['', 'home'].map((item, idx) => <Route key={idx} path={item} element={<App />} />)}
                <Route path='/bill' element={<Bill />} />
            </Route>
        </Routes>
    </BrowserRouter>
)
