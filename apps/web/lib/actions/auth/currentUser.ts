import { serverFetch } from "@/lib/apis/serverFetch/config";
import { cookies } from "next/headers";

export async function getUserData() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
  
    if (token) {
      try {
        const result = await serverFetch(process.env.NEXT_PUBLIC_API_URL + '/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            
          },
          credentials: 'include',
        });
          
        const data = await result.json();
        const user = data.data
        return user;
      } catch (error) {
        console.error("Lỗi khi fetch user info ở Server Component:", error);
      }
    }
    return null;
  }