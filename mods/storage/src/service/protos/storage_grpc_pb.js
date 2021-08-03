// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// *
// MIT License
// Copyright (c) 2020 Fonoster Inc
//
// The Storage proto contains the artificats for bucket and objects
// management.
'use strict';
var grpc = require('@grpc/grpc-js');
var storage_pb = require('./storage_pb.js');

function serialize_fonos_storage_v1alpha1_GetObjectURLRequest(arg) {
  if (!(arg instanceof storage_pb.GetObjectURLRequest)) {
    throw new Error('Expected argument of type fonos.storage.v1alpha1.GetObjectURLRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_fonos_storage_v1alpha1_GetObjectURLRequest(buffer_arg) {
  return storage_pb.GetObjectURLRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_fonos_storage_v1alpha1_GetObjectURLResponse(arg) {
  if (!(arg instanceof storage_pb.GetObjectURLResponse)) {
    throw new Error('Expected argument of type fonos.storage.v1alpha1.GetObjectURLResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_fonos_storage_v1alpha1_GetObjectURLResponse(buffer_arg) {
  return storage_pb.GetObjectURLResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_fonos_storage_v1alpha1_UploadObjectRequest(arg) {
  if (!(arg instanceof storage_pb.UploadObjectRequest)) {
    throw new Error('Expected argument of type fonos.storage.v1alpha1.UploadObjectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_fonos_storage_v1alpha1_UploadObjectRequest(buffer_arg) {
  return storage_pb.UploadObjectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_fonos_storage_v1alpha1_UploadObjectResponse(arg) {
  if (!(arg instanceof storage_pb.UploadObjectResponse)) {
    throw new Error('Expected argument of type fonos.storage.v1alpha1.UploadObjectResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_fonos_storage_v1alpha1_UploadObjectResponse(buffer_arg) {
  return storage_pb.UploadObjectResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var StorageService = exports.StorageService = {
  uploadObject: {
    path: '/fonos.storage.v1alpha1.Storage/UploadObject',
    requestStream: true,
    responseStream: false,
    requestType: storage_pb.UploadObjectRequest,
    responseType: storage_pb.UploadObjectResponse,
    requestSerialize: serialize_fonos_storage_v1alpha1_UploadObjectRequest,
    requestDeserialize: deserialize_fonos_storage_v1alpha1_UploadObjectRequest,
    responseSerialize: serialize_fonos_storage_v1alpha1_UploadObjectResponse,
    responseDeserialize: deserialize_fonos_storage_v1alpha1_UploadObjectResponse,
  },
  getObjectURL: {
    path: '/fonos.storage.v1alpha1.Storage/GetObjectURL',
    requestStream: false,
    responseStream: false,
    requestType: storage_pb.GetObjectURLRequest,
    responseType: storage_pb.GetObjectURLResponse,
    requestSerialize: serialize_fonos_storage_v1alpha1_GetObjectURLRequest,
    requestDeserialize: deserialize_fonos_storage_v1alpha1_GetObjectURLRequest,
    responseSerialize: serialize_fonos_storage_v1alpha1_GetObjectURLResponse,
    responseDeserialize: deserialize_fonos_storage_v1alpha1_GetObjectURLResponse,
  },
};

exports.StorageClient = grpc.makeGenericClientConstructor(StorageService);
