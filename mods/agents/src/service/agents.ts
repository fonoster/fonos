/*
 * Copyright (C) 2021 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonos
 *
 * This file is part of Project Fonos
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import grpc from "@grpc/grpc-js";
import {
  Agent,
  ListAgentsRequest,
  ListAgentsResponse,
  GetAgentRequest,
  CreateAgentRequest,
  UpdateAgentRequest,
  DeleteAgentRequest
} from "./protos/agents_pb";
import {Empty} from "./protos/common_pb";
import {
  IAgentsServer,
  IAgentsService,
  AgentsService
} from "./protos/agents_grpc_pb";
import {Kind, ResourceBuilder} from "@fonos/core";
import {
  updateResource,
  createResource,
  ResourceServer,
  getAccessKeyId
} from "@fonos/core";
import decoder from "./decoder";

class AgentsServer implements IAgentsServer {
  [name: string]: grpc.UntypedHandleCall;
  async listAgents(
    call: grpc.ServerUnaryCall<ListAgentsRequest, ListAgentsResponse>,
    callback: grpc.sendUnaryData<ListAgentsResponse>
  ) {
    const result = await ResourceServer.listResources(Kind.AGENT, call);
    const response = new ListAgentsResponse();
    if (result && result.resources) {
      const domains = result.resources.map((resource) => decoder(resource));
      response.setNextPageToken(result.nextPageToken + "");
      response.setAgentsList(domains);
    }
    callback(null, response);
  }

  async createAgent(
    call: grpc.ServerUnaryCall<CreateAgentRequest, Agent>,
    callback: grpc.sendUnaryData<Agent>
  ) {
    const agent = call.request.getAgent();
    try {
      const resource = new ResourceBuilder(Kind.AGENT, agent.getName())
        .withCredentials(agent.getUsername(), agent.getSecret())
        .withDomains(agent.getDomainsList())
        .withMetadata({accessKeyId: getAccessKeyId(call)})
        .build();

      // .withPrivacy(provider.getPrivacy()) // TODO
      const response = await createResource(resource);
      callback(null, decoder(response));
    } catch (e) {
      callback(e, null);
    }
  }

  async updateAgent(
    call: grpc.ServerUnaryCall<UpdateAgentRequest, Agent>,
    callback: grpc.sendUnaryData<Agent>
  ) {
    const agent = call.request.getAgent();
    try {
      const resource = new ResourceBuilder(
        Kind.AGENT,
        agent.getName(),
        agent.getRef()
      )
        .withCredentials(agent.getUsername(), agent.getSecret())
        .withDomains(agent.getDomainsList())
        .withMetadata({
          createdOn: agent.getCreateTime(),
          modifiedOn: agent.getUpdateTime()
        })
        .build();

      const result = await updateResource({
        resource,
        accessKeyId: getAccessKeyId(call)
      });

      callback(null, decoder(result));
    } catch (e) {
      callback(e, null);
    }
  }

  async getAgent(
    call: grpc.ServerUnaryCall<GetAgentRequest, Agent>,
    callback: grpc.sendUnaryData<Agent>
  ) {
    try {
      const result = await ResourceServer.getResource(Kind.AGENT, call);
      callback(null, decoder(result));
    } catch (e) {
      callback(e, null);
    }
  }

  async deleteAgent(
    call: grpc.ServerUnaryCall<DeleteAgentRequest, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ) {
    try {
      await ResourceServer.deleteResource(Kind.AGENT, call);
      callback(null, new Empty());
    } catch (e) {
      callback(e, null);
    }
  }
}

export {AgentsServer as default, IAgentsService, AgentsService};
