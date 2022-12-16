import { google } from "googleapis";

const customSearch = google.customsearch("v1");

async function Google(request, response) {

    const req = request.body;

    await fetchImagesofAllSentences(req.content);

    async function fetchImagesofAllSentences(content) {
        
        for (const sentence of content.sentences) {
            const query = `${req.searchTerm} ${sentence.keywords[0]}`;

            sentence.images = await fetchGoogleandReturnImagesLinks(query);

            sentence.googleSearchQuery = query;

        }

    }

    async function fetchGoogleandReturnImagesLinks(query) {
        const search = await customSearch.cse.list({
            auth: process.env.GoogleApiKey,
            cx: process.env.SearchEngineID,
            q: query,
            searchType: "image",
            num: 9
        });

        const imagesUrl = search.data.items.map((item) => {
            return item.link
        });

        return imagesUrl;
    }


    return response.json({results: req});
}

export default Google;