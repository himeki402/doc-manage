import { serverFetch } from '@/lib/apis/serverFetch/config';

export default async function ProfilePage() {
    try {
        const response = await serverFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);
        const payload = await response.json();
        
        if (!response.ok) {
            throw { status: response.status, payload };
        }
        
        const result = {
            status: response.status,
            payload,
        };
             
        return (
            <div>
                <h1>Server Component: {payload.data?.name || 'Không có thông tin người dùng'}</h1>
            </div>
        );
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        return (
            <div>
                <h1>Không thể lấy thông tin người dùng</h1>
                <p>Vui lòng đăng nhập để xem trang này</p>
            </div>
        );
    }
}