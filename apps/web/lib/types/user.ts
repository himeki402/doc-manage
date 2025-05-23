export interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER" | "GUEST";
    status: "ACTIVE" | "LOCKED" | "PENDING";
    registrationDate: string;
    lastLogin: string | null;
    avatar?: string;
    phone?: string;
    address?: string;
    bio?: string;
    documentsUploaded?: number;
    groups?: UserGroup[];
    created_at: string;
    updated_at?: string;
}

export interface UserGroup {
    id: string;
    name: string;
    description?: string;
    memberCount: number;
}

export interface UserActivity {
    id: string;
    userId: string;
    action: "LOGIN" | "UPLOAD" | "EDIT" | "DELETE" | "DOWNLOAD" | "VIEW";
    targetType: "document" | "category" | "user" | "group" | "system";
    targetId?: string;
    targetName?: string;
    timestamp: string;
    details?: string;
}

export interface UserPermission {
    id: string;
    name: string;
    description: string;
    granted: boolean;
}

export interface UsersResponse {
    data: User[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UserResponse {
    data: User;
}

export interface UserActivitiesResponse {
    data: UserActivity[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}

export interface UserPermissionsResponse {
    data: UserPermission[];
}

export interface UserGroupsResponse {
    data: UserGroup[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}

export type UserStats = {
    totalUsers: number;
    newUsersThisMonth: number;
    newUsersLastMonth: number;
    growthPercentage: number;
    growthCount: number;
};

export type UserStatsResponse = {
    data: UserStats;
    message: string;
    statusCode: number;
};
