import { Tag, TagsResponse } from "../types/tag";
import apiClient from "./config";

const tagApi = {
    getAlltag: async (): Promise<TagsResponse> => {
        try {
            const response = await apiClient.get("/tags");
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
};

export default tagApi;
