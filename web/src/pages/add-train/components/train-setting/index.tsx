import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Slider,
  Switch,
  Typography,
  Upload,
  message,
} from 'antd';
import { useState } from 'react';
import styles from './index.less';

const { Option } = Select;
const { Text, Title } = Typography;

// 模拟数据
const mockSettings = {
  name: '训练知识库示例',
  description: '这是一个用于训练的示例知识库，包含了多种类型的训练数据。',
  embeddingModel: 'text-embedding-ada-002',
  chunkSize: 500,
  chunkOverlap: 50,
  topK: 5,
  minScore: 0.7,
  enableRerank: true,
  rerankModel: 'bge-reranker-base',
  status: 'active',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
};

const TrainSetting = () => {
  const [form] = Form.useForm();
  const [settings, setSettings] = useState(mockSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = (values: any) => {
    setSaving(true);

    // 模拟API调用延迟
    setTimeout(() => {
      setSettings({ ...settings, ...values });
      setSaving(false);
      message.success('设置保存成功');
    }, 1000);
  };

  return (
    <div className={styles.settingContainer}>
      <Title level={4}>训练配置</Title>
      <Text type="secondary">配置训练知识库的参数和设置</Text>

      <Divider />

      <div className={styles.formContainer}>
        <Form
          form={form}
          layout="vertical"
          initialValues={settings}
          onFinish={handleSave}
        >
          <Card title="基本信息" className={styles.settingCard}>
            <Form.Item
              name="name"
              label="知识库名称"
              rules={[{ required: true, message: '请输入知识库名称' }]}
            >
              <Input placeholder="请输入知识库名称" />
            </Form.Item>

            <Form.Item name="description" label="知识库描述">
              <Input.TextArea placeholder="请输入知识库描述" rows={3} />
            </Form.Item>

            <Form.Item name="avatar" label="知识库图标">
              <div className={styles.avatarUpload}>
                {settings.avatar && (
                  <img
                    src={settings.avatar}
                    className={styles.avatarPreview}
                    alt="avatar"
                  />
                )}
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    // 这里仅为模拟，实际应该上传文件并获取URL
                    message.info('上传功能在此处仅作为演示');
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>上传图标</Button>
                </Upload>
              </div>
            </Form.Item>

            <Form.Item name="status" label="知识库状态">
              <Select placeholder="请选择知识库状态">
                <Option value="active">激活</Option>
                <Option value="inactive">未激活</Option>
                <Option value="building">构建中</Option>
              </Select>
            </Form.Item>
          </Card>

          <Card title="向量检索配置" className={styles.settingCard}>
            <Form.Item
              name="embeddingModel"
              label="嵌入模型"
              rules={[{ required: true, message: '请选择嵌入模型' }]}
            >
              <Select placeholder="请选择嵌入模型">
                <Option value="text-embedding-ada-002">
                  text-embedding-ada-002
                </Option>
                <Option value="text-embedding-3-small">
                  text-embedding-3-small
                </Option>
                <Option value="text-embedding-3-large">
                  text-embedding-3-large
                </Option>
                <Option value="bge-base-zh-v1.5">bge-base-zh-v1.5</Option>
                <Option value="bge-large-zh-v1.5">bge-large-zh-v1.5</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="chunkSize"
              label="切块大小"
              rules={[{ required: true, message: '请设置切块大小' }]}
            >
              <Slider min={100} max={2000} step={50} />
            </Form.Item>

            <Form.Item
              name="chunkOverlap"
              label="切块重叠"
              rules={[{ required: true, message: '请设置切块重叠' }]}
            >
              <Slider min={0} max={200} step={10} />
            </Form.Item>
          </Card>

          <Card title="检索设置" className={styles.settingCard}>
            <Form.Item
              name="topK"
              label="检索结果数量 (Top K)"
              rules={[{ required: true, message: '请设置检索结果数量' }]}
            >
              <Slider min={1} max={20} step={1} />
            </Form.Item>

            <Form.Item
              name="minScore"
              label="最小相似度分数"
              rules={[{ required: true, message: '请设置最小相似度分数' }]}
            >
              <Slider min={0} max={1} step={0.05} />
            </Form.Item>

            <Form.Item
              name="enableRerank"
              label="启用重排序"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="rerankModel"
              label="重排序模型"
              rules={[
                {
                  required: true,
                  message: '请选择重排序模型',
                },
              ]}
            >
              <Select placeholder="请选择重排序模型">
                <Option value="bge-reranker-base">bge-reranker-base</Option>
                <Option value="bge-reranker-large">bge-reranker-large</Option>
                <Option value="cohere-rerank">cohere-rerank</Option>
              </Select>
            </Form.Item>
          </Card>

          <div className={styles.formActions}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
            >
              保存设置
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default TrainSetting;
