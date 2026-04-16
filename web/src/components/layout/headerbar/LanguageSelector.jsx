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
import { Button, Dropdown } from '@douyinfe/semi-ui';
import { Languages } from 'lucide-react';

const LanguageSelector = ({ currentLang, onLanguageChange, t }) => {
  return (
    <Dropdown
      position='bottomRight'
      render={
        <Dropdown.Menu className='na-dropdown-menu'>
          <Dropdown.Item
            onClick={() => onLanguageChange('zh-CN')}
            className={`na-dropdown-item ${currentLang === 'zh-CN' ? '!bg-semi-color-primary-light-default !font-semibold' : ''}`}
          >
            简体中文
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => onLanguageChange('zh-TW')}
            className={`na-dropdown-item ${currentLang === 'zh-TW' ? '!bg-semi-color-primary-light-default !font-semibold' : ''}`}
          >
            繁體中文
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => onLanguageChange('en')}
            className={`na-dropdown-item ${currentLang === 'en' ? '!bg-semi-color-primary-light-default !font-semibold' : ''}`}
          >
            English
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => onLanguageChange('fr')}
            className={`na-dropdown-item ${currentLang === 'fr' ? '!bg-semi-color-primary-light-default !font-semibold' : ''}`}
          >
            Français
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => onLanguageChange('ja')}
            className={`na-dropdown-item ${currentLang === 'ja' ? '!bg-semi-color-primary-light-default !font-semibold' : ''}`}
          >
            日本語
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => onLanguageChange('ru')}
            className={`na-dropdown-item ${currentLang === 'ru' ? '!bg-semi-color-primary-light-default !font-semibold' : ''}`}
          >
            Русский
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => onLanguageChange('vi')}
            className={`na-dropdown-item ${currentLang === 'vi' ? '!bg-semi-color-primary-light-default !font-semibold' : ''}`}
          >
            Tiếng Việt
          </Dropdown.Item>
        </Dropdown.Menu>
      }
    >
      <Button
        icon={<Languages size={18} />}
        aria-label={t('common.changeLanguage')}
        theme='borderless'
        type='tertiary'
        className='na-header-icon-button'
      />
    </Dropdown>
  );
};

export default LanguageSelector;
