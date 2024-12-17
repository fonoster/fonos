import { ListResponse } from "./common";

/*
 * Copyright (C) 2024 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
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
enum WorkspaceRoleEnum {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  USER = "USER"
}

enum WorkspaceMemberStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE"
}

type Workspace = {
  ref: string;
  name: string;
  ownerRef: string;
  accessKeyId: string;
  createdAt: Date;
  updatedAt: Date;
};

type CreateWorkspaceRequest = {
  name: string;
};

type UpdateWorkspaceRequest = {
  ref: string;
  name: string;
};

type ListWorkspacesResponse = ListResponse<Workspace>;

type InviteUserToWorkspaceResponse = {
  workspaceRef: string;
  userRef: string;
};

type InviteUserToWorkspaceRequest = {
  email: string;
  name: string;
  role: WorkspaceRoleEnum;
  password: string;
};

type RemoveUserFromWorkspaceRequest = {
  userRef: string;
};

type RemoveUserFromWorkspaceResponse = {
  userRef: string;
};

type ResendWorkspaceMembershipInvitationRequest = {
  userRef: string;
};

type ResendWorkspaceMembershipInvitationResponse = {
  userRef: string;
};

export {
  CreateWorkspaceRequest,
  InviteUserToWorkspaceRequest,
  InviteUserToWorkspaceResponse,
  ListWorkspacesResponse,
  RemoveUserFromWorkspaceRequest,
  RemoveUserFromWorkspaceResponse,
  ResendWorkspaceMembershipInvitationRequest,
  ResendWorkspaceMembershipInvitationResponse,
  UpdateWorkspaceRequest,
  Workspace,
  WorkspaceMemberStatus,
  WorkspaceRoleEnum
};
