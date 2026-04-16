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

import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@douyinfe/semi-ui';
import { getFooterHTML, getLogo, getSystemName } from '../../helpers';
import { StatusContext } from '../../context/Status';

const FooterBar = () => {
  const { t } = useTranslation();
  const [footer, setFooter] = useState(getFooterHTML());
  const systemName = getSystemName();
  const logo = getLogo();
  const [statusState] = useContext(StatusContext);
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;

  const loadFooter = () => {
    let footer_html = localStorage.getItem('footer_html');
    if (footer_html) {
      setFooter(footer_html);
    }
  };

  const currentYear = new Date().getFullYear();

  const customFooter = useMemo(
    () => (
      <footer className='na-footer-wrap'>
        <div className='na-footer-card'>
          {isDemoSiteMode && (
            <div className='na-footer-top'>
              <div className='na-footer-brand'>
                <img src={logo} alt={systemName} className='na-footer-logo' />
                <div className='space-y-2'>
                  <p className='na-footer-brand-title'>{systemName}</p>
                  <p className='na-footer-brand-copy'>
                    {t(
                      '统一管理渠道、模型、密钥与文档入口，让接口代理与日常运营都更从容。',
                    )}
                  </p>
                </div>
              </div>

              <div className='na-footer-grid'>
                <div className='text-left'>
                  <p className='na-footer-title'>{t('关于我们')}</p>
                  <div className='flex flex-col gap-3'>
                    <a
                      href='https://docs.newapi.pro/wiki/project-introduction/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      {t('关于项目')}
                    </a>
                    <a
                      href='https://docs.newapi.pro/support/community-interaction/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      {t('联系我们')}
                    </a>
                    <a
                      href='https://docs.newapi.pro/wiki/features-introduction/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      {t('功能特性')}
                    </a>
                  </div>
                </div>

                <div className='text-left'>
                  <p className='na-footer-title'>{t('文档')}</p>
                  <div className='flex flex-col gap-3'>
                    <a
                      href='https://docs.newapi.pro/getting-started/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      {t('快速开始')}
                    </a>
                    <a
                      href='https://docs.newapi.pro/installation/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      {t('安装指南')}
                    </a>
                    <a
                      href='https://docs.newapi.pro/api/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      {t('API 文档')}
                    </a>
                  </div>
                </div>

                <div className='text-left'>
                  <p className='na-footer-title'>{t('相关项目')}</p>
                  <div className='flex flex-col gap-3'>
                    <a
                      href='https://github.com/songquanpeng/one-api'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      One API
                    </a>
                    <a
                      href='https://github.com/novicezk/midjourney-proxy'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      Midjourney-Proxy
                    </a>
                    <a
                      href='https://github.com/Calcium-Ion/neko-api-key-tool'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      neko-api-key-tool
                    </a>
                  </div>
                </div>

                <div className='text-left'>
                  <p className='na-footer-title'>{t('友情链接')}</p>
                  <div className='flex flex-col gap-3'>
                    <a
                      href='https://github.com/Calcium-Ion/new-api-horizon'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      new-api-horizon
                    </a>
                    <a
                      href='https://github.com/coaidev/coai'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      CoAI
                    </a>
                    <a
                      href='https://www.gpt-load.com/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='na-footer-link'
                    >
                      GPT-Load
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className='na-footer-bottom'>
            <div className='flex flex-wrap items-center gap-2'>
              <Typography.Text className='text-sm !text-semi-color-text-1'>
                © {currentYear} {systemName}. {t('版权所有')}
              </Typography.Text>
            </div>

            <div className='text-sm'>
              <span className='!text-semi-color-text-1'>
                {t('设计与开发由')}{' '}
              </span>
              <a
                href='https://github.com/QuantumNous/new-api'
                target='_blank'
                rel='noopener noreferrer'
                className='na-footer-link font-medium'
              >
                New API
              </a>
            </div>
          </div>
        </div>
      </footer>
    ),
    [logo, systemName, t, currentYear, isDemoSiteMode],
  );

  useEffect(() => {
    loadFooter();
  }, []);

  return (
    <div className='w-full'>
      {footer ? (
        <footer className='na-footer-wrap'>
          <div className='na-footer-card na-footer-card-compact'>
            <div
              className='custom-footer na-cb6feafeb3990c78 text-sm !text-semi-color-text-1'
              dangerouslySetInnerHTML={{ __html: footer }}
            ></div>
            <div className='text-sm flex-shrink-0'>
              <span className='!text-semi-color-text-1'>
                {t('设计与开发由')}{' '}
              </span>
              <a
                href='https://github.com/QuantumNous/new-api'
                target='_blank'
                rel='noopener noreferrer'
                className='na-footer-link font-medium'
              >
                New API
              </a>
            </div>
          </div>
        </footer>
      ) : (
        customFooter
      )}
    </div>
  );
};

export default FooterBar;
