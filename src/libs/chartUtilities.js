const graph_color = [
    "green",
    "violet",
    "red",
    "purple",
    "orange",
    "yellow",
    "blue",
    "cyan"
];

const dataProcesser = (_data) => {

    let colors = graph_color;
    let tone = 0;
    const total_value = _data.reduce((a, b) => a + b.value, 0);
    const convertToPercent = (num) => Math.round((num / total_value) * 100);
    const convertToDegrees = (num) => Math.round((num / 100) * 360);

    const css_string = _data
        .reduce((items, item, index, array) => {
            items.push(item);

            item.count = item.count || 0;
            item.count += array[index - 1]?.count || item.count;
            item.start_value = array[index - 1]?.count ? array[index - 1].count : 0;
            item.end_value = item.count += item.value;
            item.start_percent = convertToPercent(item.start_value);
            item.end_percent = convertToPercent(item.end_value);
            item.start_degrees = convertToDegrees(item.start_percent);
            item.end_degrees = convertToDegrees(item.end_percent);
            tone = ((index % 9) + 1) * 100;
            item.color = `var(--color-${graph_color[index % graph_color.length]}-${tone})`;

            return items;
        }, []);
    // .map((chart, index) => {
    //     const { start_degrees, end_degrees } = chart;
    //     return `var(--color-green-${(index + 1) * 100}) ${start_degrees}deg ${end_degrees}deg`;
    // });

    return css_string;
};

const getArtistsGenres = (artists = []) => {
    return artists.reduce((ini, cur) => {
        if (!cur.genres) return ini;
        ini.push(...cur.genres);
        return ini;
    }, []);

    // let avg = Math.ceil(genres.reduce((ini, val) => ini += val[1], 0) / genres.length);
    // let others_genres = genres.filter(x => x[1] <= avg);
    // genres = genres.filter(x => x[1] > avg);
    // genres.splice(0, 0, ["Music Genre", "Q of songs"]);
    // genres.sort((a, b) => b[1] - a[1]);
    // genres.push(["Others", others_genres.length]);
    // setLikedSongs(genres);
};

const getGenresDistinct = (_genres = []) => {
    return _genres.reduce((acc, val) => {
        acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
        return acc;
    }, {});
};

const objectToArray = (_object = {}) => {
    return Object.entries(_object).reduce((ini, [key, val]) => {
        ini.push([key, val]);
        return ini;
    }, []);
};

export {
    dataProcesser,
    getArtistsGenres,
    getGenresDistinct,
    objectToArray,
};