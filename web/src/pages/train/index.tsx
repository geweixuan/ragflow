import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Empty,
  Flex,
  Input,
  Skeleton,
  Space,
  Spin,
} from 'antd';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSaveTrain } from './hooks';
import KnowledgeCard from './train-card';
import KnowledgeCreatingModal from './train-creating-modal';

import { IKnowledge, ParserConfig } from '@/interfaces/database/knowledge';
import { useMemo, useState } from 'react';
import styles from './index.less';

// 模拟的训练集数据
const mockTrainData: IKnowledge[] = [
  {
    id: '1',
    name: 'Deepseek-1.5B-预训练',
    description: '用于训练机器翻译模型的数据集，包含中英文翻译对',
    doc_num: 1280,
    update_time: 1684406400000, // 2023-05-18T10:30:00Z
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
    nickname: '业务1组',
    permission: 'team',
    // 添加其他必要的字段
    chunk_num: 56,
    create_date: '2023-05-18',
    create_time: 1679234567890,
    created_by: '1',
    parser_id: 'default',
    similarity_threshold: 0.7,
    status: '1', // 使用字符串而不是数字
    tenant_id: 'tenant1',
    token_num: 12800,
    vector_similarity_weight: 0.8,
    embd_id: 'embd1',
    parser_config: {} as ParserConfig,
    update_date: '2023-05-18',
  },
  {
    id: '2',
    name: 'qwen-32B-模型微调',
    description: '用于训练情感分析模型的标注数据，包含正面、负面、中性情感标签',
    doc_num: 3500,
    update_time: 1687446000000, // 2023-06-22T14:20:00Z
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=2',
    nickname: '平台2组',
    permission: 'me',
    // 添加其他必要的字段
    chunk_num: 120,
    create_date: '2023-06-22',
    create_time: 1687446000000,
    created_by: '2',
    parser_id: 'default',
    similarity_threshold: 0.75,
    status: '1',
    tenant_id: 'tenant1',
    token_num: 35000,
    vector_similarity_weight: 0.7,
    embd_id: 'embd1',
    parser_config: {} as ParserConfig,
    update_date: '2023-06-22',
  },
];

const TrainList = () => {
  const { data: userInfo } = useFetchUserInfo();
  const { t } = useTranslation('translation', { keyPrefix: 'trainList' });
  const {
    visible,
    hideModal,
    showModal,
    onCreateOk,
    loading: creatingLoading,
  } = useSaveTrain();

  // 搜索状态和处理函数
  const [searchString, setSearchString] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 根据搜索条件过滤数据
  const filteredData = useMemo(() => {
    if (!searchString) return mockTrainData;
    return mockTrainData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchString.toLowerCase()) ||
        item.description.toLowerCase().includes(searchString.toLowerCase()),
    );
  }, [searchString]);

  // 处理搜索输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  // 模拟加载更多数据
  const fetchNextPage = () => {
    console.log('加载更多数据');
    // 这里是静态数据，所以不需要真正加载
  };

  // 模拟计算总数
  const total = mockTrainData.length;

  return (
    <Flex className={styles.train} vertical flex={1} id="scrollableDiv">
      <div className={styles.topWrapper}>
        <div>
          <span className={styles.title}>{'一站式模型训练'}</span>
          <p className={styles.description}>
            {'创建训练数据->模型训练->模型测试->模型部署'}
          </p>
        </div>
        <Space size={'large'}>
          <Input
            placeholder={t('searchTrainPlaceholder')}
            value={searchString}
            style={{ width: 220 }}
            allowClear
            onChange={handleInputChange}
            prefix={<SearchOutlined />}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className={styles.topButton}
          >
            {t('createTrainBase')}
          </Button>
        </Space>
      </div>
      <Spin spinning={loading}>
        <InfiniteScroll
          dataLength={filteredData.length}
          next={fetchNextPage}
          hasMore={false} // 静态数据，没有更多加载
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={
            filteredData.length > 0 && (
              <Divider plain>{t('noMoreData')} 🤐</Divider>
            )
          }
          scrollableTarget="scrollableDiv"
        >
          <Flex gap={'large'} wrap="wrap" className={styles.trainCardContainer}>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <KnowledgeCard item={item} key={`${item.id}`}></KnowledgeCard>
              ))
            ) : (
              <Empty className={styles.trainEmpty}></Empty>
            )}
          </Flex>
        </InfiniteScroll>
      </Spin>
      <KnowledgeCreatingModal
        loading={creatingLoading}
        visible={visible}
        hideModal={hideModal}
        onOk={onCreateOk}
      ></KnowledgeCreatingModal>
    </Flex>
  );
};

export default TrainList;
