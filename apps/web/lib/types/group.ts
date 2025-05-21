
type Document = {
    id: string;
    title: string;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    members?: Member[];
    created_at: string;
    updated_at: string;
    createdBy?: string;
    documents?: Document[];
}
export interface Member {
    user_id: string;
    group_id: string;
    joined_at: string;
    role: "MEMBER" | "ADMIN";
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
    description?: string;
    createdBy: string;
    members?: Member[];
}

export interface UpdateGroupRequest {
    name?: string;
    description?: string;
}

export interface AddMemberRequest {
    userId: string;
    role: "MEMBER" | "ADMIN";
}

export interface RemoveMemberRequest {
    userId: string;
}
