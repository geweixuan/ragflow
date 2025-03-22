import {
  BarChartOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  FileSearchOutlined,
  MessageOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  Input,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import styles from '../index.less';

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

// 模拟的模型数据
const mockModels = [
  {
    id: '1',
    name: 'Deepseek-Coder微调',
    baseModel: 'Deepseek-Coder-6.7B',
    accuracy: 0.89,
    f1Score: 0.87,
    precision: 0.86,
    recall: 0.88,
    testDate: new Date().getTime() - 3600000 * 24,
    status: 'completed',
    lastEvaluatedBy: '张工',
  },
  {
    id: '2',
    name: 'LLAMA2-文本分类',
    baseModel: 'LLAMA2-7b',
    accuracy: 0.92,
    f1Score: 0.91,
    precision: 0.92,
    recall: 0.9,
    testDate: new Date().getTime() - 3600000 * 72,
    status: 'completed',
    lastEvaluatedBy: '李研',
  },
];

// 模型测试示例数据
const testExampleData = [
  {
    id: '1',
    input: '帮我分析一下这个季度的销售数据，找出增长最快的产品类别。',
    expectedOutput:
      '根据您提供的季度销售数据，增长最快的是电子产品类别，环比增长了27%。',
    modelOutput:
      '分析您的季度销售数据后，我发现电子产品类别的增长速度最快，环比增长达到27%。家电类别次之，增长了18%。',
    score: 0.95,
    feedback:
      '模型正确识别了增长最快的类别，并提供了具体数据，还额外给出了次高类别信息。',
  },
  {
    id: '2',
    input: '编写一个Python函数，找出列表中的最大值和最小值。',
    expectedOutput:
      'def find_min_max(numbers):\n    if not numbers:\n        return None, None\n    return min(numbers), max(numbers)',
    modelOutput:
      'def find_min_max(numbers):\n    if len(numbers) == 0:\n        return None, None\n    minimum = maximum = numbers[0]\n    for num in numbers:\n        if num < minimum:\n            minimum = num\n        if num > maximum:\n            maximum = num\n    return minimum, maximum',
    score: 0.85,
    feedback:
      '模型提供了一个有效解决方案，但没有使用内置的min/max函数，实现了手动比较版本。',
  },
  {
    id: '3',
    input: '用中文解释量子计算的基本原理',
    expectedOutput:
      '量子计算是利用量子力学现象如叠加和纠缠来进行信息处理的计算方法。...',
    modelOutput:
      '量子计算是一种利用量子力学特性进行计算的技术。它基于量子比特(qubit)而非传统比特。量子比特可以同时处于多个状态(叠加态)，并且可以通过量子纠缠相互关联。这使得量子计算机在某些问题上比经典计算机具有指数级的速度优势，特别是在密码破解、数据搜索和模拟量子系统方面。',
    score: 0.92,
    feedback:
      '模型很好地解释了量子计算的基本原理，包括叠加和纠缠概念，且语言通俗易懂。',
  },
];

// 指标比较数据列
const metricsColumns = [
  {
    title: '模型',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: '基础模型',
    dataIndex: 'baseModel',
    key: 'baseModel',
  },
  {
    title: '准确率',
    dataIndex: 'accuracy',
    key: 'accuracy',
    sorter: (a: any, b: any) => a.accuracy - b.accuracy,
    render: (val: number) => (
      <Space>
        <Progress
          percent={Math.round(val * 100)}
          size="small"
          status="active"
          strokeColor="#52c41a"
        />
        <span>{(val * 100).toFixed(1)}%</span>
      </Space>
    ),
  },
  {
    title: 'F1分数',
    dataIndex: 'f1Score',
    key: 'f1Score',
    sorter: (a: any, b: any) => a.f1Score - b.f1Score,
    render: (val: number) => (
      <Space>
        <Progress
          percent={Math.round(val * 100)}
          size="small"
          status="active"
        />
        <span>{(val * 100).toFixed(1)}%</span>
      </Space>
    ),
  },
  {
    title: '精准率',
    dataIndex: 'precision',
    key: 'precision',
    sorter: (a: any, b: any) => a.precision - b.precision,
    render: (val: number) => (
      <Space>
        <Progress
          percent={Math.round(val * 100)}
          size="small"
          status="active"
          strokeColor="#faad14"
        />
        <span>{(val * 100).toFixed(1)}%</span>
      </Space>
    ),
  },
  {
    title: '召回率',
    dataIndex: 'recall',
    key: 'recall',
    sorter: (a: any, b: any) => a.recall - b.recall,
    render: (val: number) => (
      <Space>
        <Progress
          percent={Math.round(val * 100)}
          size="small"
          status="active"
          strokeColor="#1890ff"
        />
        <span>{(val * 100).toFixed(1)}%</span>
      </Space>
    ),
  },
  {
    title: '上次评估',
    dataIndex: 'testDate',
    key: 'testDate',
    render: (date: number) => new Date(date).toLocaleDateString(),
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space>
        <Button type="link" icon={<FileSearchOutlined />}>
          详情
        </Button>
        <Button type="link" icon={<CommentOutlined />}>
          测试
        </Button>
      </Space>
    ),
  },
];

