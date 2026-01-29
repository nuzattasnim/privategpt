import { clients } from '@/lib/https';
import {
  IGetAgentByIdPayload,
  IGetAgentByIdResponse,
  IGetAgentsPayload,
  IGetAgentsResponse,
} from '../types/agent.service.type';

export class AgentService {
  getAgents(payload: IGetAgentsPayload): Promise<IGetAgentsResponse> {
    return clients.post(`/blocksai-api/v1/agents/queries`, JSON.stringify(payload));
  }

  getAgentById(payload: IGetAgentByIdPayload): Promise<IGetAgentByIdResponse> {
    return clients.get(
      `/blocksai-api/v1/agents/query/${payload.id}?project_key=${payload.projectKey}`
    );
  }
}

export const agentService = new AgentService();
