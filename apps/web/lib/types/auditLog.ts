export interface AuditLog {
    log_id: string;
    document: Document;
    action_type: ActionType;
    action_details: any;
    timestamp: string;
    user: User;
}

type Document = {
    id: string;
    title: string;
    description: string;
};

type User = {
    id: string;
    name: string;
};

export type ActionType =
    | "CREATE_DOCUMENT"
    | "UPDATE_DOCUMENT"
    | "DELETE_DOCUMENT"
    | "APPROVE_DOCUMENT"
    | "REQUEST_APPROVAL"
    | "LIKE_DOCUMENT"
    | "DISLIKE_DOCUMENT"
    | "CREATE_IMAGE_DOCUMENT"
    | "ADD_TAG"
    | "REMOVE_TAG"
    | "ADD_CATEGORY"
    | "REMOVE_CATEGORY"
    | "SHARE_DOCUMENT"
    | "UNSHARE_DOCUMENT"
    | "COMMENT_DOCUMENT"
    | "EDIT_COMMENT"
    | "DELETE_COMMENT"
    | "REMOVE_DOCUMENT_FROM_GROUP"
    | "ADD_DOCUMENT_TO_GROUP"
    | "MOVE_DOCUMENT_TO_CATEGORY"
    | "COPY_DOCUMENT"
    | "ARCHIVE_DOCUMENT"
    | "RESTORE_DOCUMENT"
    | "EXPORT_DOCUMENT"
    | "IMPORT_DOCUMENT"
    | "DOWNLOAD_DOCUMENT"
    | "VIEW_DOCUMENT";
