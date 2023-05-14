import { useEffect, useState } from 'react';
import userplus from '../assets/user-plus.svg';
import compare from '../assets/arrows-right-left.svg';
import check from '../assets/check.svg';
import x_mark from '../assets/x-mark.svg';
import './FriendList.css';

const FriendList = ({ user_id }) => {
    const [friendList, setFriendList] = useState(null);

    useEffect(() => {
        // if (!user_id) return;

        setFriendList([
            {
                id: "bxrxuxnxo",
                username: "Bruno Ramirez",
                requested: false,
            },
            {
                id: "ztrawberry",
                username: "Alessandra Llamocca",
                requested: false,
            },
            {
                id: "driverslicense",
                username: "loooooooooooooooong useeeeer",
                requested: false,
            },
            {
                id: "driverslicense",
                username: "sadaksdlkasjdkasjldkasjklsdfds",
                requested: true,
            }
        ]);

    }, [user_id]);

    const add_friend = (_other_id) => {
        if (!user_id) return;
        // TODO: Add friend with ID.
    };

    const accept_request = (_other_id) => {
        if (!user_id) return;
        // TODO: Accept the request using backend.
    };

    const cancel_request = (_other_id) => {
        if (!user_id) return;
        // TODO: remove the request using frontend.
    };

    const compare_with_user = (_other_user_id) => {
        if (!user_id) return;
        // TODO: Compare.
        this.props.onCompareUser(user_id, _other_user_id);
    };

    const frind_list_item = () => {
        return friendList?.map(({ id, username, requested, pending }) => {
            return (
                <li key={id} className={`list-none m-0 py-1 flex items-center justify-between border-b-2 border-slate-600 ${requested ? "new-notification" : ""}`}>
                    {
                        requested ? (<span className='md:w-[200px] text-lg font-semibold text-ellipsis overflow-hidden whitespace-nowrap'>{username}</span>) :
                            (<span className='md:w-[230px] text-lg font-semibold text-ellipsis overflow-hidden whitespace-nowrap'>{username}</span>)
                    }
                    {friend_controls({ id, requested, pending })}
                </li>
            );
        });
    };

    const friend_controls = ({ id, requested, pending }) => {
        if (requested) return (<span className="flex gap-1">
            <button className="hover:bg-green-100 active:bg-green-600 rounded px-[0.1em]">
                <img className="w-7" onClick={accept_request(id)} src={check} alt="compare-icon" />
            </button>
            <button className="hover:bg-red-100 active:bg-red-600 rounded px-[0.1em]">
                <img className="w-7" onClick={cancel_request(id)} src={x_mark} alt="compare-icon" />
            </button>
        </span>);
        else {
            if (pending) return (<span className="flex gap-2">
                ...
            </span>);
            else
                return (<span className="flex gap-2">
                    <button className="hover:bg-slate-400 active:bg-slate-600 rounded p-1">
                        <img className="w-6" onClick={compare_with_user(id)} src={compare} alt="compare-icon" />
                    </button>
                </span>);
        }
    };

    return (
        <div className="md:w-1/5 w-1/3 flex flex-col bg-slate-500 rounded-2xl p-8 gap-3 h-full overflow-y-visible text-white">
            <h4 className="text-3xl border-b-2 pb-3 font-bold text-center">FRIENDS</h4>

            <div className="h-full overflow-y-auto overflow-x-hidden">
                <ul className='list-none flex flex-col gap-2 m-0 pr-5 p-0 text-gray-200'>
                    {frind_list_item()}
                </ul>
            </div>

            <div className="flex flex-row h-fit max-h-fit gap-3">
                <input className="w-full p-2 border-2 bg-gray-200 appearance-none border-slate-200 rounded text-gray-700 leading-tight
                                  placeholder:px-2
                                  focus:outline-none focus:bg-white focus:border-green-600" placeholder='Add a friend'></input>
                <button className="w-fit hover:bg-slate-400 active:bg-slate-600 rounded-lg px-1">
                    <img className="w-10" src={userplus} alt="add friend"></img>
                </button>
            </div>

        </div>
    );
};

export default FriendList;