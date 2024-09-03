import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import axios from 'axios';
import * as cheerio from 'cheerio';


export async function getVerbOfDay(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const url = 'https://conjugador.reverso.net/conjugacion-ingles.html';
    try {
        const response  = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const selector  = cheerio.load(response.data)
        const verfDay   = selector("#verbDay").text();

        return { body: `El verbo del dia es: ${verfDay}`, };

    } catch (err){
        console.log(err)
    }
};

app.http('getVerbOfDay', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getVerbOfDay
});
