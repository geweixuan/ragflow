import {
  CloudOutlined,
  DeploymentUnitOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  RocketOutlined,
  SearchOutlined,
  SettingOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  List,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Switch,
  Tag,
  Timeline,
  Tooltip,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import styles from '../index.less';

const { Option } = Select;
const { Text, Title, Paragraph } = Typography;
const { Step } = Steps;

// 定义部署历史记录的类型
interface DeploymentRecord {
  time: number;
  action: string;
  environment: string;
  version: string;
  status: string;
}

// 定义模型数据类型
interface ModelData {
  id: string;
  name: string;
  baseModel: string;
  status: string;
  lastTrained: number;
  deploymentStatus: string | null;
  deploymentEnvironment?: string;
  deploymentHistory: DeploymentRecord[];
}

// 定义环境选项的类型
interface EnvironmentOption {
  label: string;
  value: string;
  icon: React.ReactNode;
}

// 模拟的模型部署数据
const mockModels: ModelData[] = [
  {
    id: '1',
    name: 'Deepseek-Coder微调',
    baseModel: 'Deepseek-Coder-6.7B',
    status: 'ready',
    lastTrained: new Date().getTime() - 3600000 * 48,
    deploymentStatus: null,
    deploymentHistory: [],
  },
  {
    id: '2',
    name: 'LLAMA2-文本分类',
    baseModel: 'LLAMA2-7b',
    status: 'deployed',
    lastTrained: new Date().getTime() - 3600000 * 96,
    deploymentStatus: 'running',
    deploymentEnvironment: 'production',
    deploymentHistory: [
      {
        time: new Date().getTime() - 3600000 * 95,
        action: 'deployed',
        environment: 'staging',
        version: '1.0.0',
        status: 'success',
      },
      {
        time: new Date().getTime() - 3600000 * 72,
        action: 'scaled',
        environment: 'staging',
        version: '1.0.0',
        status: 'success',
      },
      {
        time: new Date().getTime() - 3600000 * 48,
        action: 'deployed',
        environment: 'production',
        version: '1.0.0',
        status: 'success',
      },
    ],
  },
  {
    id: '3',
    name: 'Qwen-多语言',
    baseModel: 'Qwen-7B',
    status: 'deployed',
    lastTrained: new Date().getTime() - 3600000 * 120,
    deploymentStatus: 'failed',
    deploymentEnvironment: 'staging',
    deploymentHistory: [
      {
        time: new Date().getTime() - 3600000 * 121,
        action: 'deployed',
        environment: 'staging',
        version: '1.0.0',
        status: 'failed',
      },
    ],
  },
  {
    id: '4',
    name: 'Baichuan2-知识问答',
    baseModel: 'Baichuan2-7B',
    status: 'deployed',
    lastTrained: new Date().getTime() - 3600000 * 36,
    deploymentStatus: 'deploying',
    deploymentEnvironment: 'dev',
    deploymentHistory: [
      {
        time: new Date().getTime() - 3600000 * 1,
        action: 'deployed',
        environment: 'dev',
        version: '0.9.0',
        status: 'deploying',
      },
    ],
  },
];

// 环境选项
const environments: EnvironmentOption[] = [
  { label: '测试环境', value: 'dev', icon: <CloudOutlined /> },
  { label: '预发环境', value: 'staging', icon: <EnvironmentOutlined /> },
  { label: '生产环境', value: 'production', icon: <GlobalOutlined /> },
];

// 获取环境标签
const getEnvironmentLabel = (value: string): string => {
  const env = environments.find((e) => e.value === value);
  return env ? env.label : '目标环境';
};

// 获取环境标签颜色
const getEnvironmentColor = (value: string): string => {
  const colorMap: Record<string, string> = {
    dev: 'purple',
    staging: 'orange',
    production: 'green',
  };
  return colorMap[value] || 'blue';
};

// 获取模型状态颜色和文本
const getModelStatusBadge = (status: string | null) => {
  if (!status) return <Badge status="default" text="未部署" />;

  const statusMap: Record<
    string,
    { status: 'success' | 'processing' | 'error' | 'default'; text: string }
  > = {
    running: { status: 'success', text: '运行中' },
    deploying: { status: 'processing', text: '部署中' },
    failed: { status: 'error', text: '部署失败' },
    stopped: { status: 'default', text: '已停止' },
  };

  const config = statusMap[status] || { status: 'default', text: '未知状态' };
  return <Badge status={config.status} text={config.text} />;
};

const ModelDeployment: React.FC = () => {
  // 状态管理
  const [searchText, setSearchText] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ModelData | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [deployForm] = Form.useForm();
  const [deployTarget, setDeployTarget] = useState('staging');
  const [deployStep, setDeployStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'list'>('list');

  // 过滤数据
  const filteredModels = searchText
    ? mockModels.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.baseModel.toLowerCase().includes(searchText.toLowerCase()),
      )
    : mockModels;

  // 处理部署模型
  const handleDeploy = (record: ModelData) => {
    setSelectedRecord(record);
    setShowDeployModal(true);
    deployForm.setFieldsValue({
      environment: 'staging',
      replicas: 2,
      autoScaling: true,
      version: '1.0.0',
      memory: '16',
      gpu: '1',
    });
  };

  // 关闭部署模态框
  const handleCloseDeployModal = () => {
    setShowDeployModal(false);
    setDeployStep(0);
  };

  // 开始部署
  const handleStartDeploy = () => {
    setLoading(true);
    // 模拟部署流程
    setTimeout(() => {
      setDeployStep(1);
      setTimeout(() => {
        setDeployStep(2);
        setLoading(false);
      }, 1500);
    }, 2000);
  };

  // 打开历史记录模态框
  const handleShowHistory = (record: ModelData) => {
    setSelectedRecord(record);
    setShowHistoryModal(true);
  };

  // 关闭历史记录模态框
  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
  };

  // 停止部署
  const handleStopDeployment = (record: ModelData) => {
    Modal.confirm({
      title: '确认停止部署',
      icon: <ExclamationCircleOutlined />,
      content: `确定要停止 ${record.name} 在 ${getEnvironmentLabel(record.deploymentEnvironment || '')} 的部署吗？`,
      onOk() {
        // 模拟停止操作
        console.log('停止部署', record.id);
      },
    });
  };

  // 格式化时间
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // 渲染模型卡片列表
  const renderModelList = () => (
    <>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索可部署模型"
          style={{ width: 300 }}
          suffix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Space>
          <Select defaultValue="all" style={{ width: 150 }}>
            <Option value="all">所有模型</Option>
            <Option value="ready">待部署</Option>
            <Option value="deployed">已部署</Option>
          </Select>
        </Space>
      </Flex>

      {filteredModels.length > 0 ? (
        <List
          dataSource={filteredModels}
          renderItem={(item) => (
            <Card
              className={styles.modelCard}
              title={
                <Flex justify="space-between" align="center">
                  <Space>
                    <DeploymentUnitOutlined />
                    <Text strong>{item.name}</Text>
                    {getModelStatusBadge(item.deploymentStatus)}
                  </Space>
                  <Space>
                    {item.deploymentHistory.length > 0 && (
                      <Tooltip title="部署历史">
                        <Button
                          type="text"
                          icon={<RocketOutlined />}
                          onClick={() => handleShowHistory(item)}
                        />
                      </Tooltip>
                    )}
                    {item.deploymentStatus === 'running' && (
                      <Tooltip title="停止部署">
                        <Button
                          type="text"
                          danger
                          icon={<StopOutlined />}
                          onClick={() => handleStopDeployment(item)}
                        />
                      </Tooltip>
                    )}
                    <Tooltip title="部署配置">
                      <Button
                        type="text"
                        icon={<SettingOutlined />}
                        onClick={() => handleDeploy(item)}
                      />
                    </Tooltip>
                  </Space>
                </Flex>
              }
              style={{ marginBottom: 16 }}
            >
              <Flex vertical gap="small">
                <Flex>
                  <Text style={{ width: 100 }}>基础模型:</Text>
                  <Text strong>{item.baseModel}</Text>
                </Flex>
                <Flex>
                  <Text style={{ width: 100 }}>最后训练:</Text>
                  <Text>{formatTime(item.lastTrained)}</Text>
                </Flex>
                {item.deploymentStatus && (
                  <Flex>
                    <Text style={{ width: 100 }}>部署环境:</Text>
                    <Tag
                      color={getEnvironmentColor(
                        item.deploymentEnvironment || '',
                      )}
                    >
                      {
                        environments.find(
                          (e) => e.value === item.deploymentEnvironment,
                        )?.icon
                      }{' '}
                      {getEnvironmentLabel(item.deploymentEnvironment || '')}
                    </Tag>
                  </Flex>
                )}
                {item.deploymentStatus === 'deploying' && (
                  <Flex style={{ marginTop: 8 }}>
                    <Progress percent={45} status="active" />
                  </Flex>
                )}
                {!item.deploymentStatus && (
                  <Flex justify="end" style={{ marginTop: 8 }}>
                    <Button
                      type="primary"
                      icon={<RocketOutlined />}
                      onClick={() => handleDeploy(item)}
                    >
                      部署模型
                    </Button>
                  </Flex>
                )}
              </Flex>
            </Card>
          )}
        />
      ) : (
        <Empty
          description="暂无可部署模型"
          style={{ marginTop: 40 }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </>
  );

  // 渲染部署对话框
  const renderDeployModal = () => {
    if (!selectedRecord) return null;

    return (
      <Modal
        title={`部署模型: ${selectedRecord.name}`}
        open={showDeployModal}
        onCancel={handleCloseDeployModal}
        width={700}
        footer={null}
      >
        <Steps current={deployStep} style={{ marginBottom: 24 }}>
          <Step title="配置" description="设置部署参数" />
          <Step title="确认" description="确认部署信息" />
          <Step title="完成" description="部署成功" />
        </Steps>

        {deployStep === 0 && (
          <Form form={deployForm} layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="environment"
                  label="部署环境"
                  rules={[{ required: true, message: '请选择部署环境' }]}
                >
                  <Select onChange={(value) => setDeployTarget(value)}>
                    {environments.map((env) => (
                      <Option key={env.value} value={env.value}>
                        <Space>
                          {env.icon}
                          <span>{env.label}</span>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="version"
                  label="版本号"
                  rules={[{ required: true, message: '请输入版本号' }]}
                >
                  <Input placeholder="例如: 1.0.0" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="replicas"
                  label="副本数量"
                  rules={[{ required: true, message: '请选择副本数量' }]}
                >
                  <Radio.Group>
                    <Radio value={1}>1</Radio>
                    <Radio value={2}>2</Radio>
                    <Radio value={3}>3</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="autoScaling"
                  label="自动扩缩容"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">资源配置</Divider>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="memory"
                  label="内存 (GB)"
                  rules={[{ required: true, message: '请选择内存大小' }]}
                >
                  <Select>
                    <Option value="8">8 GB</Option>
                    <Option value="16">16 GB</Option>
                    <Option value="32">32 GB</Option>
                    <Option value="64">64 GB</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gpu"
                  label="GPU"
                  rules={[{ required: true, message: '请选择GPU配置' }]}
                >
                  <Select>
                    <Option value="1">1 x NVIDIA A100</Option>
                    <Option value="2">2 x NVIDIA A100</Option>
                    <Option value="4">4 x NVIDIA A100</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCloseDeployModal}>取消</Button>
                <Button
                  type="primary"
                  onClick={handleStartDeploy}
                  loading={loading}
                >
                  开始部署
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}

        {deployStep === 1 && (
          <Card loading={loading} title="正在部署...">
            <Flex vertical gap="middle" align="center">
              <Progress percent={65} status="active" style={{ width: '80%' }} />
              <Text>
                正在部署模型到{getEnvironmentLabel(deployTarget)}，请稍候...
              </Text>
            </Flex>
          </Card>
        )}

        {deployStep === 2 && (
          <Card title="部署完成">
            <Flex vertical gap="middle" align="center">
              <DeploymentUnitOutlined
                style={{ fontSize: 48, color: '#52c41a' }}
              />
              <Title level={4}>模型已成功部署!</Title>
              <Paragraph>
                模型已成功部署到{getEnvironmentLabel(deployTarget)}
                环境。您现在可以通过API调用该模型。
              </Paragraph>
              <Space style={{ marginTop: 16 }}>
                <Button onClick={handleCloseDeployModal}>关闭</Button>
                <Button type="primary">查看API文档</Button>
              </Space>
            </Flex>
          </Card>
        )}
      </Modal>
    );
  };

  // 渲染部署历史对话框
  const renderHistoryModal = () => {
    if (!selectedRecord) return null;

    return (
      <Modal
        title={`${selectedRecord.name} - 部署历史`}
        open={showHistoryModal}
        onCancel={handleCloseHistoryModal}
        footer={[
          <Button key="close" onClick={handleCloseHistoryModal}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {selectedRecord.deploymentHistory.length > 0 ? (
          <Timeline mode="left">
            {selectedRecord.deploymentHistory.map((record, index) => (
              <Timeline.Item
                key={index}
                color={
                  record.status === 'success'
                    ? 'green'
                    : record.status === 'failed'
                      ? 'red'
                      : 'blue'
                }
                label={formatTime(record.time)}
              >
                <Space direction="vertical">
                  <Text strong>
                    {record.action === 'deployed'
                      ? '部署'
                      : record.action === 'scaled'
                        ? '扩容'
                        : '操作'}
                    {' - '}
                    <Tag color={getEnvironmentColor(record.environment)}>
                      {getEnvironmentLabel(record.environment)}
                    </Tag>
                  </Text>
                  <Text>版本: {record.version}</Text>
                  <Text>
                    状态:
                    <Tag
                      color={
                        record.status === 'success'
                          ? 'success'
                          : record.status === 'failed'
                            ? 'error'
                            : 'processing'
                      }
                      style={{ marginLeft: 8 }}
                    >
                      {record.status === 'success'
                        ? '成功'
                        : record.status === 'failed'
                          ? '失败'
                          : '进行中'}
                    </Tag>
                  </Text>
                </Space>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Empty description="暂无部署历史记录" />
        )}
      </Modal>
    );
  };

  return (
    <div className={styles.tabContent}>
      <Flex vertical gap="middle" className={styles.tabContentInner}>
        {renderModelList()}
        {renderDeployModal()}
        {renderHistoryModal()}
      </Flex>
    </div>
  );
};

export default ModelDeployment;
