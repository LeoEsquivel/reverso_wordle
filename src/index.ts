import { app } from '@azure/functions';
import { getVerbOfDay } from './functions/getVerbOfDay';

app.setup({
    enableHttpStream: true,
});

app.http('GetProducts', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getVerbOfDay
});