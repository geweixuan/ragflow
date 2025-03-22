import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Divider, Input, Space, Switch, Table, Typography } from 'antd';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.less';

const { Text } = Typography;

// 模拟数据
const mockDocuments = Array.from({ length: 10 }).map((_, index) => ({
  id: `doc-${index}`,
  name: `训练文档${index}.${index % 2 === 0 ? 'pdf' : 'txt'}`,
  chunk_num: Math.floor(Math.random() * 20) + 1,
  create_time: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
  parser_id: `parser-${index % 3}`,
  status: index % 3 === 0 ? '0' : '1',
  run: Math.random() > 0.7 ? 'parsing' : 'success',
  thumbnail: null,
}));

const mockParserList = [
  { value: 'parser-0', label: '按段落切分' },
  { value: 'parser-1', label: '按句子切分' },
  { value: 'parser-2', label: '按自定义长度切分' },
];

const TrainFile = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchString, setSearchString] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const setDocumentStatus = useCallback(
    ({ status, documentId }: { status: boolean; documentId: string }) => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, status: status ? '1' : '0' } : doc,
        ),
      );
    },
    [],
  );

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as string[]);
    },
  };

  const handleRename = (record: any) => {
    const newName = prompt('请输入新名称', record.name);
    if (newName) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === record.id ? { ...doc, name: newName } : doc,
        ),
      );
    }
  };

  const handleDelete = (record: any) => {
    if (confirm(`确定要删除文档 ${record.name} 吗？`)) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== record.id));
    }
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      render: (text: any, record: any) => (
        <div className={styles.nameCell}>
          <Text ellipsis={{ tooltip: text }} className={styles.nameText}>
            {text}
          </Text>
        </div>
      ),
    },
    {
      title: '块数',
      dataIndex: 'chunk_num',
      key: 'chunk_num',
    },
    {
      title: '上传日期',
      dataIndex: 'create_time',
      key: 'create_time',
      render(value: string) {
        return formatDate(value);
      },
    },
    {
      title: '切分方式',
      dataIndex: 'parser_id',
      key: 'parser_id',
      render: (text: string) => {
        return mockParserList.find((x) => x.value === text)?.label;
      },
    },
    {
      title: '启用',
      key: 'status',
      dataIndex: 'status',
      render: (_: any, record: any) => (
        <>
          <Switch
            checked={record.status === '1'}
            onChange={(e) => {
              setDocumentStatus({ status: e, documentId: record.id });
            }}
          />
        </>
      ),
    },
    {
      title: '解析状态',
      dataIndex: 'run',
      key: 'run',
      render: (text: string) => {
        return (
          <span
            className={text === 'success' ? styles.success : styles.parsing}
          >
            {text === 'success' ? '解析成功' : '解析中...'}
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button size="small" onClick={() => handleRename(record)}>
            重命名
          </Button>
          <Button size="small" onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const finalColumns = columns.map((x) => ({
    ...x,
    className: `${styles.column}`,
  }));

  const handleAddDocument = () => {
    const newId = `doc-${documents.length}`;
    const newDoc = {
      id: newId,
      name: `新训练文档.txt`,
      chunk_num: 0,
      create_time: new Date().toISOString().split('T')[0],
      parser_id: 'parser-0',
      status: '1',
      run: 'success',
      thumbnail: null,
    };

    setDocuments([...documents, newDoc]);
  };

  const handleUploadDocument = () => {
    alert('这是一个模拟的文件上传功能，实际上传需要调用接口');
  };

  const filteredData = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchString.toLowerCase()),
  );

  return (
    <div className={styles.datasetWrapper}>
      <h3>训练数据集</h3>
      <p>在此处管理您的训练文件数据集</p>
      <Divider />
      <div className={styles.toolbar}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddDocument}
          >
            新建文档
          </Button>
          <Button icon={<UploadOutlined />} onClick={handleUploadDocument}>
            上传文件
          </Button>
        </Space>
        <Input
          placeholder="搜索文件名"
          value={searchString}
          onChange={handleInputChange}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
      </div>
      <Table
        rowKey="id"
        columns={finalColumns}
        dataSource={filteredData}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            if (pageSize) setPageSize(pageSize);
          },
        }}
        rowSelection={rowSelection}
        className={styles.documentTable}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default TrainFile;
