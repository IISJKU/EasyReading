const core = require("../../../../core/core");
const request = require("request");
const localeService = require("../../../../core/i18n/locale-service");
const base = rootRequire("core/components/engines/base/engine-base");
const ioType = rootRequire("core/IOtypes/iotypes");

class ArasaacPictureDictionary extends base.EngineBase {
    constructor() {
        super();
        this.name = "Symbol Search";
        this.description = "Symbol Search with ARASAAC";
        this.versionDescription = "Initial Version";
    }

    getFunctions() {
        return [
            {
                id: "arasaac_picture_dictionary",
                name: "Symbol Search",
                description: "Symbol Search with ARASAAC",
                defaultIcon: "assets/picture-dictionary.png",
                includeInDefaultProfile: false,
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.text_support.multimedia_annotation,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.Word.className,
                    "name": "Input word",
                    "description": "Word to translate",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.ImageIOType.className,
                    "name": "Image",
                    "description": "Image word",

                }],
                supportedLanguages: ["en","sv","de"],
                toolCategory: base.EngineFunction.ToolCategories.Explanation,
                entryPoint: "pictureDictionary",
            }

        ];
    }

    pictureDictionary(callback, input, config, profile, constants) {
        const supportedLanguages = ['en', 'de'];  // Languages supported by the ARASAAC API.
        const pictureDictionary = this;
        if (config == null) {
            config = {};
        }
        config['exact-match'] = true;
        if (supportedLanguages.indexOf(input.lang) > -1) {
            pictureDictionary.createPictureRequest(callback, input, config, profile, constants);
        } else {
            const translate = core.getEngine("translate");
            translate.translateWord(
                function (result) {
                    if (result.name === "Error") {
                        callback(result);
                    } else {
                        pictureDictionary.createPictureRequest(callback, result, config, profile, constants);
                    }
                }, input, config, profile, constants
            );
        }
    }

    createPictureRequest(callback, input, config, profile, constants) {
        const keyword = input.word;
        const options = {
            url: `https://api.arasaac.org/api/pictograms/${input.lang}/search/${encodeURIComponent(keyword)}`,
            method: 'GET',
        };

        const request = require('request');
        request(options, function (err, res, body) {
            if (err) {
                callback(new ioType.IOTypes.Error("Error processing request"));
                console.log(err);
                return;
            }
            try {
                let response = JSON.parse(body);
                let imageFound = true;
                if (Array.isArray(response) && response.length > 0) {
                    const imageInfo = response[0];
                    let fetch = true;
                    if ('exact-match' in config && config['exact-match']) {
                        fetch = false;
                        for (const k of response[0].keywords) {
                            let k1, k2;
                            if (input.lang === 'de') {
                                k1 = k.keyword;
                                k2 = keyword;
                            } else {
                                k1 = k.keyword.toLowerCase();
                                k2 = keyword.toLowerCase();
                            }
                            if (k1 === k2) {
                                fetch = true;
                                break;
                            }
                        }
                    }
                    if (fetch) {
                        let imageOptions = {
                            url: 'https://api.arasaac.org/api/pictograms/' + imageInfo._id + '?url=true&download=false',
                            method: 'GET',
                        };
                        let keywords = response[0].keywords.map(k => k.keyword);
                        request(imageOptions, function (err, res, body) {
                            try {
                                let imageResponse = JSON.parse(body);
                                let imageURL = imageResponse.image;
                                let result = new ioType.IOTypes.ImageIOType(imageURL, keywords, input.word);
                                callback(result);
                            } catch (error) {
                                callback(new ioType.IOTypes.Error("Error processing request"));
                            }
                        });
                    } else {
                        imageFound = false;
                    }
                } else {
                    imageFound = false;
                }
                if (!imageFound) {
                    const localeService = require("../../../../core/i18n/locale-service");
                    const message = localeService.translateToLanguage(
                        "No images found.", profile.locale);
                    callback(new ioType.IOTypes.NoResult(message));
                }
            } catch (err) {
                callback(new ioType.IOTypes.Error("Error processing request"));
                console.log(err);
            }
        });
    }
}

module.exports.class = ArasaacPictureDictionary;