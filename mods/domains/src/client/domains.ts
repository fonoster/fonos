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
import {
  CreateDomainRequest,
  CreateDomainResponse,
  UpdateDomainRequest,
  UpdateDomainResponse,
  ListDomainsRequest,
  ListDomainsResponse,
  GetDomainResponse,
  DeleteDomainResponse
} from "./types";
import {FonosService, ServiceOptions} from "@fonos/common";
import {DomainsClient} from "../service/protos/domains_grpc_pb";
import DomainsPB from "../service/protos/domains_pb";
import CommonPB from "../service/protos/common_pb";
import {promisifyAll} from "grpc-promise";
import grpc from "@grpc/grpc-js";

/**
 * @classdesc Use Fonos Domains, a capability of Fonos SIP Proxy Subsystem,
 * to create, update, get and delete Domains. The API requires of a running
 * Fonos deployment.
 *
 * @extends FonosService
 * @example
 *
 * const Fonos = require("@fonos/sdk");
 * const domains = new Fonos.Domains();
 *
 * domains.createDomain({name: "Local Domain", domainUri: "sip.local"...})
 * .then(result => {
 *   console.log(result)             // successful response
 * }).catch(e => console.error(e));   // an error occurred
 */
export default class Domains extends FonosService {
  /**
   * Constructs a new Domains object.
   *
   * @param {ServiceOptions} options - Options to indicate the objects endpoint
   * @see module:core:FonosService
   */
  constructor(options?: ServiceOptions) {
    super(DomainsClient, options);
    super.init(grpc);
    promisifyAll(super.getService(), {metadata: super.getMeta()});
  }

  /**
   * Creates a new Domain on the SIP Proxy subsystem.
   *
   * @param {CreateDomainRequest} request - Request for the provision of
   * a new Domain
   * @param {string} request.name - Friendly name for the SIP domain
   * @param {string} request.domainUri - Domain URI. FQDN is recommended
   * @param {string} request.egressNumberRef - A valid reference to a Number
   * in Fonos
   * @param {string} request.egressRule - Regular expression indicating when a
   * call will be routed via request.egressNumberRef
   * @param {string} request.accessDeny - Optional list of IPs or networks that
   * cannot communicate with this Domain
   * @param {string} request.accessAllow - Optional list of IPs or networks
   * allow if request.accessDeny is defined
   * @return {Promise<CreateDomainResponse>}
   * @example
   *
   * const request = {
   *    name: "Local Domain",
   *    domainUri: "sip.local",
   *    egressRule: ".*",
   *    egressNumberRef: "cb8V0CNTfH",
   *    accessDeny: ["0.0.0.0/1"]     // Deny all
   *    accessAllow: ["192.168.1.0/255.255.255.0", "192.168.0.1/31"]
   * };
   *
   * domains.createDomain(request)
   * .then(result => {
   *   console.log(result) // returns the CreateDomainResponse interface
   * }).catch(e => console.error(e)); // an error occurred
   */
  async createDomain(
    request: CreateDomainRequest
  ): Promise<CreateDomainResponse> {
    const domain = new DomainsPB.Domain();
    domain.setName(request.name);
    domain.setDomainUri(request.domainUri);
    domain.setEgressRule(request.egressRule);
    domain.setEgressNumberRef(request.egressNumberRef);
    domain.setAccessDenyList(request.accessDeny);
    domain.setAccessAllowList(request.accessAllow);

    const outRequest = new DomainsPB.CreateDomainRequest();
    outRequest.setDomain(domain);

    const res = await super.getService().createDomain().sendMessage(outRequest);

    return {
      ref: res.getRef(),
      name: res.getName(),
      domainUri: res.getDomainUri(),
      egressRule: res.getEgressRule(),
      egressNumberRef: res.getEgressNumberRef(),
      accessDeny: res.getAccessDenyList(),
      accessAllow: res.getAccessAllowList(),
      createTime: res.getCreateTime(),
      updateTime: res.getUpdateTime()
    };
  }

  /**
   * Retrives a Domain by its reference.
   *
   * @param {string} ref - Reference to Domain
   * @return {Promise<GetDomainResponse>} The domain
   * @throws if ref is null or Domain does not exist
   * @example
   *
   * const ref = "Nx05y-ldZa";
   *
   * domains.getDomain(ref)
   * .then(result => {
   *   console.log(result) // returns the CreateGetResponse interface
   * }).catch(e => console.error(e)); // an error occurred
   */
  async getDomain(ref: string): Promise<GetDomainResponse> {
    const request = new DomainsPB.GetDomainRequest();
    request.setRef(ref);

    const res = await super.getService().getDomain().sendMessage(request);

    return {
      ref: res.getRef(),
      name: res.getName(),
      domainUri: res.getDomainUri(),
      egressRule: res.getEgressRule(),
      egressNumberRef: res.getEgressNumberRef(),
      accessDeny: res.getAccessDenyList(),
      accessAllow: res.getAccessAllowList(),
      createTime: res.getCreateTime(),
      updateTime: res.getUpdateTime()
    };
  }

