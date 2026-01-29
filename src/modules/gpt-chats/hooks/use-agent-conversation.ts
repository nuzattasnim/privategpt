import { useQuery } from '@tanstack/react-query';
import { IAgentConversationListPayload } from '../types/agent-conversation.type';
import { agentConversationService } from '../services/agent-conversation.service';

export const useGetAgentConversationList = (payload: IAgentConversationListPayload) => {
  return useQuery({
    queryKey: ['agent-conversation-list', payload],
    queryFn: () => agentConversationService.getAgentConversationList(payload),
    enabled: !!payload.agent_id && !!payload.project_key,
  });
};
