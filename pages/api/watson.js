import NaturalLanguageUnderstandingV1 from "watson-developer-cloud/natural-language-understanding/v1-generated";
import { sentences } from "sbd";

export default async function Watson(request, response) {
    const req = request.body;

    let nlu = new NaturalLanguageUnderstandingV1({
        iam_apikey: process.env.WatsonApiKey,
        version: "2018-04-05",
        url: process.env.WatsonURL
    });

    const maximumSentences = 8;
    const datas = {sentences: []};

    breakContentIntoSentences(req.content);
    limitMaximumSentences();
    await fetchKeywordsOfAllSentences();

    function breakContentIntoSentences(content) {
        
        datas.sentences = [];

        const sentencesArray = sentences(content);

        sentencesArray.forEach((sentence) => {
            datas.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            });
        });
    }
    function limitMaximumSentences() {
        datas.sentences = datas.sentences.slice(0, maximumSentences);
    }
    async function fetchWatsonandReturnKeywords(sentence) {
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                },
                language: "en"
            }, (error, response) => {
                if (error) {
                    throw error;
                }

                const keywords = response.keywords.map((keyword) => {
                    return keyword.text;
                });
                resolve(keywords);
            });
        });
    }
    async function fetchKeywordsOfAllSentences() {
        for (let i = 0; i < datas.sentences.length; i++) {
            datas.sentences[i].keywords = await fetchWatsonandReturnKeywords(datas.sentences[i].text);
        }
    }

   
    return response.json({datas});
}
