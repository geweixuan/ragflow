import {
  Form as AntdForm,
  Col,
  Divider,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import React from 'react';

const { Option } = Select;
const { Text } = Typography;

export const Form: React.FC = () => {
  return (
    <AntdForm
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
          <AntdForm.Item
            name="trainName"
            label="训练名称"
            rules={[{ required: true, message: '请输入训练名称' }]}
          >
            <Input placeholder="请输入训练任务名称" />
          </AntdForm.Item>
        </Col>
        <Col span={12}>
          <AntdForm.Item
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
          </AntdForm.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <AntdForm.Item
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
              <Option value="dataset4" label="知识库QA">
                <Space>
                  <Text>知识库QA</Text>
                  <Text type="secondary">(2850文档)</Text>
                </Space>
              </Option>
            </Select>
          </AntdForm.Item>
        </Col>
        <Col span={12}>
          <AntdForm.Item
            name="gpu"
            label="GPU数量"
            rules={[{ required: true, message: '请选择GPU数量' }]}
          >
            <Radio.Group>
              <Radio value={1}>1 x A100</Radio>
              <Radio value={2}>2 x A100</Radio>
              <Radio value={4}>4 x A100</Radio>
            </Radio.Group>
          </AntdForm.Item>
        </Col>
      </Row>

      <Divider orientation="left">高级参数</Divider>

      <Row gutter={24}>
        <Col span={8}>
          <AntdForm.Item name="epochs" label="训练轮次">
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </AntdForm.Item>
        </Col>
        <Col span={8}>
          <AntdForm.Item name="batchSize" label="Batch Size">
            <InputNumber min={1} max={64} style={{ width: '100%' }} />
          </AntdForm.Item>
        </Col>
        <Col span={8}>
          <AntdForm.Item name="learningRate" label="学习率">
            <InputNumber
              min={0.000001}
              max={0.1}
              step={0.00001}
              style={{ width: '100%' }}
            />
          </AntdForm.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <AntdForm.Item name="maxLength" label="最大长度">
            <InputNumber
              min={128}
              max={2048}
              step={64}
              style={{ width: '100%' }}
            />
          </AntdForm.Item>
        </Col>
        <Col span={8}>
          <AntdForm.Item name="saveSteps" label="保存步长">
            <InputNumber min={100} style={{ width: '100%' }} />
          </AntdForm.Item>
        </Col>
        <Col span={8}>
          <AntdForm.Item name="evalSteps" label="评估步长">
            <InputNumber min={50} style={{ width: '100%' }} />
          </AntdForm.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <AntdForm.Item
            name="fp16"
            label="FP16混合精度"
            valuePropName="checked"
          >
            <Switch />
          </AntdForm.Item>
        </Col>
      </Row>
    </AntdForm>
  );
};

export default Form;
