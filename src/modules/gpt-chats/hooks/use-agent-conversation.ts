import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { IAgentConversationListPayload } from '../types/agent-conversation.type';
import { agentConversationService } from '../services/agent-conversation.service';

export const useGetAgentConversationList = (payload: IAgentConversationListPayload) => {
  return useQuery({
    queryKey: ['agent-conversation-list', payload],
    queryFn: () => agentConversationService.getAgentConversationList(payload),
    enabled: !!payload.agent_id && !!payload.project_key,
  });
};

export const useGetAgentConversationListInfinite = (
  payload: Omit<IAgentConversationListPayload, 'offset'>
) => {
  return useInfiniteQuery({
    queryKey: ['agent-conversation-list-infinite', payload],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await agentConversationService.getAgentConversationList({
        ...payload,
        offset: pageParam,
      });
      return result;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, page) => sum + page.sessions.length, 0);

      if (totalFetched >= lastPage.total_count || lastPage.sessions.length === 0) {
        return undefined;
      }

      return totalFetched;
    },
    enabled: !!payload.agent_id && !!payload.project_key,
  });
};
