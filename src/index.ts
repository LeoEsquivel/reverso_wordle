import { app } from '@azure/functions';
import { getVerbOfDay } from './functions/getVerbOfDay';

app.setup({
    enableHttpStream: true,
});