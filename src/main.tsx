import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Layout from './layout.tsx';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Bill from './components/Bill/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <HashRouter>
        <Routes>
            <Route path='/' element={<Layout />} >
                <Route path='' element={<App />} />
                <Route path='/bill' element={<Bill />} />
            </Route>
        </Routes>
    </HashRouter>
)
