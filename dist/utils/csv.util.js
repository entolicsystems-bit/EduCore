"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsv = parseCsv;
const csv = require("csv-parser");
const stream_1 = require("stream");
function parseCsv(buffer) {
    return new Promise((resolve, reject) => {
        const rows = [];
        stream_1.Readable.from(buffer)
            .pipe(csv())
            .on('data', (data) => rows.push(data))
            .on('end', () => resolve(rows))
            .on('error', reject);
    });
}
//# sourceMappingURL=csv.util.js.map