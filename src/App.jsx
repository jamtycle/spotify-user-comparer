import { useState, useEffect } from 'react';
import PrincipalScreen from './components/PrincipalScreen.jsx';
import getToken from './libs/token.js';
import DashboardScreen from './components/DashboardScreen.jsx';
import { getSessionCookie, setSessionCookie } from './libs/cookieManager.js';

function App() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        console.log("Token readed");
        let token = getToken;
        if (Object.keys(token).length === 0) {
            let session_cookie = getSessionCookie;
            if (!session_cookie) return;
            setToken({ access_token: session_cookie });
        }
        else {
            setSessionCookie(token);
            setToken(getToken);
        }
    }, []);

    const screenRenderer = (_token) => {
        // console.clear();
        if (!_token || !_token.access_token) return (<PrincipalScreen token={token}></PrincipalScreen>);
        else return (<DashboardScreen token={token}></DashboardScreen>);
    };

    return (
        <>
            {screenRenderer(token)}
        </>
        // <div className="App">
        //     <div>;
        //         <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
        //             <img src={viteLogo} className="logo" alt="Vite logo" />
        //         </a>
        //         <a href="https://reactjs.org" target="_blank" rel="noreferrer">
        //             <img src={reactLogo} className="logo react" alt="React logo" />
        //         </a>
        //     </div>
        //     <h1>Vite + React</h1>
        //     <div className="card">
        //         <button onClick={() => setCount((count) => count + 1)}>
        //             count is {count}
        //         </button>
        //         <p>
        //             Edit <code>src/App.jsx</code> and save to test HMR
        //         </p>
        //     </div>
        //     <p className="read-the-docs">
        //         Click on the Vite and React logos to learn more
        //     </p>
        // </div>
    );
}

export default App;


