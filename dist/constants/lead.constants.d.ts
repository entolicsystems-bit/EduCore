export declare enum LeadStatus {
    NEW = "NEW",
    CONTACTED = "CONTACTED",
    FOLLOW_UP = "FOLLOW_UP",
    CONVERTED = "CONVERTED",
    DROPPED = "DROPPED"
}
export declare const LeadTimelineAction: {
    readonly CREATE: "CREATE";
    readonly UPDATE: "UPDATE";
    readonly IMPORT: "IMPORT";
    readonly ASSIGN: "ASSIGN";
};
export type LeadTimelineAction = typeof LeadTimelineAction[keyof typeof LeadTimelineAction];
