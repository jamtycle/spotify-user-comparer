const splitInChunks = (_array, _chunk_size) => {
    const result = [];
    for (let i = 0; i < _array.length; i += _chunk_size) {
        result.push(_array.slice(i, i + _chunk_size));
    }
    return result;
};

export {
    splitInChunks,
};