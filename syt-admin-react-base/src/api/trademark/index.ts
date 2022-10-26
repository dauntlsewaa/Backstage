import { request } from '@utils/http'


//枚举地址
// enum API {
//     TRADEMARKLIST = '/admin/product/baseTrademark/',//获取全部品牌
//     ADDTRADEMARK = '',
//     UPDATETRADEMARK = '',
//     DELETETRADEMARK = ''
// }



//获取品台数据
export const reqTradeMarkList = (page: number, limit: number) => request.get<any, any>(`/admin/product/baseTrademark/${page}/${limit}`);

//添加新的品牌与修改已有的品牌数据
export const reqAddOrUpdateTradeMark = (data: any) => {
    //修改品牌
    if (data.id) {
        return request.put<any, any>('/admin/product/baseTrademark/update', data);
    } else {
        //新增品牌
        return request.post<any, any>('/admin/product/baseTrademark/save', data);
    }
}
//删除某一个品牌
export const reqDeleteTradeMark = (id: number) => request.delete<any, any>('/admin/product/baseTrademark/remove/' + id);