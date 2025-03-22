import { Form, Input, Modal } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  loading?: boolean;
  visible: boolean;
  hideModal: () => void;
  onOk: (name: string) => Promise<void>;
}

interface FormValueItem {
  name: string;
}

const TrainCreatingModal = ({
  visible,
  hideModal,
  onOk,
  loading = false,
}: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'trainList' });
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = useCallback(async () => {
    if (loading) {
      return;
    }
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      await onOk(values.name);
      form.resetFields();
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmLoading(false);
    }
  }, [form, loading, onOk]);

  const afterClose = useCallback(() => {
    form.resetFields();
  }, [form]);

  return (
    <Modal
      title={t('createTrainBase')}
      open={visible}
      destroyOnClose
      onCancel={hideModal}
      onOk={handleOk}
      afterClose={afterClose}
      confirmLoading={confirmLoading || loading}
      centered
    >
      <Form
        initialValues={{}}
        form={form}
        preserve={false}
        layout="vertical"
        name="createForm"
      >
        <Form.Item
          name="name"
          label={t('name')}
          rules={[{ required: true, message: t('namePlaceholder') }]}
        >
          <Input placeholder={t('namePlaceholder')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TrainCreatingModal;
