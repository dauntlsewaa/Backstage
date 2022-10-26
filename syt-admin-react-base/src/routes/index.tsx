// src/routes/index.tsx
import React, { lazy, Suspense, FC } from "react";
import { useRoutes } from "react-router-dom";

import { HomeOutlined, SettingOutlined, ShopOutlined } from "@ant-design/icons";

import type { XRoutes } from "./types";

import {
  Layout,
  EmptyLayout,
  CompLayout
} from "../layouts";
import Loading from "@comps/Loading";
import Redirect from "@comps/Redirect";

const Login = lazy(() => import("@pages/login"));
const Dashboard = lazy(() => import("@pages/dashboard"));
const User = lazy(() => import("@pages/acl/user"));
const NotFound = lazy(() => import("@pages/404"));
const Trademark = lazy(() => import("@/pages/product/trademark/index"));

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

      // 权限管理
      {
        path: "/syt/acl",
        meta: { icon: <SettingOutlined />, title: "权限管理" },
        element: load(User),
        children: [
          {
            path: "/syt/acl/user",
            element: load(User),
            meta: { title: "用户管理" },
          },
        ],
      },
      // 品牌管理
      {
        path: "/syt/product",
        meta: { icon: <ShopOutlined />, title: "商品管理" },
        element: load(CompLayout),
        children: [
          {
            path: "/syt/product/trademark",
            meta: { title: "品牌管理" },
            element: load(Trademark),
          },
        ]
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

// 渲染路由
// 注意：首字母必须大写
export const RenderRoutes = () => {
  // react-router-dom的新增语法。不用自己遍历了，它帮我们遍历生成
  return useRoutes(routes);
};

// 找到要渲染成左侧菜单的路由
export const findSideBarRoutes = () => {
  const currentIndex = routes.findIndex((route) => route.path === "/syt");
  return routes[currentIndex].children as XRoutes;
};

export default routes;
