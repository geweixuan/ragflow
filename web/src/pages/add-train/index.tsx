import { useKnowledgeBaseId } from '@/hooks/knowledge-hooks';
import {
  useNavigateWithFromState,
  useSecondPathName,
  useThirdPathName,
} from '@/hooks/route-hook';
import { Breadcrumb } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'umi';
import Sidebar from './components/train-sidebar';
import { KnowledgeRouteKey, TrainDatasetRouteKey } from './constant';
import styles from './index.less';

const TrainAdding = () => {
  const knowledgeBaseId = useKnowledgeBaseId();

  const { t } = useTranslation();
  const activeKey: KnowledgeRouteKey =
    (useSecondPathName() as KnowledgeRouteKey) || KnowledgeRouteKey.Dataset;

  const datasetActiveKey: TrainDatasetRouteKey =
    useThirdPathName() as TrainDatasetRouteKey;

  const gotoList = useNavigateWithFromState();

  const breadcrumbItems: ItemType[] = useMemo(() => {
    const items: ItemType[] = [
      {
        title: <a onClick={() => gotoList('/train')}>{t('header.train')}</a>,
      },
      {
        title: datasetActiveKey ? (
          <Link
            to={`/train/${KnowledgeRouteKey.Dataset}?id=${knowledgeBaseId}`}
          >
            {t(`knowledgeDetails.${activeKey}`)}
          </Link>
        ) : (
          t(`knowledgeDetails.${activeKey}`)
        ),
      },
    ];

    if (datasetActiveKey) {
      items.push({
        title: t(`knowledgeDetails.${datasetActiveKey}`),
      });
    }

    return items;
  }, [activeKey, datasetActiveKey, gotoList, knowledgeBaseId, t]);

  return (
    <>
      <div className={styles.container}>
        <Sidebar></Sidebar>
        <div className={styles.contentWrapper}>
          <Breadcrumb items={breadcrumbItems} />
          <div className={styles.content}>
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainAdding;
