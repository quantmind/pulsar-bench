export {version as mapsVersion} from '../package.json';

import {assign, inBrowser} from 'd3-let';
import {view, viewForms, viewBootstrapForms, viewReady, viewEvents, viewProviders} from 'd3-view';
import {visualComponents, visuals} from 'd3-visualize';

if (inBrowser) {
    if (window.development) viewProviders.setDebug(true);
}


assign(visuals.options.dataContext, {
    $geoDataCode (d) {
        if (!this.filters) return;
        var country = getCountry(this.filters.country),
            v = `${country.code}-regions`;
        return d ? `${v}-${d}` : v;
    },

    $region() {
        //    source = this.$geoDataCode(),
        //    store = this.dataStore;
    }
});


export function start () {
    viewReady(() => {
        appView().mount('body');
    });
}


export function appView () {
    var vm = view()
        .use(viewForms)
        .use(viewBootstrapForms)
        .use(visualComponents);

        viewEvents.on('component-mounted', (cm) => {
            if (cm.name === 'd3form') {
                cm.model.$on(() => formListener(cm));
            }
        });

    return vm;
}

function formListener () {

}

function getCountry () {

}
