import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import {
  CloudServerOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  InfoCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { Flex, Steps, Tabs, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import { IKnowledge, ParserConfig } from '@/interfaces/database/knowledge';
import { useMemo, useState } from 'react';
import styles from './index.less';

// 导入页签组件
import {
  DataPreparation,
  ModelDeployment,
  ModelTraining,
  ModelValidation,
} from './components';

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
  // const {
  //   visible,
  //   hideModal,
  //   showModal,
  //   onCreateOk,
  //   loading: creatingLoading,
  // } = useSaveTrain();

  // 简单模态框状态
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

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

  // 步骤状态
  const [current, setCurrent] = useState(0);
  const onChange = (value: number) => {
    setCurrent(value);
  };

  // 定义步骤项和hoverInfo内容
  const stepsInfo = {
    dataPreparation:
      '数据准备是训练模型的关键步骤。请选择合适的训练模式和数据类型，准备高质量的数据集。LLaMA Factory支持多种训练模式和数据类型，可以根据需求进行选择。',
    modelTraining:
      '模型训练是微调大型语言模型的核心步骤，可选择不同的基础模型、训练数据集和训练参数进行定制化训练。支持LoRA、QLoRA、全参数微调等多种训练方式，适应不同的训练需求和硬件条件。',
    modelValidation:
      '全面评估您训练的模型性能，支持多维度指标分析和交互式验证。可以通过指标比较查看准确率、F1分数等关键性能指标，也可以通过交互测试亲自体验模型效果，确保模型质量符合预期。',
    modelDeployment:
      '将训练好的模型部署到各种环境中，支持版本管理和资源配置，快速实现模型服务化。包括测试环境、预发环境和生产环境的灵活部署选项，可配置计算资源和副本数量，确保模型稳定高效运行。',
  };

  // 定义步骤项
  const steps = [
    {
      title: (
        <span className={styles.stepTitle}>
          数据准备
          <Tooltip title={stepsInfo.dataPreparation}>
            <InfoCircleOutlined className={styles.stepHoverIcon} />
          </Tooltip>
        </span>
      ),
      description: '创建管理训练数据',
      icon: <DatabaseOutlined />,
      hoverInfo: stepsInfo.dataPreparation,
    },
    {
      title: (
        <span className={styles.stepTitle}>
          模型训练
          <Tooltip title={stepsInfo.modelTraining}>
            <InfoCircleOutlined className={styles.stepHoverIcon} />
          </Tooltip>
        </span>
      ),
      description: '配置并训练模型',
      icon: <RocketOutlined />,
      hoverInfo: stepsInfo.modelTraining,
    },
    {
      title: (
        <span className={styles.stepTitle}>
          模型验证
          <Tooltip title={stepsInfo.modelValidation}>
            <InfoCircleOutlined className={styles.stepHoverIcon} />
          </Tooltip>
        </span>
      ),
      description: '评估模型性能',
      icon: <ExperimentOutlined />,
      hoverInfo: stepsInfo.modelValidation,
    },
    {
      title: (
        <span className={styles.stepTitle}>
          模型部署
          <Tooltip title={stepsInfo.modelDeployment}>
            <InfoCircleOutlined className={styles.stepHoverIcon} />
          </Tooltip>
        </span>
      ),
      description: '部署到生产环境',
      icon: <CloudServerOutlined />,
      hoverInfo: stepsInfo.modelDeployment,
    },
  ];

  return (
    <Flex className={styles.train} vertical flex={1} id="scrollableDiv">
      <div className={styles.topWrapper}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>一站式模型训练</span>
          <div className={styles.stepsContainer}>
            <Steps
              current={current}
              onChange={onChange}
              items={steps}
              className={styles.trainingSteps}
              size="small"
              direction="horizontal"
            />
          </div>
        </div>
      </div>
      <Tabs
        defaultActiveKey="1"
        activeKey={(current + 1).toString()}
        onChange={(key) => setCurrent(parseInt(key) - 1)}
        tabBarStyle={{ display: 'none' }}
      >
        <Tabs.TabPane key="1">
          <DataPreparation
            loading={loading}
            filteredData={filteredData}
            showModal={showModal}
            onNext={() => setCurrent(current + 1)}
          />
        </Tabs.TabPane>

        <Tabs.TabPane key="2">
          <ModelTraining />
        </Tabs.TabPane>

        <Tabs.TabPane key="3">
          <ModelValidation />
        </Tabs.TabPane>

        <Tabs.TabPane key="4">
          <ModelDeployment />
        </Tabs.TabPane>
      </Tabs>

      {/* <KnowledgeCreatingModal
        loading={creatingLoading}
        visible={visible}
        hideModal={hideModal}
        onOk={onCreateOk}
      ></KnowledgeCreatingModal> */}
    </Flex>
  );
};

export default TrainList;
