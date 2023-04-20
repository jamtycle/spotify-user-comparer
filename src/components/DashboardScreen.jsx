import { useState, useEffect, React } from 'react';
import ChartLegend from './ChartLegend.jsx';
import { splitInChunks } from '../libs/arrayUtilities.js';
import { Chart } from "react-google-charts";
import { getArtists, getProfile, getTracks } from '../API/spotifyUtilities.js';
import { getArtistsGenres, getGenresDistinct, objectToArray } from '../libs/chartUtilities.js';

const DashboardScreen = ({ token }) => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [likedTitle, setLikedTitle] = useState(null);
    const [likedSubTitle, setLikedSubTitle] = useState(null);

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

    useEffect(() => {
        setLikedSongs([["Music Genre", "Q of songs"]]);
        const genres = [];
        getTracks(token.access_token, 50).then(tracks => {
            let artists_ids = tracks.items.map(x => x.track.artists[0].id);
            artists_ids = splitInChunks(artists_ids, 50);
            artists_ids.forEach(async (aids) => {
                genres.push(...getArtistsGenres((await getArtists(token.access_token, aids)).artists));

                let info = objectToArray(getGenresDistinct(genres));
                let avg = Math.ceil(info.reduce((ini, val) => ini += val[1], 0) / info.length);
                let others_genres = info.filter(x => x[1] <= avg);
                info = info.filter(x => x[1] > avg);
                info.splice(0, 0, ["Music Genre", "Q of songs"]);
                info.sort((a, b) => b[1] - a[1]);
                info.push(["Others", others_genres.length]);
                setLikedSongs(info);
            });
        });
    }, [token.access_token]);

    useEffect(() => {
        setLikedSubTitle("Last 50 liked songs");
        getProfile(token.access_token).then(prof => {
            setLikedTitle(`${prof.display_name} Liked Songs Pie`);
        });
    }, [token.access_token]);

    return (
        <div className="w-4/5 flex flex-row bg-slate-500 rounded-2xl p-8 gap-14 h-4/5 overflow-y-visible">
            <Chart  chartType="PieChart"
                    className="w-full-important"
                    data={likedSongs}
                    options={options}
                    chartEvents={chartEvents} />
            <ChartLegend data={likedSongs} title={likedTitle} sub_title={likedSubTitle}></ChartLegend> 
        </div>
    );
};

export default DashboardScreen;