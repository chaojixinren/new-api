/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SkeletonWrapper from '../components/SkeletonWrapper';

const Navigation = ({
  mainNavLinks,
  isMobile,
  isLoading,
  userState,
  pricingRequireAuth,
}) => {
  const location = useLocation();

  const isLinkActive = (itemKey, targetPath) => {
    if (!targetPath) {
      return false;
    }

    if (itemKey === 'home') {
      return location.pathname === '/';
    }

    return (
      location.pathname === targetPath ||
      location.pathname.startsWith(`${targetPath}/`)
    );
  };

  const renderNavLinks = () => {
    return mainNavLinks.map((link) => {
      const linkContent = <span>{link.text}</span>;

      if (link.isExternal) {
        return (
          <a
            key={link.itemKey}
            href={link.externalLink}
            target='_blank'
            rel='noopener noreferrer'
            className='na-header-nav-link'
          >
            {linkContent}
          </a>
        );
      }

      let targetPath = link.to;
      if (link.itemKey === 'console' && !userState.user) {
        targetPath = '/login';
      }
      if (link.itemKey === 'pricing' && pricingRequireAuth && !userState.user) {
        targetPath = '/login';
      }

      const isActive = isLinkActive(link.itemKey, link.to);

      return (
        <Link
          key={link.itemKey}
          to={targetPath}
          className={`na-header-nav-link ${isActive ? 'na-header-nav-link-active' : ''}`}
        >
          {linkContent}
        </Link>
      );
    });
  };

  return (
    <nav className='flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-2 md:px-4'>
      <SkeletonWrapper
        loading={isLoading}
        type='navigation'
        count={4}
        width={60}
        height={16}
        isMobile={isMobile}
      >
        {renderNavLinks()}
      </SkeletonWrapper>
    </nav>
  );
};

export default Navigation;
