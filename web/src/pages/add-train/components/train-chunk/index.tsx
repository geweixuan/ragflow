import { Divider, Flex, Pagination, Space, Spin, message } from 'antd';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.less';

// 模拟数据
const mockChunks = Array.from({ length: 10 }).map((_, index) => ({
  chunk_id: `chunk-${index}`,
  content: `这是训练数据切块的内容示例 ${index}。这里包含了一些示例文本，可以用于训练模型。`,
  available: index % 3 === 0 ? 0 : 1,
  doc_id: 'mock-doc-1',
  metadata: {
    page: Math.floor(index / 3) + 1,
  },
}));

const mockDocumentInfo = {
  type: 'text',
  parser_id: 'mock-parser-1',
  doc_id: 'mock-doc-1',
  name: '示例文档.txt',
};

const TrainChunk = () => {
  const [selectedChunkIds, setSelectedChunkIds] = useState<string[]>([]);
  const [data, setData] = useState(mockChunks);
  const [loading, setLoading] = useState(false);
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(null);
  const [available, setAvailable] = useState<number | undefined>(undefined);
  const [searchString, setSearchString] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { t } = useTranslation();
  const documentInfo = mockDocumentInfo;
  const isPdf = documentInfo?.type === 'pdf';
  const total = mockChunks.length;

  const handleChunkCardClick = useCallback(
    (chunkId: string) => {
      setSelectedChunkId(chunkId === selectedChunkId ? null : chunkId);
    },
    [selectedChunkId],
  );

  const onPaginationChange = (page: number, size: number) => {
    setSelectedChunkIds([]);
    setCurrentPage(page);
    setPageSize(size);
  };

  const selectAllChunk = useCallback(
    (checked: boolean) => {
      setSelectedChunkIds(checked ? data.map((x) => x.chunk_id) : []);
    },
    [data],
  );

  const handleSingleCheckboxClick = useCallback(
    (chunkId: string, checked: boolean) => {
      setSelectedChunkIds((previousIds) => {
        const idx = previousIds.findIndex((x) => x === chunkId);
        const nextIds = [...previousIds];
        if (checked && idx === -1) {
          nextIds.push(chunkId);
        } else if (!checked && idx !== -1) {
          nextIds.splice(idx, 1);
        }
        return nextIds;
      });
    },
    [],
  );

  const showSelectedChunkWarning = useCallback(() => {
    message.warning(t('message.pleaseSelectChunk') || '请选择数据块');
  }, [t]);

  const handleRemoveChunk = useCallback(() => {
    if (selectedChunkIds.length > 0) {
      setData((prev) =>
        prev.filter((chunk) => !selectedChunkIds.includes(chunk.chunk_id)),
      );
      setSelectedChunkIds([]);
      message.success('删除成功');
    } else {
      showSelectedChunkWarning();
    }
  }, [selectedChunkIds, showSelectedChunkWarning]);

  const handleSwitchChunk = useCallback(
    (available?: number, chunkIds?: string[]) => {
      let ids = chunkIds || selectedChunkIds;
      if (!chunkIds && selectedChunkIds.length === 0) {
        showSelectedChunkWarning();
        return;
      }

      setData((prev) =>
        prev.map((chunk) => {
          if (ids?.includes(chunk.chunk_id)) {
            return {
              ...chunk,
              available:
                available !== undefined
                  ? available
                  : chunk.available === 1
                    ? 0
                    : 1,
            };
          }
          return chunk;
        }),
      );

      message.success('修改成功');
    },
    [selectedChunkIds, showSelectedChunkWarning],
  );

  const handleInputChange = (value: string) => {
    setSearchString(value);
  };

  const handleSetAvailable = (value: number | undefined) => {
    setAvailable(value);
  };

  const filteredData = data.filter(
    (item) =>
      (available === undefined || item.available === available) &&
      (searchString === '' || item.content.includes(searchString)),
  );

  return (
    <>
      <div className={styles.chunkPage}>
        <div className={styles.toolbar}>
          <div>
            <input
              type="checkbox"
              checked={selectedChunkIds.length === filteredData.length}
              onChange={(e) => selectAllChunk(e.target.checked)}
            />
            <button onClick={() => handleRemoveChunk()}>删除</button>
            <button onClick={() => handleSwitchChunk()}>切换可用性</button>
            <input
              type="text"
              value={searchString}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="搜索内容"
            />
            <select
              value={available === undefined ? '' : available.toString()}
              onChange={(e) =>
                handleSetAvailable(
                  e.target.value === '' ? undefined : parseInt(e.target.value),
                )
              }
            >
              <option value="">全部</option>
              <option value="1">可用</option>
              <option value="0">不可用</option>
            </select>
          </div>
        </div>
        <Divider />
        <Flex flex={1} gap={'middle'}>
          <Flex vertical className={styles.pageWrapper}>
            <Spin spinning={loading} className={styles.spin} size="large">
              <div className={styles.pageContent}>
                <Space
                  direction="vertical"
                  size={'middle'}
                  className={styles.chunkContainer}
                >
                  {filteredData.map((item) => (
                    <div
                      key={item.chunk_id}
                      className={classNames(styles.chunkCard, {
                        [styles.selected]: item.chunk_id === selectedChunkId,
                      })}
                    >
                      <div className={styles.chunkHeader}>
                        <input
                          type="checkbox"
                          checked={selectedChunkIds.includes(item.chunk_id)}
                          onChange={(e) =>
                            handleSingleCheckboxClick(
                              item.chunk_id,
                              e.target.checked,
                            )
                          }
                        />
                        <span>块ID: {item.chunk_id}</span>
                        <span
                          className={
                            item.available
                              ? styles.available
                              : styles.unavailable
                          }
                        >
                          {item.available ? '可用' : '不可用'}
                        </span>
                      </div>
                      <div
                        className={styles.chunkContent}
                        onClick={() => handleChunkCardClick(item.chunk_id)}
                      >
                        {item.content}
                      </div>
                    </div>
                  ))}
                </Space>
              </div>
            </Spin>
            <div className={styles.pageFooter}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                size={'small'}
                onChange={onPaginationChange}
              />
            </div>
          </Flex>
        </Flex>
      </div>
    </>
  );
};

export default TrainChunk;
