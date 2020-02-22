let databaseManager = require("../database/database-manager");
let profileBuilder = require("./profile-builder");
let core = require("../core");
let engineFunction = require("../components/engines/base/engine-function");

let automatedProfileCreator = {
    createConfigurationForSupportCategories: async function(supportCategories,pid){
        try{

            let profileClass = require("./profile");
            let profile = new profileClass();


            const loadProfileRequest = databaseManager.createRequest("profile").where("id", "=", pid);
            const loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

            let loadProfileRoleRequest = databaseManager.createRequest("role").where("user_id", "=", pid);
            let loadProfileRoleRequestResult = await databaseManager.executeRequest(loadProfileRoleRequest);

            profile.roles = [];

            for (let i = 0; i < loadProfileRoleRequestResult.result.length; i++) {
                profile.roles.push(loadProfileRoleRequestResult.result[i].role);
            }

            if (loadProfileRequestResult.result.length > 0) {
                profile.id = loadProfileRequestResult.result[0].id;
                profile.type = loadProfileRequestResult.result[0].type;
                profile.locale = loadProfileRequestResult.result[0].locale;
                profile.supportCategories = supportCategories;



                //Loads stuff like busy animation and so on...
                await profileBuilder.loadActiveUserInterfaces(profile);


                profile.userInterfaces = [];
                profile.debugMode = core.debugMode;
                profile.userLoaded = true;

                let preferredUserInterface = null;
                Object.keys(supportCategories.user_interface).forEach(function(key) {

                    if(preferredUserInterface){
                        if(supportCategories.user_interface[preferredUserInterface].preference < supportCategories.user_interface[key].preference){
                            preferredUserInterface = key;
                        }
                    }else{
                        preferredUserInterface = key;
                    }

                });

                let userInterface = null;
                for (let i = 0; i < core.userInterfaces.length; i++) {
                    let latestVersion = core.userInterfaces[i].versions[core.userInterfaces[i].versions.length-1].version;

                    if(latestVersion.supportCategories.includes(preferredUserInterface)){
                        userInterface = latestVersion;
                    }

                }

                let userInterfaceConfig = userInterface.getDefaultConfiguration();
                profile.userInterfaces.push(userInterfaceConfig);



                let toolEntries = [];
                loadEnginesForCategory("text_support",supportCategories,profile,toolEntries);
                loadEnginesForCategory("symbol_support",supportCategories,profile,toolEntries);
                loadEnginesForCategory("layout_support",supportCategories,profile,toolEntries);
                loadEnginesForCategory("reading_support",supportCategories,profile,toolEntries);




                for(let i=0; i < toolEntries.length; i++){

                    let tool = core.createDefaultConfigurationFoFunctionWithID(toolEntries[i].functionID.engineID,toolEntries[i].functionID.versionID,toolEntries[i].functionID.functionID,userInterface,supportCategories);
                    if(tool){
                        profile.userInterfaces[0].tools.push(tool);
                    }
                }

                await profileBuilder.saveUserInterfaceConfiguration(profile, true);
                await profileBuilder.saveProfileSupportCategories(profile);

                let network = require("../network/network");
                network.updateProfileForConnectedClients(profile);


            }
        }catch (e){
            console.log(e);
        }
    }
};

function loadEnginesForCategory(category,supportCategories,profile,toolEntries) {


    Object.keys(supportCategories[category]).forEach(function(subCategory) {

        if(supportCategories[category][subCategory].preference >= 50) {
            for (let i = 0; i < core.engines.length; i++) {

                let versionIndex = core.engines[i].versions.length - 1;
                let latestVersion = core.engines[i].versions[versionIndex];
                let functions = latestVersion.engine.getFunctions();

                for (let j = 0; j < functions.length; j++) {

                    if (functions[j].supportedLanguages.length > 0) {
                        if (typeof profile.locale !== "undefined") {
                            if (!functions[j].supportedLanguages.includes(profile.locale)) {
                                continue;
                            }
                        }
                    }

                    if (Array.isArray(functions[j].supportCategories)) {

                        for (let k = 0; k < functions[j].supportCategories.length; k++) {

                            //Check if its all
                            if (functions[j].supportCategories[k] === category + "_" + subCategory) {
                                createToolEntry(i, versionIndex, j, toolEntries, {
                                    engineID: core.engines[i].engine,
                                    versionID: latestVersion.version,
                                    functionID: functions[j].id,
                                });
                                break;
                            }
                        }
                    }
                }

            }
        }

    });

}

function createToolEntry(engineIndex,versionIndex,toolIndex,toolEntries,functionID){


    //Check if it is not already there
    for(let i=0; i < toolEntries.length; i++){

        if(toolEntries[i].engineIndex === engineIndex && toolEntries[i].toolIndex === toolIndex  ){

            return;
        }
    }

    //create entry
    let newEntry = {
        engineIndex:engineIndex,
        versionIndex:versionIndex,
        toolIndex:toolIndex,
        functionID: functionID,
    };

    //insert entry
    for(let i=0; i < toolEntries.length; i++){

        if(toolEntries[i].engineIndex === newEntry.engineIndex){

            if(toolEntries[i].toolIndex > newEntry.engineIndex){

                toolEntries.splice(i,0,newEntry);
                return;
            }
        }else if(toolEntries[i].engineIndex > newEntry.engineIndex) {
            toolEntries.splice(i, 0, newEntry);

            return;
        }

    }


    //If toolEntries empty or newEntry is to be inserted last.
    toolEntries.push(newEntry);

}



module.exports = automatedProfileCreator;