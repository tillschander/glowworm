import fs from 'fs';

export default {
    load: function(name) {
        return fs.readFileSync(`public/img/${name}.svg`, 'utf8');
    }
};