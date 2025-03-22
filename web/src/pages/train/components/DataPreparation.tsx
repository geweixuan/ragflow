import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react';
import styles from '../index.less';

interface DataPreparationProps {
  onNext?: () => void;
  loading?: boolean;
  filteredData?: any[];
  showModal?: () => void;
}

// 定义数据集类型
interface DatasetRecord {
  id: string;
  name: string;
  description: string;
  type: string; // 数据类型
  format: string; // 文件格式
  documentCount: number;
  size: string;
  updateTime: string;
  trainingModes: string[]; // 支持的训练模式
}

// 定义训练模式类型
type TrainingMode =
  | 'pretrain' // 预训练
  | 'sft' // 指令监督微调
  | 'reward_model' // 奖励模型训练
  | 'ppo' // PPO训练
  | 'dpo' // DPO训练
  | 'kto' // KTO训练
  | 'orpo' // ORPO训练
  | 'simpo' // SimPO训练
  | 'visual' // 视觉训练
  | 'audio'; // 语音训练

// 定义数据格式类型
type DatasetFormat =
  | 'alpaca' // Alpaca格式
  | 'self_instruct' // Self-instruct格式
  | 'hh-rlhf' // HH-RLHF格式
  | 'glaive_toolcall' // 工具调用格式
  | 'sharegpt' // ShareGPT格式
  | 'llava' // LLaVA格式(多模态)
  | 'qwen_audio' // Qwen-Audio格式(语音)
  | 'custom'; // 自定义格式

// 生成模拟数据
const generateMockData = (): DatasetRecord[] => {
  return [
    {
      id: '1',
      name: 'alpaca-zh',
      description: '中文指令微调数据集',
      type: 'text',
      format: 'alpaca',
      documentCount: 52000,
      size: '128MB',
      updateTime: '2023-12-01',
      trainingModes: ['sft'],
    },
    {
      id: '2',
      name: 'belle-math-zh',
      description: '中文数学指令微调数据集',
      type: 'text',
      format: 'alpaca',
      documentCount: 25000,
      size: '76MB',
      updateTime: '2023-11-15',
      trainingModes: ['sft'],
    },
    {
      id: '3',
      name: 'preference-data',
      description: '模型偏好对比数据集',
      type: 'text',
      format: 'hh-rlhf',
      documentCount: 15000,
      size: '45MB',
      updateTime: '2023-12-10',
      trainingModes: ['dpo', 'kto', 'orpo'],
    },
    {
      id: '4',
      name: 'toolcall-data',
      description: '工具调用指令数据集',
      type: 'text',
      format: 'glaive_toolcall',
      documentCount: 8000,
      size: '32MB',
      updateTime: '2024-01-05',
      trainingModes: ['sft'],
    },
    {
      id: '5',
      name: 'multimodal-data',
      description: '图像理解指令数据集',
      type: 'image',
      format: 'llava',
      documentCount: 12000,
      size: '2.5GB',
      updateTime: '2024-02-20',
      trainingModes: ['visual'],
    },
  ];
};

// 训练模式选项
const trainingModeOptions = [
  { label: '预训练', value: 'pretrain' },
  { label: '指令监督微调', value: 'sft' },
  { label: '奖励模型训练', value: 'reward_model' },
  { label: 'PPO训练', value: 'ppo' },
  { label: 'DPO训练', value: 'dpo' },
  { label: 'KTO训练', value: 'kto' },
  { label: 'ORPO训练', value: 'orpo' },
  { label: 'SimPO训练', value: 'simpo' },
  { label: '视觉训练', value: 'visual' },
  { label: '语音训练', value: 'audio' },
];

// 数据格式选项
const dataFormatOptions = [
  { label: 'Alpaca格式', value: 'alpaca' },
  { label: 'Self-instruct格式', value: 'self_instruct' },
  { label: 'HH-RLHF格式', value: 'hh-rlhf' },
  { label: '工具调用格式', value: 'glaive_toolcall' },
  { label: 'ShareGPT格式', value: 'sharegpt' },
  { label: 'LLaVA格式(多模态)', value: 'llava' },
  { label: 'Qwen-Audio格式(语音)', value: 'qwen_audio' },
  { label: '自定义格式', value: 'custom' },
];

