import { add } from "date-fns";
import {
    AddMember,
    CreateGroupRequest,
    Group,
    GroupResponse,
} from "../types/group";
import apiClient from "./config";

const groupApi = {
    getAllGroup: async (): Promise<GroupResponse> => {
        try {
            const response = await apiClient.get("/groups");
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Lỗi máy chủ nội bộ",
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    createGroup: async (data: CreateGroupRequest): Promise<Group> => {
        try {
            const response = await apiClient.post("/groups", data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể tạo nhóm",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    updateGroup: async (tagId: string, tag: Partial<Group>): Promise<Group> => {
        try {
            const response = await apiClient.put(`/groups/${tagId}`, tag);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể cập nhật tag",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    deleteGroup: async (groupId: string): Promise<void> => {
        try {
            await apiClient.delete(`/groups/${groupId}`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể xóa nhóm",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    addMultipleMember: async (
        groupId: string,
        members: AddMember[]
    ): Promise<Group> => {
        try {
            const response = await apiClient.post(
                `/groups/${groupId}/members/bulk`,
                {
                    members,
                }
            );
            return response.data.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể thêm thành viên vào nhóm",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getGroupById: async (groupId: string): Promise<Group> => {
        try {
            const response = await apiClient.get(`/groups/${groupId}`);
            return response.data.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy thông tin nhóm",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    removeMember: async (groupId: string, memberId: string): Promise<Group> => {
        try {
            const response = await apiClient.delete(
                `/groups/${groupId}/members/${memberId}`
            );
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể xóa thành viên khỏi nhóm",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getMygroups: async (): Promise<GroupResponse> => {
        try {
            const response = await apiClient.get("/groups/me");
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Lỗi máy chủ nội bộ",
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    removeDocumentFromGroup: async (documentId: string): Promise<void> => {
        try {
            await apiClient.patch(`/documents/${documentId}/remove-from-group`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể gỡ tài liệu khỏi nhóm",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
};

export default groupApi;
