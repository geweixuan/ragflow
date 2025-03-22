import { ReactComponent as ConfigurationIcon } from '@/assets/svg/knowledge-configration.svg';
import { ReactComponent as DatasetIcon } from '@/assets/svg/knowledge-dataset.svg';
import { ReactComponent as TestingIcon } from '@/assets/svg/knowledge-testing.svg';
import {
  useGetKnowledgeSearchParams,
  useSecondPathName,
} from '@/hooks/route-hook';
import { getWidth } from '@/utils';
import { Avatar, Menu, MenuProps, Space } from 'antd';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'umi';
import { KnowledgeRouteKey } from '../../constant';

import { isEmpty } from 'lodash';
import { GitGraph } from 'lucide-react';
import styles from './index.less';

// 模拟数据
const mockTrainDetails = {
  id: 'train-base-1',
  name: '训练知识库示例',
  description: '这是一个用于训练的示例知识库，包含了多种类型的训练数据。',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
};

const mockKnowledgeGraph = {
  graph: {
    nodes: [
      { id: 'node1', label: '节点1' },
      { id: 'node2', label: '节点2' },
    ],
    edges: [{ source: 'node1', target: 'node2' }],
  },
};

const TrainSidebar = () => {
  let navigate = useNavigate();
  const activeKey = useSecondPathName();
  const { knowledgeId } = useGetKnowledgeSearchParams();

  const [windowWidth, setWindowWidth] = useState(getWidth());
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  // 使用假数据
  const trainDetails = mockTrainDetails;
  const data = mockKnowledgeGraph;

  const handleSelect: MenuProps['onSelect'] = (e) => {
    navigate(`/train/${e.key}?id=${knowledgeId}`);
  };

  type MenuItem = Required<MenuProps>['items'][number];

  const getItem = useCallback(
    (
      label: string,
      key: React.Key,
      icon?: React.ReactNode,
      disabled?: boolean,
      children?: MenuItem[],
      type?: 'group',
    ): MenuItem => {
      return {
        key,
        icon,
        children,
        label: t(`trainDetails.${label}`),
        type,
        disabled,
      } as MenuItem;
    },
    [t],
  );

  const items: MenuItem[] = useMemo(() => {
    const list = [
      getItem(
        KnowledgeRouteKey.Dataset,
        KnowledgeRouteKey.Dataset,
        <DatasetIcon />,
      ),
      getItem(
        KnowledgeRouteKey.Testing,
        KnowledgeRouteKey.Testing,
        <TestingIcon />,
      ),
      getItem(
        KnowledgeRouteKey.Configuration,
        KnowledgeRouteKey.Configuration,
        <ConfigurationIcon />,
      ),
    ];

    if (!isEmpty(data?.graph)) {
      list.push(
        getItem(
          KnowledgeRouteKey.KnowledgeGraph,
          KnowledgeRouteKey.KnowledgeGraph,
          <GitGraph />,
        ),
      );
    }

    return list;
  }, [data, getItem]);

  useEffect(() => {
    if (windowWidth.width > 957) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  }, [windowWidth.width]);

  useEffect(() => {
    const widthSize = () => {
      const width = getWidth();

      setWindowWidth(width);
    };
    window.addEventListener('resize', widthSize);
    return () => {
      window.removeEventListener('resize', widthSize);
    };
  }, []);

  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.sidebarTop}>
        <Space size={8} direction="vertical">
          <Avatar size={64} src={trainDetails.avatar} />
          <div className={styles.knowledgeTitle}>{trainDetails.name}</div>
        </Space>
        <p className={styles.knowledgeDescription}>
          {trainDetails.description}
        </p>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.menuWrapper}>
        <Menu
          selectedKeys={[activeKey]}
          className={classNames(styles.menu, {
            [styles.defaultWidth]: windowWidth.width > 957,
            [styles.minWidth]: windowWidth.width <= 957,
          })}
          items={items}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
};

export default TrainSidebar;
