import { lazy } from 'react';
import type { RouteObject } from 'react-router';

import MainLayout from './layout/MainLayout';

// * PAGES
const Login = lazy(() => import('../src/pages/login/login'));
const Home = lazy(() => import('../src/pages/home/home'));
const Parent = lazy(() => import('../src/pages/test/parent'));

const AppRouter: RouteObject[] = [
    {
        path: 'login',
        element: (
            <Login />
        )
    },
    {
        path: 'home',
        element: (
            <Home />
        )
    },
    {
        path: 'parent',
        element: (
            <Parent />
        )
    },
    {
        path: '*',
        element: <MainLayout />,
        children: [{
            index: true,
            element: <Login />
        }]
    },
];

export default AppRouter;
