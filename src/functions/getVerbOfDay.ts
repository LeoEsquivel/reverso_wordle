import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import axios from 'axios';
import * as cheerio from 'cheerio';

const URL_BASE = 'https://conjugador.reverso.net'

export async function getVerbOfDay(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const url = `${URL_BASE}/conjugacion-ingles.html`;

    const data2save = {
        "infinitive"     : "",
        "simple_past"    : "",
        "past_participle": "",
        "translation"    : "",
        "eng_example"    : "",
        "esp_example"    : ""
    }

    try {
        const response_verbDay  = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const selector  = cheerio.load(response_verbDay.data)
        const verbDay   = selector("#verbDay").text();
        
        data2save.infinitive = verbDay;
        
        const url_info_extra = selector("#verbDay").attr("href");
        console.log(`${URL_BASE}/${url_info_extra}`)
        const response_extra  = await axios.get(`${URL_BASE}/${url_info_extra}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const selector_data_extra = cheerio.load(response_extra.data);

        const contenedor_formas_verbo = selector_data_extra.extract({
            infinitive: {
                selector: ".top1",
            },
            preterite: {
                selector: ".top2",
                value: {
                    selector: '.verbtxt',
                }
            },
            past_participle: {
                selector: ".top3",
            },
        });

        console.log(contenedor_formas_verbo)

        // return { body: `El verbo del dia es: ${url_info_extra}`, };
        return { body: response_extra.data}

    } catch (err){
        console.log(err)
    }
};

app.http('getVerbOfDay', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getVerbOfDay
});
