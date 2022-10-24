import { request } from "@/utils/http";


// 获取角色列表
export const reqUserList = (page: number, limit: number,username:any) => request.get<any,any>(`/admin/acl/user/${page}/${limit}`,{
    params:{
        username
    }
})