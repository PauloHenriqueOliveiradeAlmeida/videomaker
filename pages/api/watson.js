import NaturalLanguageUnderstandingV1 from "watson-developer-cloud/natural-language-understanding/v1-generated";
export default async function Watson(request, response) {
    const req = request.body;
    let res;

    async function fetchWatsonandReturnKeywords(sentence) {
        return new Promise((resolve, reject) => {
            let nlu = new NaturalLanguageUnderstandingV1({
                iam_apikey: process.env.WatsonApiKey,
                version: "2018-04-05",
                url: process.env.WatsonURL
            });
        
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                }
            }, (error, response) => {
                if (error) {
                    throw error;
                }

                const keywords = response.keywords.map((keywords) => {
                    return keywords.text;
                });
                resolve(keywords);
            });
        });
    }


}
