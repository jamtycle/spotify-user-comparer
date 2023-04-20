import userlogo from '../assets/user.svg';
import arrowRightLeftlogo from '../assets/arrows-right-left.svg';
import { auth_endpoint, client_id, redirect_uri, scopes } from '../libs/configs.js';

const PrincipalScreen = ({ token }) => {

    const loginButton = (_token) => {
        if (_token && _token.access_token) return null;

        let params = [
            `client_id=${client_id}`,
            `redirect_uri=${redirect_uri}`,
            `scope=${scopes.join("%20")}`,
        ];
        return (
            <a  className="rounded-full bg-green-400 px-6 py-3 font-semibold text-xl"
                href={`${auth_endpoint}?${params.join("&")}&response_type=token&show_dialog=true`}>Login with Spotify</a>
        );
    };

    // const [data, setdata] = useState(null);

    // useEffect(() => {
    //     fetch("")
    //         .then((res) => res.json())
    //         .then((json) => {
    //             setdata(json);
    //         });
    // }, data);

    return (
        <>
            <div className="flex flex-row mb-5">
                <img src={userlogo} className="w-40" alt="user1" />
                <img src={arrowRightLeftlogo} className="w-20" alt="user1" />
                <img src={userlogo} className="w-40" alt="user1" />
            </div>
            <h1 className="mb-5 text-white font-semibold text-5xl">Spotify Comparer</h1>
            {loginButton(token)}
        </>
    );
};

export default PrincipalScreen;