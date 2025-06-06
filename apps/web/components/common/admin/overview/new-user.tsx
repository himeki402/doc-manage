"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/types/user";
import userApi from "@/lib/apis/userApi";
import { formatTimeAgo } from "@/lib/utils";

export default function NewUserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNewUsers = async () => {
            try {
                setLoading(true);
                const response = await userApi.getAllUsers({
                    page: 1,
                    limit: 4,
                    sortBy: "created_at",
                    sortOrder: "DESC",
                });
                const users = response.data;
                setUsers(users); 
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchNewUsers();
    }, []);

    if (error) {
        return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Người dùng mới đăng ký</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-red-500">{error}</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Người dùng mới đăng ký</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading
                        ? // Hiển thị skeleton loading khi đang tải
                          Array.from({ length: 4 }).map((_, i) => (
                              <div
                                  key={i}
                                  className="flex items-center justify-between"
                              >
                                  <div className="space-y-2">
                                      <Skeleton className="h-4 w-[120px]" />
                                      <Skeleton className="h-3 w-[180px]" />
                                  </div>
                                  <Skeleton className="h-3 w-[80px]" />
                              </div>
                          ))
                        : // Hiển thị danh sách người dùng
                          users.map((user) => (
                              <div
                                  key={user.id}
                                  className="flex items-center justify-between"
                              >
                                  <div>
                                      <p className="font-medium">{user.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                          {user.email}
                                      </p>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                      <Clock className="mr-1 h-3 w-3" />
                                      {formatTimeAgo(user.created_at)}
                                  </div>
                              </div>
                          ))}
                </div>
                {/* <Button variant="outline" className="mt-4 w-full">
                    Xem tất cả
                </Button> */}
            </CardContent>
        </Card>
    );
}
