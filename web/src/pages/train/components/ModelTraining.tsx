import {
  BarChartOutlined,
  EyeOutlined,
  PlusOutlined,
  RocketOutlined,
  SearchOutlined,
  SettingOutlined,
  SyncOutlined,
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
  InputNumber,
  List,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import styles from '../index.less';

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

// 模拟的模型数据
const mockModels = [
  {
    id: '1',
    name: 'Deepseek-Coder微调',
    baseModel: 'Deepseek-Coder-6.7B',
    status: 'training', // training, completed, failed
    progress: 42,
    startTime: new Date().getTime() - 3600000 * 5,
    estimatedTime: '约2小时',
    datasets: ['Python代码数据集', 'Java代码数据集'],
    creator: '张工',
    gpu: 'A100 x 2',
  },
  {
    id: '2',
    name: 'LLAMA2-文本分类',
    baseModel: 'LLAMA2-7b',
    status: 'completed',
    progress: 100,
    startTime: new Date().getTime() - 3600000 * 48,
    completedTime: new Date().getTime() - 3600000 * 36,
    datasets: ['电商评论数据集'],
    creator: '李研',
    gpu: 'A100 x 1',
  },
  {
    id: '3',
    name: 'Qwen-多语言',
    baseModel: 'Qwen-7B',
    status: 'failed',
    progress: 28,
    startTime: new Date().getTime() - 3600000 * 12,
    failedTime: new Date().getTime() - 3600000 * 10,
    errorMessage: '训练中断：内存不足',
    datasets: ['中英平行语料', '日语翻译数据'],
    creator: '王助理',
    gpu: 'A100 x 1',
  },
];

const ModelTraining: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'list'>('list');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 开始训练处理函数
  const handleStartTraining = () => {
    form.validateFields().then((values) => {
      console.log('训练配置:', values);
      setLoading(true);

      // 模拟API调用
      setTimeout(() => {
        setLoading(false);
        setActiveTab('list');
      }, 1500);
    });
  };

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    if (status === 'training') {
      return (
        <Badge status="processing" text={<Text type="warning">训练中</Text>} />
      );
    } else if (status === 'completed') {
      return <Badge status="success" text="已完成" />;
    } else {
      return <Badge status="error" text="失败" />;
    }
  };

  // 渲染时间信息
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // 渲染训练配置表单
  const renderConfigForm = () => (
    <Card title="模型训练配置" className={styles.configCard}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          baseModel: 'llama2-7b',
          epochs: 3,
          batchSize: 8,
          learningRate: 0.00002,
          maxLength: 512,
          gpu: 1,
          saveSteps: 500,
          evalSteps: 100,
          fp16: true,
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="trainName"
              label="训练名称"
              rules={[{ required: true, message: '请输入训练名称' }]}
            >
              <Input placeholder="请输入训练任务名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="baseModel"
              label="基础模型"
              rules={[{ required: true, message: '请选择基础模型' }]}
            >
              <Select placeholder="请选择基础模型">
                <Option value="llama2-7b">LLaMA2-7B</Option>
                <Option value="llama2-13b">LLaMA2-13B</Option>
                <Option value="qwen-7b">Qwen-7B</Option>
                <Option value="baichuan2-7b">Baichuan2-7B</Option>
                <Option value="deepseek-7b">Deepseek-7B</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dataset"
              label="训练数据集"
              rules={[{ required: true, message: '请选择训练数据集' }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择训练数据集"
                optionLabelProp="label"
              >
                <Option value="dataset1" label="Python代码数据集">
                  <Space>
                    <Text>Python代码数据集</Text>
                    <Text type="secondary">(1280文档)</Text>
                  </Space>
                </Option>
                <Option value="dataset2" label="电商评论数据集">
                  <Space>
                    <Text>电商评论数据集</Text>
                    <Text type="secondary">(3500文档)</Text>
                  </Space>
                </Option>
                <Option value="dataset3" label="中英平行语料">
                  <Space>
                    <Text>中英平行语料</Text>
                    <Text type="secondary">(5200文档)</Text>
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gpu"
              label="GPU数量"
              rules={[{ required: true, message: '请选择GPU数量' }]}
            >
              <Radio.Group>
                <Radio value={1}>1 x A100</Radio>
                <Radio value={2}>2 x A100</Radio>
                <Radio value={4}>4 x A100</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">高级参数</Divider>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="epochs" label="训练轮次">
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="batchSize" label="Batch Size">
              <InputNumber min={1} max={64} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="learningRate" label="学习率">
              <InputNumber
                min={0.000001}
                max={0.1}
                step={0.00001}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="maxLength" label="最大长度">
              <InputNumber
                min={128}
                max={2048}
                step={64}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="saveSteps" label="保存步长">
              <InputNumber min={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="evalSteps" label="评估步长">
              <InputNumber min={50} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="fp16" label="FP16混合精度" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button
              type="primary"
              onClick={handleStartTraining}
              loading={loading}
            >
              开始训练
            </Button>
            <Button onClick={() => setActiveTab('list')}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );

  // 渲染模型列表
  const renderModelList = () => (
    <>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Input
          style={{ width: 300 }}
          placeholder="搜索模型"
          suffix={<SearchOutlined />}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setActiveTab('config')}
        >
          创建训练
        </Button>
      </Flex>

      {mockModels.length > 0 ? (
        <List
          dataSource={mockModels}
          renderItem={(item) => (
            <Card
              className={styles.modelCard}
              title={
                <Flex justify="space-between" align="center">
                  <Space>
                    <RocketOutlined />
                    <Text strong>{item.name}</Text>
                    {renderStatusTag(item.status)}
                  </Space>
                  <Space>
                    <Tooltip title="查看详情">
                      <Button type="text" icon={<EyeOutlined />} />
                    </Tooltip>
                    {item.status === 'training' && (
                      <Tooltip title="停止训练">
                        <Button type="text" danger icon={<SyncOutlined />} />
                      </Tooltip>
                    )}
                    {item.status === 'completed' && (
                      <Tooltip title="查看指标">
                        <Button type="text" icon={<BarChartOutlined />} />
                      </Tooltip>
                    )}
                    <Tooltip title="配置">
                      <Button type="text" icon={<SettingOutlined />} />
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
                  <Text style={{ width: 100 }}>训练数据集:</Text>
                  <Space wrap>
                    {item.datasets.map((ds, index) => (
                      <Tag key={index} color="blue">
                        {ds}
                      </Tag>
                    ))}
                  </Space>
                </Flex>
                <Flex>
                  <Text style={{ width: 100 }}>训练资源:</Text>
                  <Tag color="purple">{item.gpu}</Tag>
                </Flex>
                <Flex>
                  <Text style={{ width: 100 }}>开始时间:</Text>
                  <Text>{formatTime(item.startTime)}</Text>
                </Flex>
                {item.status === 'training' && (
                  <>
                    <Flex>
                      <Text style={{ width: 100 }}>预计完成:</Text>
                      <Text>{item.estimatedTime}</Text>
                    </Flex>
                    <Flex style={{ marginTop: 8 }}>
                      <Progress percent={item.progress} status="active" />
                    </Flex>
                  </>
                )}
                {item.status === 'completed' && (
                  <Flex>
                    <Text style={{ width: 100 }}>完成时间:</Text>
                    <Text>{formatTime(item.completedTime!)}</Text>
                  </Flex>
                )}
                {item.status === 'failed' && (
                  <>
                    <Flex>
                      <Text style={{ width: 100 }}>失败时间:</Text>
                      <Text>{formatTime(item.failedTime!)}</Text>
                    </Flex>
                    <Flex>
                      <Text style={{ width: 100 }}>错误信息:</Text>
                      <Text type="danger">{item.errorMessage}</Text>
                    </Flex>
                  </>
                )}
              </Flex>
            </Card>
          )}
        />
      ) : (
        <Empty
          description="暂无训练中的模型"
          style={{ marginTop: '40px' }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </>
  );

  return (
    <div className={styles.tabContent}>
      <Flex vertical gap="middle" className={styles.tabContentInner}>
        {activeTab === 'config' ? renderConfigForm() : renderModelList()}
      </Flex>
    </div>
  );
};

export default ModelTraining;
