autopilot
=================

[![Autopilot](https://img.shields.io/badge/autopilot-api-brightgreen.svg)](https://fonoster.com)
[![Version](https://img.shields.io/npm/v/@fonoster/autopilot.svg)](https://npmjs.org/package/@fonoster/autopilot)
[![Downloads/week](https://img.shields.io/npm/dw/@fonoster/autopilot.svg)](https://npmjs.org/package/@fonoster/autopilot)
[![License](https://img.shields.io/npm/l/@fonoster/autopilot.svg)](https://github.com/fonoster/fonoster/blob/main/package.json)

The autopilot module provides a way to create Voice AI applications in Fonoster. It uses Fonoster internal Voice API and the power of Large Language Models to create a conversational experience with the calling party.

* [Installation](#installation)
* [Example](#example)
* [Adding Knowledge Base](#configuring-the-knowledge-base)
* [Adding Tools](#configuring-the-tools)
* [What's Next](#whats-next)

> [!WARNING]  
> This is an overview of Fonoster's Autopilot. This module is still under heavy development, and the API is subject to change. This overview implements OpenAI and Groq models, but we are working to bring support to additional providers. If you have any suggestions or feedback, please let us know.

## Installation

```sh-session
$ npm install -g @fonoster/autopilot
```

The previous command will install the module globally.

## Example

To function, Autopilot needs a configuration file, an OpenAI API key, and an active Fonoster account or self-hosted Fonoster instance. 

The configuration file has two major sections: `conversationSettings` and `languageModel`. The `conversationSettings` section contains the settings for the conversation, like the first message, the system template, and the transfer options. The `languageModel` section contains the settings for the language model, like the provider, the model, and the temperature, among others.

```json
{
  "conversationSettings": {
    "firstMessage": "Hello, this is Olivia from Dr. Green's Family Medicine. How can I assist you today?",
    "systemTemplate": "You are a Customer Service Representative. You are here to help the caller with their needs.",
    "systemErrorMessage": "I'm sorry, but I seem to be having trouble. Please try again later.",
    "initialDtmf": "6589",
    "transferOptions": {
      "phoneNumber": "+15555555555",
      "message": "Please hold while I transfer you to a live agent.",
      "timeout": 30000
    },
    "idleOptions": {
      "message": "Are you still there?",
      "timeout": 10000,
      "maxTimeoutCount": 3
    }
  },
  "languageModel": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "maxTokens": 250,
    "temperature": 0.7,
    "knowledgeBase": [],
    "tools": []
  }
}
```

To run the Autopilot, you can use the following command:

```sh-session
$ ASSISTANTS=$(pwd)/assistants.json OPEN_API_KEY=your-key autopilot
```

You will see a message like this:

```sh-session
2024-09-06 11:32:16.584 [info]: (voice) started voice server @ 0.0.0.0, port=50061 {}
```

This means that the Autopilot is running and ready to take calls. 

Since you are running Autopilot locally, you must expose port 50061 to the Internet. To expose the port, you can use a service like [ngrok](https://ngrok.com/) 

```sh-session
$ ngrok tcp 50061
```

Take the endpoint provided by ngrok and configure it in your Fonoster account. You can find more information about how to do this in the [Fonoster documentation](https://fonoster.com/docs).

## Language Model Providers

The Autopilot supports multiple language model providers. The following is a list of the supported providers:

| Provider   | Description                                                | Supported models
|------------|------------------------------------------------------------|------------------------------------------------------------------------------|
| OpenAI     | OpenAI provides various GPT models for conversational AI   | `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`, `gpt-4-turbo`                      |
| Groq       | Groq offers high-performance AI models optimized for speed | `gemm-7b-it`, `llama3-groq-70b-8192-tool-use-preview`, `llama3-1-8b-instant`, `llama-3.3-70b-specdec` |
| Ollama     | Self-hosted Ollama models                                  | `llama3-groq-tool-use`                                                       |

## Adding Knowledge Base

A knowledge base provides information to the language model, such as business hours, services, or products.

Currently, we support retrieving documents from an S3 bucket.

To add a knowledge base, include a new entry in the `knowledgeBase` array in the configuration file. Below is an example of a knowledge for a menu PDF.

```json
{
  "conversationSettings": { ... },
  "languageModel": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "apiKey": "your-api-key",
    "maxTokens": 100,
    "temperature": 0.4,
    "knowledgeBase": [{
      "type": "s3",
      "title": "Menu PDF",
      "document": "sample.pdf"
    }],
    "tools": []
  }
}
```

## Adding Tools

A tool in Autopilot is a way to interact with external services to get information or perform actions. For example, you can use a tool to get the weather, the latest news, or an SMS.

You can configure a new tool by adding a new entry in the `tools` array in the configuration file. The following is an example tool that gets the available appointment times for a specific date.

```json
{
  "conversationSettings": { ... },
  "languageModel": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "apiKey": "your-api-key",
    "maxTokens": 100,
    "temperature": 0.4,
    "knowledgeBase": [],
    "tools": [
      {
        "name": "getAvailableTimes",
        "description": "Get available appointment times for a specific date.",
        "parameters": {
          "type": "object",
          "properties": {
            "date": {
              "type": "string",
              "format": "date"
            }
          },
          "required": [
            "date"
          ]
        },
        "operation": {
          "type": "get",
          "url": "https://api.example.com/appointment-times",
          "headers": {
            "x-api-key": "your-api-key"
          }
        }
      }
    ]
  }
}
```

In addition to the `get` operation type, you can use the `post` operation type. The `post` operation type is used when sending data to the tool. When sending a post, you can optionally set `waitForResponse` to false, which will "fire and forget" the request. The default behavior is to wait for the response.

If your tool needs the number of the caller or the number that received the call, you can use the reserved variables `ingressNumber` and `callerNumber`. Similarly, you can use the reserved variable `callReceivedAt` to get the date and time when the call was received in `ISO 8601` format and the `callDirection` variable to check if the call was originated from the PSTN.

The expected format for the response is a JSON object with the following structure:

```json
{ "result": "text to pass to the language model" }
```

For example:

```json
{ "result": "The available appointment times are 9:00 AM, 10:00 AM, and 11:00 AM." }
```

## What's Next

The Autopilot is still under heavy development. The next steps are to add support for Retrieval-Augmented Generation(RAG), improve the language model integration, and improve the Finite State Machine (FSM) that powers the conversations. If you have any suggestions or feedback, please let us know.

