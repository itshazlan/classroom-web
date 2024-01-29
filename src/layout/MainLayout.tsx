import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
    children?: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
    return <div>{children || <Outlet />}</div>;
};

MainLayout.propTypes = {
    children: PropTypes.node,
};

export default MainLayout;
