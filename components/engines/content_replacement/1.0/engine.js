var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");
let databaseManager = require("../../../../core/database/database-manager");
class Dictionary extends base.EngineBase {
    constructor() {
        super();
        this.id = "Content Replacement";
        this.name = "Content Replacement";
        this.description = "A simple online dictionary";
        this.version = "1.0";
        this.versionDescription = "Initial Version";
    }

    getDataSchema() {
        return {};
    }

    getFunctions() {
        return [
            {
                id: "content_replacement",
                name: "Content",
                description: "Content Replacement",
                defaultIcon: "assets/content_replacement.png",
                includeInDefaultProfile: true,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.text_support.simplified_language,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.URLType.className,
                    "name": "Url",
                    "description": "Url of the page to search for replacements",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.ContentReplacement.className,
                    "name": "Content replacements",
                    "description": "Content replacements",

                }],
                entryPoint: "contentReplacement",
            }

        ];
    }
    async contentReplacement(callback, input, config,profile,constants) {


        let loadActiveDOMHelperRequest = databaseManager.createRequest("content_replacement").where("url", "LIKE", input.url+"%");
        let loadActiveDOMHelperResult = await databaseManager.executeRequest(loadActiveDOMHelperRequest);

        if(loadActiveDOMHelperResult.result.length > 0){
            let result = new ioType.IOTypes.ContentReplacement();
            for(let i=0; i < loadActiveDOMHelperResult.result.length; i++){
                result.addReplacement("content_replacement",loadActiveDOMHelperResult.result[i]);
            }

            callback(result);
        }else{
            callback(new ioType.IOTypes.NoResult("No content replacements found on this page."));
        }


    }


}


module.exports.class = Dictionary;