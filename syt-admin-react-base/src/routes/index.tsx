// src/routes/index.tsx
import React, { lazy, Suspense, FC } from "react";
import { useRoutes } from "react-router-dom";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import type { XRoutes } from "./types";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@pages/login/slice";
import {
    Layout,
    EmptyLayout,
    // CompLayout
} from "../layouts";
import Loading from "@comps/Loading";
import Redirect from "@comps/Redirect";

const Login = lazy(() => import("@pages/login"));
const Dashboard = lazy(() => import("@pages/dashboard"));
const User = lazy(() => import("@pages/acl/user"));
const NotFound = lazy(() => import("@pages/404"));

const load = (Comp: FC) => {
    return (
        // 因为路由懒加载，组件需要一段网络请求时间才能加载并渲染
        // 在组件还未渲染时，fallback就生效，来渲染一个加载进度条效果
        // 当组件渲染完成时，fallback就失效了
        <Suspense fallback={<Loading />}>
            {/* 所有lazy的组件必须包裹Suspense组件，才能实现功能 */}
            <Comp />
        </Suspense>
    );
};
const allAsyncRoutes: XRoutes = [
    // 权限管理
    {
        path: "/syt/acl",
        name: 'Acl',
        meta: { icon: <SettingOutlined />, title: "权限管理" },
        element: load(User),
        children: [
            {
                name: 'User',
                path: "/syt" +
                    "/acl/user",
                element: load(User),
                meta: { title: "用户管理" },
            },
        ],
    },
]
const routes: XRoutes = [
    {
        path: "/",
        element: <EmptyLayout />,

        children: [
            {
                path: "login",
                element: load(Login),
            },
        ],
    },
    {
        path: "/syt",
        element: <Layout />,
        children: [
            {
                path: "/syt/dashboard",
                meta: { icon: <HomeOutlined />, title: "首页" },
                element: load(Dashboard),
            },


        ],
    },
    {
        path: "/404",
        element: load(NotFound),
    },
    {
        path: "*",
        element: <Redirect to="/404" />,
    },

];
let a = true
// 渲染路由
// 注意：首字母必须大写
export const RenderRoutes = () => {

    // react-router-dom的新增语法。不用自己遍历了，它帮我们遍历生成
    const result = useAppSelector(selectUser).routes
    const result1 = [...result]
    const findUserAsyncRoutes = (allAsyncRoutes: any, routes: any): XRoutes => {
        return allAsyncRoutes.filter((item: any) => {
            if (routes.indexOf(item.name as string) !== -1) {
                if (item.children && item.children.length > 0) {
                    item.children = findUserAsyncRoutes(item.children, routes)
                }
                return true
            }
        })
    }
    const data = findUserAsyncRoutes(allAsyncRoutes, result1)

    let rou: any = []
    routes.forEach((item) => {

        if (item.path === '/syt') {
            rou = Array.from(new Set(item.children))
            data.forEach(val => {
                item.children?.forEach(res => {
                    if (val.path !== res.path) {
                        item.children?.push(val)
                    }


                })
            })
        }

    })
    if (rou.length > 1) {
        routes[1].children = rou
    }
    return useRoutes(routes);

};


// 找到要渲染成左侧菜单的路由
export const findSideBarRoutes = () => {
    const currentIndex = routes.findIndex((route) => route.path === "/syt");
    return routes[currentIndex].children as XRoutes;
};

export default routes;
