let Barrels = './assets/images/map/products/barrels_p.svg';
let Beams = './assets/images/map/products/beams_p.svg';
let Coal = './assets/images/map/products/coal_p.svg';
let Cordwood = './assets/images/map/products/cordwood_p.svg';
let Iron = './assets/images/map/products/iron_p.svg';
let IronOre = './assets/images/map/products/ironore_p.svg';
let Logs = './assets/images/map/products/logs_p.svg';
let Lumber = './assets/images/map/products/lumber_p.svg';
let CrudeOil = './assets/images/map/products/oil_p.svg';
let SteelPipes = './assets/images/map/products/pipes_p.svg';
let Rails = './assets/images/map/products/rails_p.svg';
let Tools = './assets/images/map/products/tools_p.svg';
let Firewood = './assets/images/map/products/firewood_p.svg';
let Water = './assets/images/map/products/water_p.svg';

const Images = {
    [ 'crudeoil'    ]: { image: CrudeOil  , offset: 4   },
    [ 'coal'        ]: { image: Coal      , offset: 4  },
    [ 'ironore'     ]: { image: IronOre   , offset: 4   },
    [ 'steelpipe'   ]: { image: SteelPipes, offset: 0   },
    [ 'rail'        ]: { image: Rails     , offset: 4  },
    [ 'firewood'    ]: { image: Firewood  , offset: 0   },
    [ 'crate_tools' ]: { image: Tools     , offset: 4  },
    [ 'water'       ]: { image: Water     , offset: 0   },
    [ 'beam'        ]: { image: Beams     , offset: 0  },
    [ 'cordwood'    ]: { image: Cordwood  , offset: 0  },
    [ 'rawiron'     ]: { image: Iron      , offset: 0  },
    [ 'log'         ]: { image: Logs      , offset: 0  },
    [ 'lumber'      ]: { image: Lumber    , offset: 0  },
    [ 'oilbarrel'   ]: { image: Barrels   , offset: 6 },
};

const GenerateStorageInfo = (storages) => {
    let html = ``;

    Object.keys(storages).map((storage) => {
        let storageData = storages[storage];

        html += `
            <div style="width: 200px;">
            <h4 class="uk-text-center">${storage}</h4><table>`;

        storageData.map(({ Amount, Max, Type }, i) => {
            html += `
            <div class="row" id="data-${storage}-${i}">
                <div class="column first">${Amount} / ${Max}</div>
                <div class="column">`;

            Type.split( ' ' ).map( ( item, i ) => {
                let ImageItem = Images[item];
                html += `<img
                        src="${ImageItem.image}"
                        alt="${item}"
                        style="height: 50px; display: block; margin-left: ${ImageItem.offset ? ImageItem.offset : 0}px;"/>`;
            });

            html += `</div></div>`;
        });
        html += `</table></div>`;
    });

    return html;
};