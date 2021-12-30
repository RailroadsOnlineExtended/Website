ParseData(data);

const DrawMap = () => {
    DrawLines(VariableBank);
    DrawLines(ConstantBank);
    DrawLines(VariableWall);
    DrawLines(ConstantWall);
    DrawLines(WoodenBridge);
    DrawLines(IronBridge);
    DrawLines(Track);
    DrawLines(TrendleTrack);
    UpdateIndustriePopups();
    DrawTurnTables();
    DrawSwitches();
};

const mapUpdateLoop = () => {
    setTimeout(function () {
        DrawMap();

        mapUpdateLoop();
    }, 100);
};
mapUpdateLoop();

DrawIndustries();

DrawPlayers();
UpdatePlayersToolbar();
DrawSwitchClickBoxes();