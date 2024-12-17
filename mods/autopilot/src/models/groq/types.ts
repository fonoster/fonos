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
import { BaseModelParams } from "../types";

enum GroqModel {
  GEMMA7B = "gemma-7b-it",
  LLAMA3_GROQ_70B_8192_TOOL_USE_PREVIEW = "llama3-groq-70b-8192-tool-use-preview",
  LLAMA3_1_8B_INSTANT = "llama-3.1-8b-instant",
  LLAMA3_3_3_70B_SPECDEC = "llama-3.3-70b-specdec"
}

type GroqParams = BaseModelParams & {
  model: GroqModel;
  apiKey: string;
  maxTokens: number;
  temperature: number;
};

export { GroqModel, GroqParams };
