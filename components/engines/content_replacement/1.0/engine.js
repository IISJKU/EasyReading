var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");
let databaseManager = require("../../../../core/database/database-manager");
const localeService = require("../../../../core/i18n/locale-service");
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
                includeInDefaultProfile: false,
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
                toolCategory: base.EngineFunction.ToolCategories.Explanation,
                entryPoint: "contentReplacement",
            }

        ];
    }
    async contentReplacement(callback, input, config,profile,constants) {
        let loadActiveDOMHelperRequest = databaseManager.createRequest("content_replacement").where("url", "LIKE", input.url+"%");
        let loadActiveDOMHelperResult = await databaseManager.executeRequest(loadActiveDOMHelperRequest);
        let replacementsFound = false;
        let result;
        if (loadActiveDOMHelperResult.result.length > 0) {
            result = new ioType.IOTypes.ContentReplacement();
            for (let i=0; i < loadActiveDOMHelperResult.result.length; i++) {
                if (loadActiveDOMHelperResult.result[i].active === 0) {
                    continue;
                }
                if (loadActiveDOMHelperResult.result[i].scope === "clients") {
                    let clientCarerRelationship = databaseManager.createRequest("client_carer_relation").where("client_id", "=", profile.id).where("carer_id", "=", loadActiveDOMHelperResult.result[i].pid);
                    let clientCarerRelationshipResult = await databaseManager.executeRequest(clientCarerRelationship);
                    if (clientCarerRelationshipResult.result.length === 0) {
                        continue;
                    }
                }
                result.addReplacement("content_replacement",loadActiveDOMHelperResult.result[i]);
                replacementsFound= true;
            }
        }
        if (replacementsFound) {
            callback(result);
        } else {
            const localeService = require("../../../../core/i18n/locale-service");
            const message = localeService.translateToLanguage(
                "No content replacements found on this page.", profile.locale);
            callback(new ioType.IOTypes.NoResult(message));
        }
    }

    createTextualDescription() {

        this.textualDescription = [
            {
                functionID: "content_replacement",
                description:[
                    this.descriptionManager.createSubHeadingEntry(this,"intro_text","Instruction:"),
                    this.descriptionManager.createParagraphEntry(this,"instruction_1","The Easy to Read Symbol will be shown on the site if text in simplified language has been found."),
                    this.descriptionManager.createParagraphEntry(this,"instruction_2","A click on the symbol shows the simplified text. Another click on the symbol will show the original again."),
                ]
            }

        ];
    }


}

module.exports.class = Dictionary;