  /**
   * Update a Domain at the SIP Proxy subsystem.
   *
   * @param {UpdateDomainRequest} request - Request for the update of an
   * existing Domain
   * @param {string} request.ref - To update a Domain you must provide
   * its reference
   * @param {string} request.name - Friendly name for the SIP domain
   * @param {string} request.egressNumberRef - A valid reference to a
   * Number in Fonos
   * @param {string} request.egressRule - Regular expression indicating when a
   * call will be routed via request.egressNumberRef
   * @param {string} request.accessDeny - Optional list of IPs or networks that
   * cannot communicate with this Domain
   * @param {string} request.accessAllow - Optiona list of IPs or networks
   * allow if request.accessDeny is defined
   * @return {Promise<UpdateDomainResponse>}
   * @example
   *
   * const request = {
   *    ref: "Nx05y-ldZa",
   *    name: "Office Domain",
   *    accessAllow: ["192.168.1.0/255.255.255.0", "192.168.0.1/31"]
   * };
   *
   * domains.updateDomain(request)
   * .then(result => {
   *   console.log(result) // returns the UpdateDomainResponse interface
   * }).catch(e => console.error(e)); // an error occurred
   */
  async updateDomain(
    request: UpdateDomainRequest
  ): Promise<UpdateDomainResponse> {
    const getDomainRequest = new DomainsPB.GetDomainRequest();
    getDomainRequest.setRef(request.ref);
    const domain = await super
      .getService()
      .getDomain()
      .sendMessage(getDomainRequest);

    if (request.name) domain.setName(request.name);
    if (request.egressRule) domain.setEgressRule(request.egressRule);
    if (request.egressNumberRef) {
      domain.setEgressNumberRef(request.egressNumberRef);
    }
    if (request.accessDeny) domain.setAccessDenyList(request.accessDeny);
    if (request.accessAllow) domain.setAccessAllowList(request.accessAllow);

    const req = new DomainsPB.UpdateDomainRequest();
    req.setDomain(domain);

    const res = await super.getService().updateDomain().sendMessage(req);

    return {
      ref: res.getRef()
    };
  }

  /**
   * List the Domains registered in Fonos SIP Proxy subsystem.
   *
   * @param {ListDomainsRequest} request - Optional parameter with size and
   * token for the request
   * @param {number} request.pageSize - Number of element per page
   * (defaults to 20)
   * @param {string} request.pageToken - The next_page_token value returned from
   * a previous List request if any
   * @return {Promise<ListDomainsResponse>} Paginated list of Domains
   * @example
   *
   * const request = {
   *    pageSize: 20,
   *    pageToken: 2
   * };
   *
   * domains.listDomains(request)
   * .then(() => {
   *   console.log(result)            // returns a ListDomainsResponse interface
   * }).catch(e => console.error(e));  // an error occurred
   */
  async listDomains(request: ListDomainsRequest): Promise<ListDomainsResponse> {
    const r = new DomainsPB.ListDomainsRequest();
    r.setPageSize(request.pageSize);
    r.setPageToken(request.pageToken);
    r.setView(request.view);
    const paginatedList = await super.getService().listDomains().sendMessage(r);

    return {
      nextPageToken: paginatedList.getNextPageToken(),
      domains: paginatedList.getDomainsList().map((d: DomainsPB.Domain) => {
        return {
          ref: d.getRef(),
          name: d.getName(),
          domainUri: d.getDomainUri(),
          egressRule: d.getEgressRule(),
          egressNumberRef: d.getEgressNumberRef(),
          accessDeny: d.getAccessDenyList(),
          accessAllow: d.getAccessAllowList(),
          createTime: d.getCreateTime(),
          updateTime: d.getUpdateTime()
        };
      })
    };
  }

  /**
   * Deletes a Domain from SIP Proxy subsystem. Notice, that in order to delete
   * a Domain, you must first delete all it's Agents.
   *
   * @param {string} ref - Reference to the Domain you wish to delete
   * @example
   *
   * const ref = "Nx05y-ldZa";
   *
   * domains.deleteDomain(ref)
   * .then(() => {
   *   console.log("done")            // returns a reference of the domain
   * }).catch(e => console.error(e));  // an error occurred
   */
  async deleteDomain(ref: string): Promise<DeleteDomainResponse> {
    const req = new DomainsPB.DeleteDomainRequest();
    req.setRef(ref);
    await super.getService().deleteDomain().sendMessage(req);
    return {ref};
  }
}

export {DomainsPB, CommonPB};

// WARNING: Workaround for support to commonjs clients
module.exports = Domains;
module.exports.DomainsPB = DomainsPB;
module.exports.CommonPB = CommonPB;
