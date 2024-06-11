const { HfInference } = require('@huggingface/inference');
const dotenv = require('dotenv');
dotenv.config();
const base = rootRequire("core/components/engines/base/engine-base");
const ioType = rootRequire("core/IOtypes/iotypes");

class Translate extends base.EngineBase {
    constructor() {
        super();
        this.id = "AI Text Translator";
        this.name = "AI Text Translator";
        this.description = "Translate a word or sentence from English to German";
        this.version = "1.0";
        this.versionDescription = "Initial Version";
        this.hfInference = new HfInference(process.env.HUGGING_FACE_API_KEY); // Hugging Face access token
    }

    getFunctions() {
        return [
            {
                id: "hf_tr",
                name: "Hugging Face: Translate Paragraph",
                description: "Translate a paragraph via Hugging Face API",
                defaultIcon: "assets/translate.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en", "de"],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.DICTIONARY,
                supportCategories: [
                    base.functionSupportCategories.text_support.translation,
                ],
                inputTypes: [
                    {
                        "inputType": ioType.IOTypes.Paragraph.className,
                        "name": "Input paragraph",
                        "description": "Paragraph to translate",
                    }
                ],
                outputTypes: [
                    {
                        "outputType": ioType.IOTypes.Paragraph.className,
                        "name": "Translated paragraph",
                        "description": "Translated paragraph",
                    }
                ],
                toolCategory: base.EngineFunction.ToolCategories.Other,
                entryPoint: "translateText",
            },
            {
                id: "hf_tr_word",
                name: "Hugging Face: Translate Word",
                description: "Translate a word via Hugging Face API",
                defaultIcon: "assets/translate.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en", "de"],
                visibleInConfiguration: false,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.DICTIONARY,
                inputTypes: [
                    {
                        "inputType": ioType.IOTypes.Word.className,
                        "name": "Input word",
                        "description": "Word to translate",
                    }
                ],
                outputTypes: [
                    {
                        "outputType": ioType.IOTypes.Word.className,
                        "name": "Translated word",
                        "description": "Translated word",
                    }
                ],
                toolCategory: base.EngineFunction.ToolCategories.Other,
                entryPoint: "translateWord",
            }
        ];
    }

    async translateText(callback, input) {
        const text = input.paragraph;

        try {
            const result = await this.hfInference.translation({
                model: 'Helsinki-NLP/opus-mt-en-de',
                inputs: text
            });

            if (result && result.translation_text) {
                const translatedText = result.translation_text;
                const output = new ioType.IOTypes.Paragraph(translatedText);
                callback(output);
            } else {
                callback(new ioType.IOTypes.Error("Translation error: No response from Hugging Face API."));
            }
        } catch (error) {
            console.error(error);
            callback(new ioType.IOTypes.Error(`Translation error: ${error.message}`));
        }
    }

    async translateWord(callback, input) {
        const text = input.word;

        try {
            const result = await this.hfInference.translation({
                model: 'Helsinki-NLP/opus-mt-en-de',
                inputs: text
            });

            if (result && result.translation_text) {
                const translatedWord = result.translation_text;
                const output = new ioType.IOTypes.Word(translatedWord);
                callback(output);
            } else {
                callback(new ioType.IOTypes.Error("Translation error: No response from Hugging Face API."));
            }
        } catch (error) {
            console.error(error);
            callback(new ioType.IOTypes.Error(`Translation error: ${error.message}`));
        }
    }
}

module.exports.class = Translate;
