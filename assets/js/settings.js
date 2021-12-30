const settingsMenu = document.getElementById('sideMenu');
const settingsButton = document.getElementById('settingsMenu');
let menuOpen = false;
settingsButton.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen){
        settingsMenu.classList.add('MenuOpen');
        settingsMenu.classList.remove('MenuClosed');
    }else{
        settingsMenu.classList.remove('MenuOpen');
        settingsMenu.classList.add('MenuClosed');
    }
});

const mapSelect = document.getElementById('mapSelect');
mapSelect.value = state.selectedMapBackground;
updateMapBackground(state.selectedMapBackground);

mapSelect.addEventListener('change', () => {
    let value = mapSelect.value;
    updateState('selectedMapBackground', parseInt(value));
    updateMapBackground(parseInt(value));
});

const mapShowGroundwork = document.getElementById('mapShowGroundwork');
mapShowGroundwork.checked = state.showGroundwork;
mapShowGroundwork.addEventListener('change', () => {
    let value = mapShowGroundwork.checked;
    updateState('showGroundwork', value);
});

const mapShowRails = document.getElementById('mapShowRails');
mapShowRails.checked = state.showRails;
mapShowRails.addEventListener('change', () => {
    let value = mapShowRails.checked;
    updateState('showRails', value);
});

const mapShowTrains = document.getElementById('mapShowTrains');
mapShowTrains.checked = state.showTrains;
mapShowTrains.addEventListener('change', () => {
    let value = mapShowTrains.checked;
    updateState('showTrains', value);
});

const mapShowCarts = document.getElementById('mapShowCarts');
mapShowCarts.checked = state.showCarts;
mapShowCarts.addEventListener('change', () => {
    let value = mapShowCarts.checked;
    updateState('showCarts', value);
});

const mapShowStructures = document.getElementById('mapShowStructures');
mapShowStructures.checked = state.showStructures;
mapShowStructures.addEventListener('change', () => {
    let value = mapShowStructures.checked;
    updateState('showStructures', value);
    DrawIndustries();
});