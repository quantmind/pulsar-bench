import {timeFormat} from 'd3-time-format';
import {dataEvents} from 'd3-visualize';


const format = timeFormat('%d %b %Y, %H:%M');
const labels = ['system', 'arch', 'processor', 'cpus', 'python'];
const template = `<div class="card">
<dic class="card-body">
<dl class="row" d3-for="entry in info">
    <dt class="col-sm-4" d3-html="entry.label"></dt>
    <dd class="col-sm-8" d3-html="entry.value"></dd>
</dl>
</div>
</div>`;

export default {
    model () {
        return {
            info: []
        };
    },
    render (data, props, el) {
        const model = this.model;
        model.dataStore.onData('benchmarks.info', frame => {
            model.info = info(frame.data[0]);
        });
        return this.viewElement(template);
    }
};


function info (o) {
    var date = new Date(o.date),
        data = [
            {
                label: 'date',
                value: format(date)
            }
        ];
    labels.forEach(label => {
        data.push({
            label: label,
            value: o[label]
        });
    });
    return data;
}
