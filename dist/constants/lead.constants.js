"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadTimelineAction = exports.LeadStatus = void 0;
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NEW"] = "NEW";
    LeadStatus["CONTACTED"] = "CONTACTED";
    LeadStatus["FOLLOW_UP"] = "FOLLOW_UP";
    LeadStatus["CONVERTED"] = "CONVERTED";
    LeadStatus["DROPPED"] = "DROPPED";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
exports.LeadTimelineAction = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    IMPORT: 'IMPORT',
    ASSIGN: 'ASSIGN',
};
//# sourceMappingURL=lead.constants.js.map