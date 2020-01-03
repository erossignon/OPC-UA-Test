const {
    OPCUAServer,
    DataType
} = require("node-opcua");

(async () => {
    try {
        const server = new OPCUAServer({
            port: 4337,
            resourcePath: "/UA/TabletServ",
            keepSessionAlive: true,
            requestedSessionTimeout: 60000,
            buildInfo: {
                manufacturerName: "CPNA",
                productName: "TabletOPCUAServ",
                softwareVersion: "1.0.0"
            },
            allowAnonymous: true,
        });

        await server.initialize();

        // Creating devie object
        const addressSpace = server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();

        const myDevice = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "MyDevice"
        });

        // Default status variable string variable
        let defaultStat = "NoStatus";

        /////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        // These are the variables added for each machine
        // Scroll to bottom to see server start block
        /////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////

        // Create machines array, can make this a db call
        let machines = [
            "101", "102", "103", "104", "105", "106", "107", "108", "109", "110",
            "111", "112", "113", "114", "115", "116", "117", "118", "201", "202",
            "203", "204", "205", "206", "207", "208", "209", "210", "211", "212",
            "213", "214", "215", "216", "217", "218", "301", "302", "303", "304",
            "305", "306", "307", "308", "309", "310", "311", "312", "313", "314",
            "315", "316", "317", "318"
        ]

        // Algorithm for creating nodes for each of the machines
        for (let i = 0; i < machines.length; i++) {

            // Create NodeId
            const nodePrefix = "ns=1;i=1";
            const nodeIdent = nodePrefix.concat(machines[i]);

            // Create browse
            const browsePrefix = "SS";
            const nameToBrowse = browsePrefix.concat(machines[i], "Status");

            // Add variable logic
            const variable = namespace.addVariable({
                componentOf: myDevice,
                nodeId: nodeIdent,   //"ns=1;i=1101",
                browseName: nameToBrowse,
                dataType: "String",
            });
            variable.setValueFromSource({ dataType: DataType.String, value: defaultStat });

        }

        await server.start();
        console.log("Server is now listening ... ( Press CTRL+C to stop! )");
        const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log("The primary server endpoint url is: ", endpointUrl);

    }
    catch (err) {
        consol.log("OPC-UA Error Message: ", err);
    }
})();


