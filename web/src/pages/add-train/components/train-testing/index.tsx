import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Input, List, Spin, Typography } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const { Text, Title } = Typography;

// 模拟数据
const mockTestResults = [
  {
    id: 'test-1',
    query: '什么是深度学习？',
    result:
      '深度学习是机器学习的一个分支，使用多层神经网络来模拟人脑的学习过程。它能够自动从大量数据中学习特征，无需人工特征工程。',
    score: 0.92,
    timestamp: '2023-03-15 14:23:45',
    sourceChunks: [
      {
        id: 'chunk-3',
        content:
          '深度学习是机器学习的一个分支，使用多层神经网络来模拟人脑的学习过程。',
      },
      {
        id: 'chunk-5',
        content:
          '与传统机器学习不同，深度学习能够自动从大量数据中学习特征，无需人工特征工程。',
      },
    ],
  },
  {
    id: 'test-2',
    query: '强化学习的应用场景有哪些？',
    result:
      '强化学习的应用场景包括：游戏AI（如AlphaGo）、机器人控制、自动驾驶、推荐系统、资源分配、金融交易等领域。',
    score: 0.85,
    timestamp: '2023-03-16 09:12:30',
    sourceChunks: [
      {
        id: 'chunk-7',
        content:
          '强化学习的应用场景包括：游戏AI（如AlphaGo）、机器人控制和自动驾驶。',
      },
      {
        id: 'chunk-9',
        content: '强化学习在推荐系统、资源分配和金融交易等领域也有广泛应用。',
      },
    ],
  },
  {
    id: 'test-3',
    query: '如何提高模型的泛化能力？',
    result:
      '提高模型泛化能力的方法包括：使用更多样化的训练数据、数据增强、正则化技术（如L1/L2正则化、Dropout）、交叉验证、集成学习方法等。',
    score: 0.78,
    timestamp: '2023-03-17 16:45:22',
    sourceChunks: [
      {
        id: 'chunk-12',
        content:
          '提高模型泛化能力的方法包括：使用更多样化的训练数据、数据增强和正则化技术。',
      },
      {
        id: 'chunk-15',
        content:
          '常用的正则化技术包括L1/L2正则化、Dropout等，它们能有效防止过拟合。',
      },
      {
        id: 'chunk-17',
        content: '交叉验证和集成学习方法也能有效提高模型的泛化能力。',
      },
    ],
  },
];

const TrainTesting = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(mockTestResults);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const handleTest = () => {
    if (!query.trim()) return;

    setLoading(true);

    // 模拟API调用延迟
    setTimeout(() => {
      const newResult = {
        id: `test-${testResults.length + 1}`,
        query,
        result: `这是对"${query}"的模拟回答。在实际应用中，这里会显示模型基于训练数据生成的回答。`,
        score: Math.random() * 0.3 + 0.7, // 随机生成0.7-1.0之间的分数
        timestamp: new Date().toLocaleString(),
        sourceChunks: [
          {
            id: `chunk-${Math.floor(Math.random() * 20)}`,
            content: `这是第一个与"${query}"相关的数据块内容。`,
          },
          {
            id: `chunk-${Math.floor(Math.random() * 20)}`,
            content: `这是第二个与"${query}"相关的数据块内容。`,
          },
        ],
      };

      setTestResults([newResult, ...testResults]);
      setSelectedResult(newResult);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className={styles.testingContainer}>
      <div className={styles.querySection}>
        <Title level={4}>检索测试</Title>
        <Text type="secondary">输入问题，测试模型基于训练数据的回答能力</Text>
        <div className={styles.queryInput}>
          <Input.TextArea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="请输入测试问题..."
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            loading={loading}
            onClick={handleTest}
            disabled={!query.trim()}
          >
            测试
          </Button>
        </div>
      </div>

      <Divider />

      <div className={styles.resultsSection}>
        <div className={styles.historyList}>
          <Title level={5}>历史测试记录</Title>
          <List
            dataSource={testResults}
            renderItem={(item) => (
              <List.Item
                className={styles.historyItem}
                onClick={() => setSelectedResult(item)}
              >
                <div
                  className={
                    selectedResult?.id === item.id ? styles.selectedItem : ''
                  }
                >
                  <div className={styles.historyQuery}>{item.query}</div>
                  <div className={styles.historyMeta}>
                    <span>得分: {item.score.toFixed(2)}</span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>

        <div className={styles.resultDetail}>
          {selectedResult ? (
            <>
              <Card title="测试结果" className={styles.resultCard}>
                <div className={styles.queryText}>
                  <strong>问题:</strong> {selectedResult.query}
                </div>
                <div className={styles.answerText}>
                  <strong>回答:</strong> {selectedResult.result}
                </div>
                <div className={styles.scoreText}>
                  <strong>相关度得分:</strong> {selectedResult.score.toFixed(2)}
                </div>
              </Card>

              <Card title="引用数据块" className={styles.chunksCard}>
                <List
                  dataSource={selectedResult.sourceChunks}
                  renderItem={(chunk: any) => (
                    <List.Item>
                      <div className={styles.chunkItem}>
                        <div className={styles.chunkId}>ID: {chunk.id}</div>
                        <div className={styles.chunkContent}>
                          {chunk.content}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </>
          ) : (
            <div className={styles.noSelection}>
              <Text type="secondary">选择一条历史记录查看详情</Text>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className={styles.loadingOverlay}>
          <Spin size="large" tip="正在生成回答..." />
        </div>
      )}
    </div>
  );
};

export default TrainTesting;
