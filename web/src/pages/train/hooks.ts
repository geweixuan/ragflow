import { KnowledgeRouteKey } from '@/constants/knowledge';
import { useSetModalState } from '@/hooks/common-hooks';
import { useCreateKnowledge } from '@/hooks/knowledge-hooks';
import { useCallback, useState } from 'react';
import { useNavigate } from 'umi';

export const useSearchTrain = () => {
  const [searchString, setSearchString] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };
  return {
    searchString,
    handleInputChange,
  };
};

export const useSaveTrain = () => {
  const { visible: visible, hideModal, showModal } = useSetModalState();
  const { loading, createKnowledge } = useCreateKnowledge();
  const navigate = useNavigate();

  const onCreateOk = useCallback(
    async (name: string) => {
      const ret = await createKnowledge({
        name,
      });

      if (ret?.code === 0) {
        hideModal();
        navigate(
          `/train/details/${KnowledgeRouteKey.Configuration}?id=${ret.data.kb_id}`,
        );
      }
    },
    [createKnowledge, hideModal, navigate],
  );

  return {
    loading,
    onCreateOk,
    visible,
    hideModal,
    showModal,
  };
};
