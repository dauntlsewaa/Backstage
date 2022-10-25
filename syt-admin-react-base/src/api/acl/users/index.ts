import { request } from "@/utils/http";
import { And } from "reselect/es/types";


// 获取角色列表
export const reqUserList = (page: number, limit: number, username: any) => request.get<any, any>(`/admin/acl/user/${page}/${limit}`, {
    params: {
        username
    }
})

// 添加或修改角色
export const reqAddUser = (data: any) => {
    if (data.id) {
        return request.put<any, any>('/admin/acl/user/update', data)
    } else {
        return request.post<any, any>('/admin/acl/user/save', data)
    }
}

// 根据id删除角色
export const reqFindId = (id: number) => request.delete<any, any>(`/admin/acl/user/remove/${id}`)

// 根据id列表删除角色
export const reqClear = (data: any) => request.delete<any, any>(`/admin/acl/user/batchRemove`, data)

// 查看角色列表
export const reqUserData = (userId: any) => request.get<any, any>(`/admin/acl/user/toAssign/${userId}`)

// 根据用户分配角色
export const reqAssign = (data: any) => request({
    method: 'post',
    url: '/admin/acl/user/doAssign',
    params: data
})
