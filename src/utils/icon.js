import fs from 'fs';

export default {
    load: function(name) {
        return fs.readFileSync(`src/assets/img/${name}.svg`, 'utf8');
    }
};