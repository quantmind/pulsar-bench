import {assign, inBrowser} from 'd3-let';
import {view, viewForms, viewBootstrapForms, viewReady, viewEvents, viewProviders} from 'd3-view';
import {visualComponents, visuals, colorScales} from 'd3-visualize';
import {interpolateRdBu} from 'd3-scale-chromatic';

import binaryFormat from './bytes';
import marked from './marked';
import info from './info';


if (inBrowser) {
    if (window.development) viewProviders.setDebug(true);
}


colorScales.set('redyellowblue', (d3) => d3.scaleSequential(interpolateRdBu));


assign(visuals.options.dataContext, {
    $binaryFormat: binaryFormat
});


export function start () {
    viewReady(() => {
        appView().mount('body');
    });
}


export function appView () {
    var vm = view({
            components: {
                marked,
                info
            }
        })
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
