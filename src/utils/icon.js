import fs from 'fs';

export default {
    load: function(name) {
        if (process.env.NODE_ENV === 'DEV') __dirname = 'public';
        return fs.readFileSync(`${__dirname}/img/${name}.svg`, 'utf8');
    }
};