let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class ScreenRuler extends base.EngineBase{
    constructor() {
        super();
        this.id = "ScreenRuler";
        this.name = "Screen Ruler";
        this.description = "Creates a screenruler for better reading";
        this.version = "1.0";
        this.debugMode = false;
        this.versionDescription = "Initial version";

    }


    getFunctions(){
        return [
            {
                id : "screen-ruler",
                name: "Screen ruler",
                description : "Creates a screenruler for better reading",
                defaultIcon : "assets/screen-ruler.png",
                states: 2,
                includeInDefaultProfile: false,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.layout_support.font_support,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/screen-ruler.js'],
                styleSheets : ['/css/screen-ruler.css'],
                entryPoint: "easyReadingScreenRuler",
            }

        ];
    }
}

module.exports.class = ScreenRuler;