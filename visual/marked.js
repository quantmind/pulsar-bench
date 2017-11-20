import {viewProviders} from 'd3-view';


export default {
    props: ['url'],

    render (data, props, el) {
        var self = this,
            inner = this.select(el).html();

        return viewProviders.require('marked').then(marked => {
            if (data.url) {
                return this.fetchText(data.url).then(text => {
                    text = marked(text);
                    return self.viewElement(`<div class="doc">${text}</div>`);
                });
            } else {
                var text = marked(inner);
                return self.viewElement(`<div class="doc">${text}</div>`);
            }
        });
    }
};
