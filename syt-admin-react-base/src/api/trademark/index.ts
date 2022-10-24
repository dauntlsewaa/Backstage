import { request } from '@utils/http'


//枚举地址
enum API {
    TRADEMARKLIST = '/admin/product/baseTrademark/',//获取全部品牌
    ADDTRADEMARK = '/admin/product/baseTrademark/save',
    UPDATETRADEMARK = '/admin/product/baseTrademark/update',
    DELETETRADEMARK = '/admin/product/baseTrademark/remove/'
}

//获取品台数据
export const reqTradeMarkList = (page: number, limit: number) => request.get(API.TRADEMARKLIST + `${page}/${limit}`);

//添加新的品牌与修改已有的品牌数据
export const reqAddOrUpdateTradeMark = (data: any) => {
    //修改品牌
    if (data.id) {
        return request.put<any, any>(API.UPDATETRADEMARK, data);
    } else {
        //新增品牌
        return request.post<any, any>(API.ADDTRADEMARK, data);
    }
}
//删除某一个品牌
export const reqDeleteTradeMark = (id: number) => request.delete<any, any>(API.DELETETRADEMARK + id);