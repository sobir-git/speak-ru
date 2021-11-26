export async function getPassage(passageId, onsuccess, onfailure = (error) => { throw new Error(passages); }) {
    const res = await fetch("/api/get-passage/" + encodeURI(passageId));
    const json = await res.json();

    if (res.ok) {
        onsuccess(json);
        return json
    } else {
        onfailure(json)
    }
}

export function insertUrlParam(key, value) {
    if (history.replaceState) {
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set(key, value);
        let newurl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?" +
            searchParams.toString();
        window.history.replaceState({ path: newurl }, "", newurl);
    }
}


export function getUrlParam(key, defaultValue) {
    let searchParams = new URLSearchParams(window.location.search);
    let value = searchParams.get(key)
    if (value) {
        return value;
    }
    return defaultValue;
}