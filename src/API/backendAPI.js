const backendURL = "http://127.0.0.1:8000";

const getUser = async (_user_id) => {
    return fetch(`${backendURL}/getuser/${_user_id.$oid}`, {
        method: "GET",
    }).then((res) => res.json());
};  

const addUser = async (_user) => {
    const user = {
        id: _user.id,
        display_name: _user.display_name,
        country: _user.country,
        image: _user.images[0].url,
        product: _user.product,
        email: _user.email,
        friends: [],
    };

    return fetch(`${backendURL}/adduser`, {
        method: "POST",
        body: JSON.stringify(user),
    }).then((res) => res.json());
};

const addTracks = async (_user_id, _tracks = []) => {
    const tracks = _tracks.map(({ added_at, track }) => {
        return {
            user_id: _user_id,
            added_at: added_at,
            track: {
                id: track.id,
                name: track.name,
                song_link: track.external_urls.spotify,
                cover_image: track.album.images[0]?.url,
                artists: track.artists.map(a => {
                    return {
                        id: a.id,
                        name: a.name,
                        image: (a.images[0] ?? { url: "" }).url,
                        genres: a.genres,
                    };
                })
            }
        };
    });

    // console.log(tracks);
    // return new Promise(async () => {
    //     try
    //     {
    //         let res = await fetch(`${backendURL}/addsavedtracks`, {
    //             method: "POST",
    //             body: JSON.stringify(tracks)
    //         });
    //         let data = await res.json();
    //         return data;
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    //     // fetch(`${backendURL}/addsavedtracks`, {
    //     //     method: "POST",
    //     //     body: JSON.stringify(tracks)
    //     // }).then(handleErrors).then((res) => {
    //     //     res.json();
    //     // }).catch((error) => {

    //     // });
    // });
    return fetch(`${backendURL}/addsavedtracks`, {
            method: "POST",
            body: JSON.stringify(tracks)
        })
        .then(function (response) {
            if (response.ok) { return response.json(); }
            throw new Error('Something went wrong.');
        })
        .then(function (res) {
            console.log(res);
        })
        .catch(function (error) {
            // console.log(error);
        });
};

const getTracks_mongo = async (_user_id) => {
    return fetch(`${backendURL}/gettracks/${_user_id}`, {
        method: "GET",
    }).then((res) => res.json());
};

export {
    getUser,
    addUser,
    addTracks,
    getTracks_mongo,
};