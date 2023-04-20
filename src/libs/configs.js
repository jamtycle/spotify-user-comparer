const auth_endpoint = "https://accounts.spotify.com/authorize";
const client_id = "9ed9ef5611c14d1abdb923719f4dd9b9";
const redirect_uri = "https://jamtycle.github.io/spotify-user-comparer/";
const scopes = [
    "user-library-read",
    "user-top-read",
    "user-read-private",
    "user-read-currently-playing",
    "user-read-playback-state",
];

export {
    auth_endpoint,
    client_id,
    redirect_uri,
    scopes
};