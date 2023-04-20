const getToken = window.location
    .hash
    .substring(1)
    .split("&")
    .reduce((obj, cur) => {
        if (!cur) return obj;

        let info = cur.split("=");
        obj[info[0]] = info[1];
        return obj;
    }, {});

window.location.hash = "";


export default getToken;