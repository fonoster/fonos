/**
 * @fileoverview gRPC-Web generated client stub for fonoster.domains.v1beta2
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v3.20.3
// source: domains.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as domains_pb from './domains_pb'; // proto import: "domains.proto"


export class DomainsClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorCreateDomain = new grpcWeb.MethodDescriptor(
    '/fonoster.domains.v1beta2.Domains/CreateDomain',
    grpcWeb.MethodType.UNARY,
    domains_pb.CreateDomainRequest,
    domains_pb.CreateDomainResponse,
    (request: domains_pb.CreateDomainRequest) => {
      return request.serializeBinary();
    },
    domains_pb.CreateDomainResponse.deserializeBinary
  );

  createDomain(
    request: domains_pb.CreateDomainRequest,
    metadata?: grpcWeb.Metadata | null): Promise<domains_pb.CreateDomainResponse>;

  createDomain(
    request: domains_pb.CreateDomainRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: domains_pb.CreateDomainResponse) => void): grpcWeb.ClientReadableStream<domains_pb.CreateDomainResponse>;

  createDomain(
    request: domains_pb.CreateDomainRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: domains_pb.CreateDomainResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/fonoster.domains.v1beta2.Domains/CreateDomain',
        request,
        metadata || {},
        this.methodDescriptorCreateDomain,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/fonoster.domains.v1beta2.Domains/CreateDomain',
    request,
    metadata || {},
    this.methodDescriptorCreateDomain);
  }

  methodDescriptorUpdateDomain = new grpcWeb.MethodDescriptor(
    '/fonoster.domains.v1beta2.Domains/UpdateDomain',
    grpcWeb.MethodType.UNARY,
    domains_pb.UpdateDomainRequest,
    domains_pb.UpdateDomainResponse,
    (request: domains_pb.UpdateDomainRequest) => {
      return request.serializeBinary();
    },
    domains_pb.UpdateDomainResponse.deserializeBinary
  );

  updateDomain(
    request: domains_pb.UpdateDomainRequest,
    metadata?: grpcWeb.Metadata | null): Promise<domains_pb.UpdateDomainResponse>;

  updateDomain(
    request: domains_pb.UpdateDomainRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: domains_pb.UpdateDomainResponse) => void): grpcWeb.ClientReadableStream<domains_pb.UpdateDomainResponse>;

  updateDomain(
    request: domains_pb.UpdateDomainRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: domains_pb.UpdateDomainResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/fonoster.domains.v1beta2.Domains/UpdateDomain',
        request,
        metadata || {},
        this.methodDescriptorUpdateDomain,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/fonoster.domains.v1beta2.Domains/UpdateDomain',
    request,
    metadata || {},
    this.methodDescriptorUpdateDomain);
  }

  methodDescriptorGetDomain = new grpcWeb.MethodDescriptor(
    '/fonoster.domains.v1beta2.Domains/GetDomain',
    grpcWeb.MethodType.UNARY,
    domains_pb.GetDomainRequest,
    domains_pb.Domain,
    (request: domains_pb.GetDomainRequest) => {
      return request.serializeBinary();
    },
    domains_pb.Domain.deserializeBinary
  );

  getDomain(
    request: domains_pb.GetDomainRequest,
    metadata?: grpcWeb.Metadata | null): Promise<domains_pb.Domain>;

  getDomain(
    request: domains_pb.GetDomainRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: domains_pb.Domain) => void): grpcWeb.ClientReadableStream<domains_pb.Domain>;

  getDomain(
    request: domains_pb.GetDomainRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: domains_pb.Domain) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/fonoster.domains.v1beta2.Domains/GetDomain',
        request,
        metadata || {},
        this.methodDescriptorGetDomain,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/fonoster.domains.v1beta2.Domains/GetDomain',
    request,
    metadata || {},
    this.methodDescriptorGetDomain);
  }

  methodDescriptorListDomains = new grpcWeb.MethodDescriptor(
    '/fonoster.domains.v1beta2.Domains/ListDomains',
    grpcWeb.MethodType.UNARY,
    domains_pb.ListDomainsRequest,
    domains_pb.ListDomainsResponse,
    (request: domains_pb.ListDomainsRequest) => {
      return request.serializeBinary();
    },
    domains_pb.ListDomainsResponse.deserializeBinary
  );

  listDomains(
    request: domains_pb.ListDomainsRequest,
    metadata?: grpcWeb.Metadata | null): Promise<domains_pb.ListDomainsResponse>;

  listDomains(
    request: domains_pb.ListDomainsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: domains_pb.ListDomainsResponse) => void): grpcWeb.ClientReadableStream<domains_pb.ListDomainsResponse>;

  listDomains(
    request: domains_pb.ListDomainsRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: domains_pb.ListDomainsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/fonoster.domains.v1beta2.Domains/ListDomains',
        request,
        metadata || {},
        this.methodDescriptorListDomains,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/fonoster.domains.v1beta2.Domains/ListDomains',
    request,
    metadata || {},
    this.methodDescriptorListDomains);
  }

  methodDescriptorDeleteDomain = new grpcWeb.MethodDescriptor(
    '/fonoster.domains.v1beta2.Domains/DeleteDomain',
    grpcWeb.MethodType.UNARY,
    domains_pb.DeleteDomainRequest,
    domains_pb.DeleteDomainResponse,
    (request: domains_pb.DeleteDomainRequest) => {
      return request.serializeBinary();
    },
    domains_pb.DeleteDomainResponse.deserializeBinary
  );

  deleteDomain(
    request: domains_pb.DeleteDomainRequest,
    metadata?: grpcWeb.Metadata | null): Promise<domains_pb.DeleteDomainResponse>;

  deleteDomain(
    request: domains_pb.DeleteDomainRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: domains_pb.DeleteDomainResponse) => void): grpcWeb.ClientReadableStream<domains_pb.DeleteDomainResponse>;

  deleteDomain(
    request: domains_pb.DeleteDomainRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: domains_pb.DeleteDomainResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/fonoster.domains.v1beta2.Domains/DeleteDomain',
        request,
        metadata || {},
        this.methodDescriptorDeleteDomain,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/fonoster.domains.v1beta2.Domains/DeleteDomain',
    request,
    metadata || {},
    this.methodDescriptorDeleteDomain);
  }

}

