
export type Document = {
    id: string;
    title: string;
    mimeType: string;
    fileSize: number;
    created_at: string;
    createdBy: { id: string; name: string };
}

export interface Group {
    id: string;
    name: string;
    description: string;
    members?: Member[];
    created_at: string;
    updated_at: string;
    groupAdmin?: { id: string; name: string };
    memberCount: number;
    documentCount: number;
    documents?: Document[];
    isAdmin: boolean;
}
export interface Member {
    user_id: string;
    user: { id: string; name: string; email: string };
    group_id: string;
    joined_at: string;
    role: "MEMBER" | "ADMIN";
    avatar?: string;
}
export interface GroupResponse {
    data: Group[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface GroupQueryParams {
    limit?: number;
    page?: number;
    search?: string;
}

export interface CreateGroupRequest {
    name: string;
    description: string;
}

export interface UpdateGroupRequest {
    name?: string;
    description?: string;
}

export interface AddMember {
    userId: string;
}

export interface AddMultipleMembers {
  members: AddMember[];
}

export interface RemoveMemberRequest {
    userId: string;
}
