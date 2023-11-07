import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom'

//import reportWebVitals from './reportWebVitals'
import UserInput from './UserInput'
import Texts from './Texts'
import About from './About'
import './index.css'
import { checkNymReady, connectMixnet, pingMessage } from './context/createConnection'

console.log()

if (module.hot) module.hot.accept()
window.nymReady = false


export default function App() {
   

    //hack to redirect old urlid to new
    if (!window.location.hash) {
       window.history.replaceState({}, null, "/#/"+window.location.pathname.split('/')[1])
    }
    connectMixnet()

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<UserInput />} />
                <Route path="/about" element={<About />} />
                <Route path="/:urlId" element={<Texts />} />
            </Routes>
        </HashRouter>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)

if(process.env.NODE_ENV !== "development" || ! process.env.NODE_ENV){
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then((registration) => {
                    console.log('SW registered: ', registration)
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError)
                })
        })
    }
}

