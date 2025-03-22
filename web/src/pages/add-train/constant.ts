import { KnowledgeRouteKey } from '@/constants/knowledge';

export const routeMap = {
  [KnowledgeRouteKey.Dataset]: 'Dataset',
  [KnowledgeRouteKey.Testing]: 'Retrieval testing',
  [KnowledgeRouteKey.Configuration]: 'Configuration',
};

export enum TrainDatasetRouteKey {
  Chunk = 'chunk',
  File = 'file',
}

export const datasetRouteMap = {
  [TrainDatasetRouteKey.Chunk]: 'Chunk',
  [TrainDatasetRouteKey.File]: 'File Upload',
};

export * from '@/constants/knowledge';

export const TagRenameId = 'tagRename';
