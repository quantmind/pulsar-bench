const fs = require('fs');
const logger = require('console');
const Handlebars = require('handlebars');
const pkg = require('../package.json');

const srcPath = 'visual';
const sitePath = 'site';

const templateFile = `${srcPath}/index.html.tpl`;
const pagesPath = `${srcPath}/pages/`;
const min = process.env.CI ? '.min' : '';
const version = pkg.version.split('.').join('_');

function capFirst (text) {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}

// read template
fs.readFile(templateFile, 'utf8', (err, source) => {
    if (err) {
        return logger.error(`Failed to read template: ${templateFile}`);
    }
    const template = Handlebars.compile(source);

    // read pages
    fs.readdir(pagesPath, (err, pages) => {

        pages.forEach(page => {
            var title = page === 'index.html' ? '' : ' ' + capFirst(page.split('.')[0]);

            var outFile = `${sitePath}/${page}`,
                contents = template({
                    version: version,
                    min: min,
                    title: pkg.title + title
                });

            fs.writeFile(outFile, contents, err => {
                if (err) {
                    logger.error(`Failed to write ${outFile}: ${err}`);
                } else {
                    logger.info(`Created ${outFile}`);
                }
            });
        });

    });

});