const ModelValidation: React.FC = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState('metrics');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  // 过滤后的模型数据
  const filteredModels = searchText
    ? mockModels.filter(
        (model) =>
          model.name.toLowerCase().includes(searchText.toLowerCase()) ||
          model.baseModel.toLowerCase().includes(searchText.toLowerCase()),
      )
    : mockModels;

  // 渲染指标比较视图
  const renderMetricsView = () => (
    <>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索模型"
          style={{ width: 300 }}
          suffix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Space>
          <Select defaultValue="all" style={{ width: 150 }}>
            <Option value="all">所有模型</Option>
            <Option value="llama">LLAMA系列</Option>
            <Option value="qwen">Qwen系列</Option>
            <Option value="deepseek">Deepseek系列</Option>
          </Select>
          <Button type="primary" icon={<BarChartOutlined />}>
            生成报告
          </Button>
        </Space>
      </Flex>

      <Table
        dataSource={filteredModels}
        columns={metricsColumns}
        rowKey="id"
        pagination={false}
        className={styles.metricsTable}
      />
    </>
  );

  // 渲染交互式测试视图
  const renderInteractiveTestView = () => (
    <>
      <Flex style={{ marginBottom: 16 }}>
        <Space>
          <Text>选择模型:</Text>
          <Select
            style={{ width: 250 }}
            placeholder="请选择模型"
            value={selectedModel}
            onChange={setSelectedModel}
          >
            {mockModels.map((model) => (
              <Option key={model.id} value={model.id}>
                {model.name} ({model.baseModel})
              </Option>
            ))}
          </Select>
        </Space>
      </Flex>

      {selectedModel ? (
        <Card className={styles.testInputCard}>
          <Flex vertical gap="middle">
            <div>
              <Text strong>输入测试内容</Text>
              <Input.TextArea
                rows={4}
                placeholder="请输入您想要测试的内容"
                style={{ marginTop: 8 }}
              />
            </div>
            <Button type="primary" icon={<CheckCircleOutlined />}>
              开始验证
            </Button>

            <Divider>测试样例</Divider>

            <Card className={styles.testResultsCard}>
              <Tabs defaultActiveKey="1">
                {testExampleData.map((example, index) => (
                  <TabPane tab={`样例 ${index + 1}`} key={index + 1}>
                    <Flex vertical gap="middle">
                      <div>
                        <Text type="secondary">输入:</Text>
                        <Paragraph
                          style={{
                            marginTop: 4,
                            background: '#f5f5f5',
                            padding: 8,
                            borderRadius: 4,
                          }}
                        >
                          {example.input}
                        </Paragraph>
                      </div>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Text type="secondary">期望输出:</Text>
                          <Paragraph
                            style={{
                              marginTop: 4,
                              background: '#f5f5f5',
                              padding: 8,
                              borderRadius: 4,
                            }}
                          >
                            {example.expectedOutput}
                          </Paragraph>
                        </Col>
                        <Col span={12}>
                          <Text type="secondary">模型输出:</Text>
                          <Paragraph
                            style={{
                              marginTop: 4,
                              background: '#f0f8ff',
                              padding: 8,
                              borderRadius: 4,
                              border: '1px solid #d6e4ff',
                            }}
                          >
                            {example.modelOutput}
                          </Paragraph>
                        </Col>
                      </Row>

                      <Flex gap="large">
                        <div>
                          <Text type="secondary">评分:</Text>
                          <Tag color="green" style={{ marginLeft: 8 }}>
                            {example.score * 10} / 10
                          </Tag>
                        </div>
                        <div>
                          <Text type="secondary">反馈:</Text>
                          <Text style={{ marginLeft: 8 }}>
                            {example.feedback}
                          </Text>
                        </div>
                      </Flex>
                    </Flex>
                  </TabPane>
                ))}
              </Tabs>
            </Card>
          </Flex>
        </Card>
      ) : (
        <Empty
          description="请先选择要测试的模型"
          style={{ marginTop: 40 }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </>
  );

  return (
    <div className={styles.tabContent}>
      <Flex vertical gap="middle" className={styles.tabContentInner}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className={styles.validationTabs}
        >
          <TabPane
            tab={
              <Space>
                <BarChartOutlined />
                指标比较
              </Space>
            }
            key="metrics"
          >
            {renderMetricsView()}
          </TabPane>
          <TabPane
            tab={
              <Space>
                <MessageOutlined />
                交互测试
              </Space>
            }
            key="interactive"
          >
            {renderInteractiveTestView()}
          </TabPane>
        </Tabs>
      </Flex>
    </div>
  );
};

export default ModelValidation;