const DataPreparation: React.FC<DataPreparationProps> = ({ onNext }) => {
  // 状态
  const [searchText, setSearchText] = useState<string>('');
  const [datasets, setDatasets] = useState<DatasetRecord[]>(generateMockData());
  const [filteredDatasets, setFilteredDatasets] =
    useState<DatasetRecord[]>(datasets);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [selectedTrainingMode, setSelectedTrainingMode] =
    useState<TrainingMode>('sft');
  const [form] = Form.useForm();

  // 过滤数据集
  useEffect(() => {
    if (searchText) {
      const filtered = datasets.filter(
        (dataset) =>
          dataset.name.toLowerCase().includes(searchText.toLowerCase()) ||
          dataset.description.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredDatasets(filtered);
    } else {
      setFilteredDatasets(datasets);
    }
  }, [searchText, datasets]);

  // 过滤数据集根据选中的训练模式
  useEffect(() => {
    if (selectedTrainingMode) {
      const filtered = datasets.filter((dataset) =>
        dataset.trainingModes.includes(selectedTrainingMode),
      );
      setFilteredDatasets(filtered);
    } else {
      setFilteredDatasets(datasets);
    }
  }, [selectedTrainingMode, datasets]);

  // 选择行
  const rowSelection: TableRowSelection<DatasetRecord> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  // 创建新数据集
  const handleCreateDataset = () => {
    setIsCreateModalVisible(true);
  };

  // 提交表单创建数据集
  const handleSubmitCreate = async () => {
    try {
      const values = await form.validateFields();
      const newDataset: DatasetRecord = {
        id: String(datasets.length + 1),
        name: values.name,
        description: values.description || '',
        type: values.type,
        format: values.format,
        documentCount: 0,
        size: '0MB',
        updateTime: new Date().toISOString().split('T')[0],
        trainingModes: values.trainingModes,
      };

      setDatasets([...datasets, newDataset]);
      setIsCreateModalVisible(false);
      form.resetFields();
      message.success('创建数据集成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除数据集
  const handleDeleteDataset = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该数据集吗？此操作不可恢复。',
      onOk: () => {
        const newDatasets = datasets.filter((dataset) => dataset.id !== id);
        setDatasets(newDatasets);
        message.success('删除数据集成功');
      },
    });
  };

  // 表格列定义
  const columns: ColumnsType<DatasetRecord> = [
    {
      title: '数据集名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <span style={{ fontWeight: 500 }}>{text}</span>
          <br />
          <span style={{ fontSize: '12px', color: '#888' }}>
            {record.description}
          </span>
        </div>
      ),
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeColor =
          type === 'text' ? 'blue' : type === 'image' ? 'green' : 'orange';
        return <Tag color={typeColor}>{type}</Tag>;
      },
    },
    {
      title: '数据格式',
      dataIndex: 'format',
      key: 'format',
      render: (format) => {
        const formatOption = dataFormatOptions.find(
          (option) => option.value === format,
        );
        return <Tag color="purple">{formatOption?.label || format}</Tag>;
      },
    },
    {
      title: '文档数量',
      dataIndex: 'documentCount',
      key: 'documentCount',
      sorter: (a, b) => a.documentCount - b.documentCount,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: (a, b) =>
        new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
    },
    {
      title: '支持的训练模式',
      dataIndex: 'trainingModes',
      key: 'trainingModes',
      render: (modes: string[]) => (
        <>
          {modes.map((mode) => {
            const modeOption = trainingModeOptions.find(
              (option) => option.value === mode,
            );
            return (
              <Tag color="blue" key={mode}>
                {modeOption?.label || mode}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteDataset(record.id)}
            />
          </Tooltip>
          <Tooltip title="更多">
            <Button type="text" icon={<MoreOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabContentInner}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16,
            alignItems: 'center',
          }}
        >
          <Flex align="center" gap="small">
            <Space>
              <span>模式:</span>
              <Select
                value={selectedTrainingMode}
                onChange={(value) => setSelectedTrainingMode(value)}
                style={{ width: 160 }}
                options={trainingModeOptions}
              />
            </Space>
            <Input
              placeholder="搜索数据集..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
          </Flex>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateDataset}
          >
            创建数据集
          </Button>
        </div>

        <div className={styles.tableWrapper}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredDatasets}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            loading={loading}
          />
        </div>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Space>
            <Button
              type="primary"
              onClick={onNext}
              disabled={selectedRowKeys.length === 0}
            >
              下一步
            </Button>
          </Space>
        </div>
      </div>

      {/* 创建数据集弹窗 */}
      <Modal
        title="创建数据集"
        open={isCreateModalVisible}
        onOk={handleSubmitCreate}
        onCancel={() => setIsCreateModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="数据集名称"
            rules={[{ required: true, message: '请输入数据集名称' }]}
          >
            <Input placeholder="请输入数据集名称" />
          </Form.Item>
          <Form.Item name="description" label="数据集描述">
            <Input.TextArea placeholder="请输入数据集描述" rows={3} />
          </Form.Item>
          <Form.Item
            name="type"
            label="数据类型"
            rules={[{ required: true, message: '请选择数据类型' }]}
          >
            <Select placeholder="请选择数据类型">
              <Select.Option value="text">文本数据</Select.Option>
              <Select.Option value="image">图像数据</Select.Option>
              <Select.Option value="audio">语音数据</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="format"
            label="数据格式"
            rules={[{ required: true, message: '请选择数据格式' }]}
          >
            <Select placeholder="请选择数据格式">
              {dataFormatOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="trainingModes"
            label="支持的训练模式"
            rules={[{ required: true, message: '请选择支持的训练模式' }]}
          >
            <Select placeholder="请选择支持的训练模式" mode="multiple">
              {trainingModeOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="upload" label="上传数据文件">
            <Upload.Dragger multiple accept=".json,.jsonl,.csv,.txt">
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传，支持JSON、JSONL、CSV、TXT格式
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataPreparation;
