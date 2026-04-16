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

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Input, ScrollList, ScrollItem } from '@douyinfe/semi-ui';
import {
  API,
  showError,
  copy,
  showSuccess,
  getSystemName,
} from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  IconGithubLogo,
  IconPlay,
  IconFile,
  IconCopy,
} from '@douyinfe/semi-icons';
import {
  Blocks,
  Cable,
  ShieldCheck,
  Sparkles,
  Waypoints,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
} from '@lobehub/icons';
import PretextAsciiHero from '../../components/home/PretextAsciiHero';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const systemName = getSystemName();
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  const currentEndpoint = endpointItems[endpointIndex]?.value || '';
  const isChinese = i18n.language.startsWith('zh');

  const featureCards = useMemo(
    () => [
      {
        icon: <Cable size={18} strokeWidth={1.9} />,
        title: t('统一接入'),
        description: t('一套入口兼容主流模型供应商，减少重复接入与切换成本。'),
      },
      {
        icon: <Blocks size={18} strokeWidth={1.9} />,
        title: t('更清晰的层级'),
        description: t(
          '重要动作、关键信息与辅助说明分层展示，阅读和操作都更轻松。',
        ),
      },
      {
        icon: <ShieldCheck size={18} strokeWidth={1.9} />,
        title: t('稳定而克制'),
        description: t(
          '用更温暖的界面承载偏技术的内容，让长期运营和日常管理更耐看。',
        ),
      },
      {
        icon: <Sparkles size={18} strokeWidth={1.9} />,
        title: t('统一的视觉语言'),
        description: t(
          '米色背景、白色卡片和酒红强调共同组成现代、专业又有人情味的基调。',
        ),
      },
    ],
    [t],
  );

  const experienceHighlights = useMemo(
    () => [
      t('Hero 区把最重要的地址复制与入口动作放到第一屏。'),
      t('卡片边界更柔和，信息块之间的留白更稳定。'),
      t('衬线标题负责气质，无衬线正文负责效率与可读性。'),
      t('首页和控制台共享同一套按钮、边框和背景语言。'),
    ],
    [t],
  );

  const quickSteps = useMemo(
    () => [
      {
        id: '01',
        title: t('复制服务地址'),
        description: t('将基址复制到你的应用或 SDK 配置中，作为统一入口。'),
      },
      {
        id: '02',
        title: t('替换模型端点'),
        description: t('把上游的接口地址切到兼容端点，保留你熟悉的调用方式。'),
      },
      {
        id: '03',
        title: t('进入控制台'),
        description: t('在控制台里创建密钥、管理渠道与查看运行状态。'),
      },
    ],
    [t],
  );

  const providerItems = useMemo(
    () => [
      { name: 'Moonshot', icon: <Moonshot size={30} /> },
      { name: 'OpenAI', icon: <OpenAI size={30} /> },
      { name: 'xAI', icon: <XAI size={30} /> },
      { name: 'Zhipu', icon: <Zhipu.Color size={30} /> },
      { name: 'Volcengine', icon: <Volcengine.Color size={30} /> },
      { name: 'Cohere', icon: <Cohere.Color size={30} /> },
      { name: 'Claude', icon: <Claude.Color size={30} /> },
      { name: 'Gemini', icon: <Gemini.Color size={30} /> },
      { name: 'Suno', icon: <Suno size={30} /> },
      { name: 'Minimax', icon: <Minimax.Color size={30} /> },
      { name: 'Wenxin', icon: <Wenxin.Color size={30} /> },
      { name: 'Spark', icon: <Spark.Color size={30} /> },
      { name: 'Qingyan', icon: <Qingyan.Color size={30} /> },
      { name: 'DeepSeek', icon: <DeepSeek.Color size={30} /> },
      { name: 'Qwen', icon: <Qwen.Color size={30} /> },
      { name: 'Midjourney', icon: <Midjourney size={30} /> },
      { name: 'Grok', icon: <Grok size={30} /> },
      { name: 'Azure AI', icon: <AzureAI.Color size={30} /> },
      { name: 'Hunyuan', icon: <Hunyuan.Color size={30} /> },
      { name: 'Xinference', icon: <Xinference.Color size={30} /> },
    ],
    [],
  );

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      // 如果内容是 URL，则发送主题模式
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  return (
    <div className='w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className='w-full overflow-x-hidden'>
          {/* Banner 部分 */}
          <div className='w-full border-b border-semi-color-border min-h-[500px] md:min-h-[600px] lg:min-h-[700px] relative overflow-x-hidden'>
            {/* ASCII 背景特效层 */}
            <PretextAsciiHero className='na-pretext-panel-hero' />
            <div className='flex items-center justify-center h-full px-4 py-20 md:py-24 lg:py-32 mt-10'>
              {/* 居中内容区 */}
              <div className='flex flex-col items-center justify-center text-center max-w-4xl mx-auto'>
                <div className='flex flex-col items-center justify-center mb-6 md:mb-8'>
                  <h1
                    className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-semi-color-text-0 leading-tight ${isChinese ? 'tracking-wide md:tracking-wider' : ''}`}
                  >
                    <>
                      {t('统一的')}
                      <br />
                      <span className='shine-text'>{t('大模型接口网关')}</span>
                    </>
                </h1>
                  <p className='text-base md:text-lg lg:text-xl text-semi-color-text-1 mt-4 md:mt-6 max-w-xl'>
                  {t('更好的价格，更好的稳定性，只需要将模型基址替换为：')}
                </p>
                  {/* BASE URL 与端点选择 */}
                  <div className='flex flex-col md:flex-row items-center justify-center gap-4 w-full mt-4 md:mt-6 max-w-md'>
                    <Input
                      readonly
                      value={serverAddress}
                      className='flex-1 !rounded-full'
                      size={isMobile ? 'default' : 'large'}
                      suffix={
                        <div className='flex items-center gap-2'>
                          <ScrollList
                            bodyHeight={32}
                            style={{ border: 'unset', boxShadow: 'unset' }}
                          >
                            <ScrollItem
                              mode='wheel'
                              cycled={true}
                              list={endpointItems}
                              selectedIndex={endpointIndex}
                              onSelect={({ index }) => setEndpointIndex(index)}
                            />
                          </ScrollList>
                          <Button
                            type='primary'
                            onClick={handleCopyBaseURL}
                            icon={<IconCopy />}
                            className='!rounded-full'
                          />
                        </div>
                      }
                    />
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className='flex flex-row gap-4 justify-center items-center'>
                  <Link to='/console'>
                    <Button
                      theme='solid'
                      type='primary'
                      size={isMobile ? 'default' : 'large'}
                      className='na-btn-primary'
                      icon={<IconPlay />}
                    >
                      {t('获取密钥')}
                    </Button>
                  </Link>
                  {isDemoSiteMode && statusState?.status?.version ? (
                    <Button
                      size={isMobile ? 'default' : 'large'}
                      className='na-btn-outline'
                      icon={<IconGithubLogo />}
                      onClick={() =>
                        window.open(
                          'https://github.com/QuantumNous/new-api',
                          '_blank',
                        )
                      }
                    >
                      {statusState.status.version}
                    </Button>
                  ) : (
                    docsLink && (
                      <Button
                        size={isMobile ? 'default' : 'large'}
                        className='na-btn-outline'
                        icon={<IconFile />}
                        onClick={() => window.open(docsLink, '_blank')}
                      >
                        {t('文档')}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <main className='na-home-main'>
            <div className='na-home-container'>
              <section className='na-home-section'>
                <div className='na-section-header'>
                  <p className='na-section-eyebrow'>{t('界面升级')}</p>
                  <h2 className='na-section-title'>
                    {t('让技术产品同时具备效率感与人文气质')}
                  </h2>
                  <p className='na-section-description'>
                    {t(
                      '新的默认样式把首页、按钮、卡片和导航统一到同一套视觉语言里，保留技术感，同时降低长时间使用时的疲劳感。',
                    )}
                  </p>
                </div>
                <div className='na-card-grid'>
                  {featureCards.map((card) => (
                    <article
                      key={card.title}
                      className='na-card na-feature-card'
                    >
                      <div className='na-feature-icon'>{card.icon}</div>
                      <h3 className='na-feature-title'>{card.title}</h3>
                      <p className='na-feature-description'>
                        {card.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className='na-home-section'>
                <div className='na-card na-card-lg'>
                  <div className='na-story-layout'>
                    <div>
                      <p className='na-section-eyebrow'>{t('设计要点')}</p>
                      <h2 className='na-section-title'>
                        {t('把关键入口、卡片层级与操作反馈都收得更清楚')}
                      </h2>
                      <p className='na-section-description'>
                        {t(
                          '首页现在优先展示最重要的动作与信息，并让整个项目的视觉反馈更一致。',
                        )}
                      </p>
                      <div className='na-bullet-list'>
                        {experienceHighlights.map((item) => (
                          <div key={item} className='na-bullet-row'>
                            <span className='na-bullet'></span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='na-step-list'>
                      {quickSteps.map((step) => (
                        <article key={step.id} className='na-step-card'>
                          <div className='na-step-number'>{step.id}</div>
                          <div className='na-step-body'>
                            <h3 className='na-step-title'>{step.title}</h3>
                            <p className='na-step-description'>
                              {step.description}
                            </p>
                          </div>
                          <ArrowRight size={16} className='na-step-arrow' />
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className='na-home-section'>
                <div className='na-card na-provider-card'>
                  <div className='na-provider-header'>
                    <div>
                      <p className='na-section-eyebrow'>{t('生态兼容')}</p>
                      <h2 className='na-section-title'>
                        {t('支持众多的大模型供应商')}
                      </h2>
                    </div>
                    <div className='na-provider-count'>
                      <Waypoints size={16} />
                      <span>40+</span>
                    </div>
                  </div>
                  <div className='na-provider-grid'>
                    {providerItems.map((provider) => (
                      <div key={provider.name} className='na-provider-item'>
                        <div className='na-provider-icon'>{provider.icon}</div>
                        <span className='na-provider-label'>
                          {provider.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      ) : (
        <div className='na-home-custom overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-screen border-none'
            />
          ) : (
            <div
              className='na-home-custom-body mt-[84px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
