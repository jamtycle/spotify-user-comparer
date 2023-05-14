import Cookies from 'universal-cookie';
const cookies = new Cookies();

const setSessionCookie = (_token) => {
    cookies.set('spotify-session', _token.access_token, {
        path: '/',
        expires: new Date(Date.now() + (_token.expires_in * 1000)),
    });
};

const getSessionCookie = cookies.get("spotify-session");

const setUserID = (_user) => {
    cookies.set('user_id', _user, {
        path: '/',
        expires: new Date(Date.now() + (604800 * 1000)), // 1 week
    });
};

const getUserID = cookies.get('user_id');

export {
    setSessionCookie,
    getSessionCookie,
    setUserID,
    getUserID,
};
