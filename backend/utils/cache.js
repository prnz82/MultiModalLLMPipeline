const cache = new Map();

function getFromCache(key) {
    if (cache.has(key)) {
        return cache.get(key);
    }
    return null;
}

function setInCache(key, value) {
    cache.set(key, value);
}

module.exports = { getFromCache, setInCache };
