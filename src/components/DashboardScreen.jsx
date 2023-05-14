import { useState, useEffect, React } from 'react';
import ChartLegend from './ChartLegend.jsx';
import { splitInChunks } from '../libs/arrayUtilities.js';
import { Chart } from "react-google-charts";
import { getArtists, getProfile, getTracks } from '../API/spotifyUtilities.js';
import { getArtistsGenres, getGenresDistinct, objectToArray } from '../libs/chartUtilities.js';
import { addTracks, getTracks_mongo, addUser, getUser } from '../API/backendAPI.js';
import { getUserID, setUserID } from '../libs/cookieManager.js';
import FriendList from './FriendList.jsx';

const DashboardScreen = ({ token }) => {
    const [pieData, setPieData] = useState(null);
    const [likedSongs, setLikedSongs] = useState(null);
    const [likedTitle, setLikedTitle] = useState(null);
    const [likedSubTitle, setLikedSubTitle] = useState(null);
    const [likedArtists, setLikedArtists] = useState(null);
    const [user, setUser] = useState(null);

    const options = {
        title: "",
        chartArea: {
            top: "5%",
            bottom: "5%",
            left: "-2%",
            right: "-2%",
        },
        backgroundColor: "transparent",
        pieHole: 0.4,
        is3D: false,
        legend: {
            position: "none"
        },
        pieSliceBorderColor: "transparent",
        width: "50%",
        height: "100%"
    };

    const chartEvents = [
        {
            eventName: "error",
            callback({ chartWrapper }) {
                chartWrapper.getContainer().innerHTML = null;
            }
        },
        {
            eventName: "ready",
            callback: ({ chartWrapper }) => {
                // chartWrapper.getChart().setOption('pieSliceText', { borderWidth: 0 });
            },
        },
    ];

    const compareUser = async (_user_id, _other_user_id) => {
        if (!user) return;
        if (_user_id !== user.user_id) return;

        const user_tracks = !likedSongs ? await getTracks_mongo(_user_id) : likedSongs; 
        const other_tracks = await getTracks_mongo(_other_user_id); 

        // First approach: Naive approach.
        const coincidences = [];
        // first determine which one is shorter.
        // and then just iterate the shorter one to get the values that repeats.
        if (user_tracks.length > other_tracks.length) {
            for (let i = 0; i < other_tracks.length; i++) {
                const current = other_tracks[i];
                if (user_tracks.find(x => current.track.id === i.track.id)) {
                    coincidences.push(current);
                }
            }
        } else {
            for (let i = 0; i < user_tracks.length; i++) {
                const current = user_tracks[i];
                if (other_tracks.find(x => current.track.id === i.track.id)) {
                    coincidences.push(current);
                }
            }
        }

        // TODO: use coincidences to generate the charts.

        // Second approach: https://stackoverflow.com/questions/19815335/similarity-between-two-data-sets-or-arrays
        // Math distance:
        //          If we sum up a value (let's say the name of each song translated to a number) we can get
        //          a sum for each value and then get the distance between the playlists. This could improve performance greatly.
        //          However, there is something to take in consideration, the use of the a math approach, require to use data
        //          that is meaningful for our purpouse, that being said, if we use the name of the song translated to a number,
        //          we could end up with names that are similar in value, therefore we will have playlists that are not similar
        //          throwing an incorrect match %
        //  The pros of this, is that the result will be incredibly fast, and can be use to show some percentage to the user.
        //  The cons is that, the result is not a full set of similar tracks, which cannot be used in order to have some charts with detail information.

        // Third approach:
        // Graphs:
        //      Using graphs could be a solution, either, using a bin-tree graph that allow us to order the tracks and then searching for them,
        //      that itself is a good way to do it, will be basically implied the use of bin search, and also, doing something like,
        //      a non weighted graph will allow us to move between songs, however, I believe that the best approach is to go with bin-search,
        //      using a binary tree structure like.
        //  The pros of using graphs/trees is that we can get the searches at a incredibly fast speed
        //  

    };

    useEffect(() => {
        if (!likedSongs || !likedArtists || !user) return;

        likedSongs.map(t => {
            t.track.artists = t.track.artists.map(a => {
                let info = likedArtists.find(ar => a.id === ar.id);
                if (info === undefined) console.log(info);
                return info;
            });
            return t;
        });

        addTracks(user.id, likedSongs);
    }, [likedSongs, likedArtists, user]);

    useEffect(() => {
        console.log("running data fetch..."); 
        setLikedSongs([["Music Genre", "Q of songs"]]);
        if (!token || !token.access_token || !user) return;

        async function fetchDataLocal() {
            let data = [];
            let offset = 0;

            let tracks = await getTracks_mongo(user.id);
            if (!tracks || tracks.length === 0) return "spotify";

            let genres = tracks.reduce((ini, t) => {
                ini.push(...t.track.artists.reduce((ini, cur) => { ini.push(...cur.genres); return ini; }, []));
                return ini;
            }, []);

            data = objectToArray(getGenresDistinct(genres)); 
            let avg = Math.ceil(data.reduce((ini, val) => { ini += val[1]; return ini; }, 0) / data.length);
            let others_genres = data.filter(x => x[1] <= avg);
            data = data.filter(x => x[1] > avg);
            data.sort((a, b) => b[1] - a[1]);
            data.push(["Others", others_genres.length]);
            data.splice(0, 0, ["Music Genre", "Q of songs"]);

            setLikedSubTitle(`Last ${offset} liked songs`);
            setPieData(data);

            return "done";
        }

        async function fetchData() {

            let genres = [];
            let l_artists = [];
            let data = [["Music Genre", "Q of songs"]];
            let saved_tracks = [];
            let tracks;
            let offset = 0;
            while ((tracks = await getTracks(token.access_token, 50, offset)).items.length > 0) {
                offset += tracks.items.length;

                saved_tracks.push(...tracks.items);
                setLikedSongs(saved_tracks);
                let artists_ids = tracks.items.reduce((ini, { track }) => { ini.push(...track.artists.map(a => a.id)); return ini; }, []);

                // artists_ids = Array.from(new Set(artists_ids));

                let artists_chunks = splitInChunks(artists_ids, 50);
                for (let i = 0; i < artists_chunks.length; i++) {
                    const { artists } = await getArtists(token.access_token, artists_chunks[i]);
                    l_artists.push(...artists);
                    // setLikedArtists(artists);
                }

                genres = getArtistsGenres(l_artists);

                // if (data.length >= 1) data = data.slice(0, data.length - 1);
                data = objectToArray(getGenresDistinct(genres)); 
                // if (data.length >= 1) data = data.slice(0, data.length - 1);
                // data.push(...info);
                let avg = Math.ceil(data.slice(1).reduce((ini, val) => {
                    if (val[0] === "Others") return ini;
                    ini += val[1];
                    return ini;
                }, 0) / data.length);
                let others_genres = data.filter(x => x[1] <= avg);
                data = data.filter(x => x[1] > avg);
                // data.splice(0, 0, ["Music Genre", "Q of songs"]);
                data.sort((a, b) => b[1] - a[1]);
                data.push(["Others", others_genres.length]);
                data.splice(0, 0, ["Music Genre", "Q of songs"]);

                // s_tracks.push(...info);

                setLikedSubTitle(`Last ${offset} liked songs`);
                setPieData(data);
            }

            setLikedArtists(l_artists);
        }

        fetchDataLocal().then(x => {
            if (x === "spotify") {
                fetchData();
            }
        });

    }, [token, user]);

    useEffect(() => {
        // setLikedSubTitle("Last 50 liked songs");
        let user_id = getUserID;
        if (user_id) {
            getUser(user_id).then(user => {
                setUser(user);
                setLikedTitle(`${user.display_name} Liked Songs Pie`);
            });
        } else {
            getProfile(token.access_token).then(prof => {
                setUser(prof);
                setLikedTitle(`${prof.display_name} Liked Songs Pie`);

                addUser(prof).then(res => {
                    if (res.upsertedId) setUserID(res.upsertedId);
                    // console.log(res);
                    // setUserID(JSON.stringify(res));
                });
            });
        }
    }, [token.access_token]);

    return (
        <div className="flex flex-row gap-4 h-4/5 w-11/12">
            <div className="md:w-4/5 flex flex-row bg-slate-500 rounded-2xl p-8 gap-14 overflow-y-visible">
                <Chart data={pieData} chartType="PieChart" className="w-full-important" options={options} chartEvents={chartEvents} />
                <ChartLegend data={pieData} title={likedTitle} sub_title={likedSubTitle}></ChartLegend>
            </div>
            <FriendList user_id={user?.user_id} onCompareUser={compareUser}></FriendList>
        </div>
    );
};

export default DashboardScreen;