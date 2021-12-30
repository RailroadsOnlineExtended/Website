let map = L.map('map', {
    center: [0, 0],
    zoom: 11,
    doubleClickZoom: false
});
let imageBounds = [[-10, -10], [10, 10]];

let MapOutline = [[-10, -10], [-10, 10], [10, 10], [10, -10], [-10, -10]];
L.polyline(MapOutline, {color: 'black'}).addTo(map);

//Center
L.marker([0, 0]).addTo(map);

function rotate(cx, cy, x, y, angle) {
    let radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

const updateMapBackground = (index) => {
    let MapBg = './assets/images/map/layers/bg'+index+'.jpg';
    L.imageOverlay(MapBg, imageBounds, {
        zIndex: 0
    }).addTo(map);
};

let Track = [];
let TrendleTrack = [];
let VariableBank = [];
let ConstantBank = [];
let VariableWall = [];
let ConstantWall = [];
let WoodenBridge = [];
let IronBridge = [];
let DrawnLines = [];
let Industries = [];
let DrawnIndustries = [];
let DrawnIndustriePopups = [];
let Switches = [];
let DrawnSwitches = [];
let DrawnSwitchClickMarkers = [];
let TurnTables = [];
let DrawnTurnTables = [];
let Players = [];
let DrawnPlayers = [];
// Frames
// WaterTowers

const ParseData = (data) => {
    Industries = data.Industries;
    Switches = data.Switches;
    TurnTables = data.Turntables;
    Players = data.Players;
    data.Splines.forEach((spline) => {
        if (spline.Type === 0){
            Track.push(spline);
        }
        if (spline.Type === 1){
            VariableBank.push(spline);
        }
        if (spline.Type === 2){
            ConstantBank.push(spline);
        }
        if (spline.Type === 3){
            WoodenBridge.push(spline);
        }
        if (spline.Type === 4){
            TrendleTrack.push(spline);
        }
        if (spline.Type === 5){
            VariableWall.push(spline);
        }
        if (spline.Type === 6){
            ConstantWall.push(spline);
        }
        if (spline.Type === 7){
            IronBridge.push(spline);
        }
    });
};

const DrawLines = (array) => {
    if (array.length === 0) return;
    let firstItem = array[0];

    if (DrawnLines[firstItem.Type] !== undefined){
        map.removeLayer(DrawnLines[firstItem.Type]);
    }

    if (firstItem.Type === 1 || firstItem.Type === 2 || firstItem.Type === 5 || firstItem.Type === 6 || firstItem.Type === 3 || firstItem.Type === 7){
        if (!state.showGroundwork) return;
    }
    if (firstItem.Type === 0 || firstItem.Type === 4){
        if (!state.showRails) return;
    }

    let LineCords = [];
    array.forEach((bank) => {
        let segments = bank.Segments;
        segments.filter( ( s ) => s.Visible === true ).map( ( segment, i ) => {
            if (segment.LocationStart == null) return;
            if (segment.LocationEnd == null) return;
            if (!segment.Visible) return;

            let y1 = (segment.LocationStart[0] / -20000);
            let x1 = (segment.LocationStart[1] / 20000);
            let y2 = (segment.LocationEnd[0] / -20000);
            let x2 = (segment.LocationEnd[1] / 20000);

            let item = [
                [x1, y1],
                [x2, y2]
            ];
            LineCords.push(item);
        });
    });
    let splineDef = SplineDefinitions[firstItem.Type];
    let options = {
        corridor: splineDef.width, // meters
        color: splineDef.color,
        zIndex: splineDef.zIndex
    };
    let corridor = L.corridor(LineCords, options);
    map.addLayer(corridor);

    let corridorElement = corridor.getElement();
    corridorElement.style.setProperty('z-index', splineDef.zIndex, 'important');

    DrawnLines[firstItem.Type] = corridor;
};

const DrawIndustries = () => {
    Industries.forEach((Industry) => {
        if (DrawnIndustries[Industry.Type] !== undefined){
            map.removeLayer(DrawnIndustries[Industry.Type]);
        }
        if (!state.showStructures) {
            DrawnIndustriePopups.forEach(({Popup}, key) => {
                map.removeLayer(Popup);
                delete DrawnIndustriePopups[key];
            });
            return;
        }

        var svgImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgImage.setAttribute('xmlns', "http://www.w3.org/2000/svg");

        let IndustrieSvg = IndustrySvgs[Industry.Type];
        if (IndustrieSvg === undefined){
            return;
        }
        svgImage.innerHTML = IndustrieSvg.svg;

        let x = (Industry.Location[0] / -20000);
        let y = (Industry.Location[1] / 20000);
        let offsetX = IndustrieSvg.options.offsetX;
        let offsetY = IndustrieSvg.options.offsetY;
        x = x + offsetX;
        y = y + offsetY;

        var PopupIcon = L.icon({
            iconUrl: './assets/images/info.png',
            iconSize: [40, 40],
            popupAnchor: [0, -18],
            iconAnchor: [20, 20],
        });
        let IndustryPopup = L.marker([y+IndustrieSvg.options.icon.offsetY, x+IndustrieSvg.options.icon.offsetX], {icon: PopupIcon});
        IndustryPopup.addTo(map);
        IndustryPopup.bindPopup(GenerateStorageInfo({
            Input: Industry.Educts,
            Output: Industry.Products
        }));
        IndustryPopup.getElement().classList.add('infoIcon');

        let svgElementBounds = [
            [ y, x ],
            [ y+0.1, x+0.05 ] ];
        let svgOverlay = L.svgOverlay(svgImage, svgElementBounds);
        svgOverlay.addTo(map);
        let svgElement = svgOverlay.getElement();
        svgElement.style.transformOrigin = "center center";
        svgElement.style.setProperty('z-index', 30, 'important');

        let rotation = IndustrieSvg.options.rotation;
        let scale = IndustrieSvg.options.scale;
        let width = IndustrieSvg.options.width;
        let height = IndustrieSvg.options.height;

        svgElement.setAttribute('viewBox', '0 0 '+width+' '+height);
        svgElement.setAttribute('rotation', rotation);
        svgElement.setAttribute('scale', scale);
        svgElement.setAttribute('type', 'Type'+Industry.Type);

        svgElement.style.transform += " rotate(" + rotation + "deg)";
        svgElement.style.transform += " scale(" + scale + ")";

        DrawnIndustries[Industry.Type] = svgOverlay;
        DrawnIndustriePopups[Industry.Type] = {
            Popup: IndustryPopup,
            Industry: Industry
        };
    });
};

const UpdateIndustriePopups = () => {
    DrawnIndustriePopups.forEach(({Popup, Industry}, key) => {
        Popup.bindPopup(GenerateStorageInfo({
            Input: Industry.Educts,
            Output: Industry.Products
        }));
    });
};

const ToggleSwitch = (Switch) => {
    let state = Boolean(Switch.Side);
    Switches[Switch.ID].Side = !state;
};

const DrawSwitchClickBoxes = () => {
    Switches.forEach((Switch) => {
        let Type = Switch.Type;
        let Location = Switch.Location;
        let px = (Location[1] / 20000);
        let py = (Location[0] / -20000);

        if( Type === 6 ) return;

        let SwitchIcon = L.icon({
            iconUrl: './assets/images/control-lever-left.png',
            iconSize: [40, 40]
        });
        let SwitchToggleButton = L.marker([px, py], {
            icon: SwitchIcon
        });
        SwitchToggleButton.addTo(map);

        SwitchToggleButton.on('click', function (e){
            ToggleSwitch(Switch);
        });
        DrawnSwitchClickMarkers.push(SwitchToggleButton);
    });
};

const DrawSwitches = () => {
    DrawnSwitches.forEach((value, key) => {
        map.removeLayer(value);
        delete DrawnSwitches[key];
    });
    if (!state.showRails) return;

    Switches.forEach((Switch) => {
        let Type = Switch.Type;
        let Side = Switch.Side;
        let Location = Switch.Location
        let Rotation = Switch.Rotation;

        let state = Boolean(Side);
        let switchDef = SwitchDefinitions[Switch.Type];
        let splineDef = SplineDefinitions[0];

        if (Type === 0 || Type === 5){
            state = !state;
        }

        //Cross
        if( Type === 6 ) {
            let rotation = (Rotation[1] + 90) * -1;

            let crossLength = 0.019;
            let px = (Location[1] / 20000);
            let py = (Location[0] / -20000);

            let x1 = px - crossLength;
            let endPoint1 = rotate(px, py, x1, py, rotation);
            let lineCenterX = ((px + endPoint1[0]) / 2);
            let lineCenterY = ((py + endPoint1[1]) / 2);

            let endPoint2 = rotate(lineCenterX, lineCenterY, px, py, 90);
            let endPoint3 = rotate(lineCenterX, lineCenterY, px, py, -90);

            let CrossCords = [
                [[px, py], [endPoint1[0], endPoint1[1]]],
                [[lineCenterX, lineCenterY], [endPoint2[0], endPoint2[1]]],
                [[lineCenterX, lineCenterY], [endPoint3[0], endPoint3[1]]]
            ];
            let options = {
                corridor: splineDef.width,
                color: splineDef.color
            };
            let CrossCorridor = L.corridor(CrossCords, options);
            CrossCorridor.addTo(map);
            DrawnSwitches.push(CrossCorridor);
        }else{
            let rotation = (Rotation[1] + 180) * -1;

            let crossLength = 0.093;
            let px = (Location[1] / 20000);
            let py = (Location[0] / -20000);

            let x1 = px - crossLength;
            let endPoint1 = rotate(px, py, x1, py, rotation);

            let AditionalRotation = 0;
            if(switchDef.direction === -6){
                AditionalRotation = 5.8;
            }else {
                AditionalRotation = -5.8;
            }
            let endPoint2 = rotate(px, py, x1, py, rotation + AditionalRotation);

            let SwitchLineStraight = [
                [[px, py], [endPoint1[0], endPoint1[1]]]
            ];
            let SwitchLineCurve = [
                [[px, py], [endPoint2[0], endPoint2[1]]]
            ];

            let corridorActive;
            let corridorInActive;
            if (state){
                let optionsActive = {
                    corridor: splineDef.width,
                    color: 'red'
                };
                corridorActive = L.corridor(SwitchLineStraight, optionsActive);
                corridorActive.addTo(map);

                let optionsInActive = {
                    corridor: splineDef.width,
                    color: splineDef.color
                };
                corridorInActive = L.corridor(SwitchLineCurve, optionsInActive);
                corridorInActive.addTo(map);
            }else{
                let optionsInActive = {
                    corridor: splineDef.width,
                    color: 'red'
                };
                corridorInActive = L.corridor(SwitchLineCurve, optionsInActive);
                corridorInActive.addTo(map);

                let optionsActive = {
                    corridor: splineDef.width,
                    color: splineDef.color
                };
                corridorActive = L.corridor(SwitchLineStraight, optionsActive);
                corridorActive.addTo(map);
            }

            DrawnSwitches.push(corridorActive);
            DrawnSwitches.push(corridorInActive);
        }
    });
};

const DrawTurnTables = () => {
    TurnTables.forEach((TurnTable) => {
        let Location = TurnTable.Location;
        let Rotation = TurnTable.Rotation;
        let Deck = TurnTable.Deck;
        let splineDef = SplineDefinitions[0];

        let rotation = (Rotation[1]) * -1;
        let deckRotation = (Deck[1]) * -1;
        let crossLength = 0.065;
        let px = (Location[1] / 20000);
        let py = (Location[0] / -20000);

        let x1 = px - crossLength;
        let endPoint1 = rotate(px, py, x1, py, rotation);
        let lineCenterX = ((px + endPoint1[0]) / 2);
        let lineCenterY = ((py + endPoint1[1]) / 2);

        L.circle([lineCenterX, lineCenterY], {
            radius: 3900,
            color: 'blue',
            weight: 0,
            fillColor: 'darkgray',
            fillOpacity: 1
        }).addTo(map);
        L.circle([lineCenterX, lineCenterY], {
            radius: 3300,
            color: 'blue',
            weight: 0,
            fillColor: 'lightyellow',
            fillOpacity: 1
        }).addTo(map);

        let LineEnd1 = rotate(lineCenterX, lineCenterY, px, py, deckRotation);
        let LineEnd2 = rotate(lineCenterX, lineCenterY, px, py, deckRotation+180);

        let TableCords = [
            [[lineCenterX, lineCenterY], [LineEnd1[0], LineEnd1[1]]],
            [[lineCenterX, lineCenterY], [LineEnd2[0], LineEnd2[1]]]
        ];
        let options = {
            corridor: splineDef.width,
            color: 'black',
            lineCap: 'square'
        };
        let CrossCorridor = L.corridor(TableCords, options);
        CrossCorridor.addTo(map);
    });
};

const DrawPlayers = () => {
    Players.forEach((Player) => {
        let ID = Player.ID;
        let x = (Player.Location[0] / -20000) - 0.025;
        let y = (Player.Location[1] / 20000) - 0.069;
        let playerRotation = (Player.Rotation[1] - 90) * -1;

        if (DrawnPlayers[ID] !== undefined){
            map.removeLayer(DrawnPlayers[ID]);
        }

        let svgElementBounds = [
            [ y, x ],
            [ y+0.15, x+0.05 ] ];

        var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        svgElement.innerHTML = LocationSvg;
        let playerSvgOverlay = L.svgOverlay(svgElement, svgElementBounds, {
            interactive: true
        });
        playerSvgOverlay.addTo(map);
        playerSvgOverlay.bindPopup(GeneratePlayerPopup(Player));

        let playerSvgElement = playerSvgOverlay.getElement();
        playerSvgElement.style.transformOrigin = "center center";
        playerSvgElement.style.setProperty('z-index', 50, 'important');
        svgElement.setAttribute('viewBox', '0 0 200 250');

        let scale = 0.5;
        svgElement.setAttribute('scale', scale);
        playerSvgElement.style.transform += " scale(" + scale + ")";
        playerSvgElement.style.transform += " rotate(" + playerRotation + "deg)";
        DrawnPlayers[ID] = playerSvgOverlay;
    });
};

map.on('zoomend', function() {
    let zoomlevel = map.getZoom();
    DrawnSwitchClickMarkers.forEach((DrawnSwitchClickMarker) => {
        let markerElement = DrawnSwitchClickMarker.getElement();
        if (zoomlevel < 10){
            markerElement.style.setProperty('display', 'none');
        }else{
            markerElement.style.setProperty('display', 'block');
        }
    });
    DrawnIndustries.forEach((Industry) => {
        let svgElement = Industry.getElement();

        let rotation = svgElement.getAttribute('rotation');
        svgElement.style.transform += " rotate(" + rotation + "deg)";

        let scale = svgElement.getAttribute('scale');
        svgElement.style.transform += " scale(" + scale + ")";
    });
    DrawnPlayers.forEach((Player) => {
        let svgElement = Player.getElement();
        let scale = svgElement.getAttribute('scale');
        svgElement.style.transform += " scale(" + scale + ")";
    });
});

const UpdatePlayersToolbar = () => {
    let content = ``;
    let PlayerLocations = [];
    Players.forEach((Player) => {
        PlayerLocations[Player.ID] = Player.Location;
        content += `
            <button type="button" class="btn" data-index="${Player.ID}">
                ${Player.Name}
            </button>
        `;
    });
    L.control.custom({
        position: 'topright',
        content : content,
        classes : 'toolbar-topleft',
        events:
            {
                click: function(data) {
                    let index = data.target.getAttribute('data-index');
                    let PlayerLocationX = (PlayerLocations[index][0] / -20000) - 0.025;
                    let PlayerLocationY = (PlayerLocations[index][1] / 20000) - 0.069;
                    PanTo(PlayerLocationX, PlayerLocationY);
                },
            }
    }).addTo(map);
};

const PanTo = (x, y) => {
    map.setView([y, x], 11, {
        animate: true
    });
}