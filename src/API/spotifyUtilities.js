const spotifyURL = "https://api.spotify.com/v1";

const getTracks = async (_token, _limit = 20, _offset = 0, _market = undefined) => {
    return fetch(`${spotifyURL}/me/tracks?limit=${_limit}&offset=${_offset}${_market === undefined ? "" : `market=${_market}`}`, { method: "GET", headers: { "Authorization": `Bearer ${_token}` } })
        .then((res) => res.json());
};

const getArtists = async (_token, _ids = []) => {
    return fetch(`${spotifyURL}/artists?ids=${_ids.join(",")}`, { method: "GET", headers: { "Authorization": `Bearer ${_token}` } })
        .then((res) => res.json());
};

const getProfile = async (_token) => {
    return fetch(`${spotifyURL}/me`, { method: "GET", headers: { "Authorization": `Bearer ${_token}` } })
        .then((res) => res.json());
};

export {
    getTracks,
    getProfile,
    getArtists
};