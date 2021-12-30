const storage = window.localStorage;

let state = {};
if (storage.getItem('state') === null){
    state = {
        selectedMapBackground: 1,
        showGroundwork: true,
        showRails: true,
        showTrains: true,
        showCarts: true,
        showStructures: true
    };
    storage.setItem('state', btoa(JSON.stringify(state)));
}else{
    state = JSON.parse(atob(storage.getItem('state')));
}

const saveState = () => {
    storage.setItem('state', btoa(JSON.stringify(state)));
};
const updateState = (key, value) => {
    state[key] = value;
    saveState();
};