import {format} from 'd3-format';

const memorySymbols = ['K', 'M', 'G'].map((s, i) => {
    return {
        symbol: s,
        size: 1 << (i+1)*10
    };
}).reverse();

export default function (fmt) {
    const binaryFormat = format(fmt);

    return function (value) {
        for (let s=0; s<memorySymbols.length; ++s) {
            if (value >= memorySymbols[s].size) {
                value /= memorySymbols[s].size;
                return binaryFormat(value) + memorySymbols[s].symbol + 'B';
            }
        }
        return binaryFormat(value) + 'B';
    };
}
