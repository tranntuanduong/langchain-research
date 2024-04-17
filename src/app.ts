import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import type { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import * as dotenv from 'dotenv';
import { createOpenAIFunctionsAgent } from 'langchain/agents';
import { pull } from 'langchain/hub';
import { initRetrieverTool } from './modules/agents/retriever';
import { AgentExecutor } from 'langchain/agents';

dotenv.config();

const testAgents = async () => {
  // init tools
  const retrieverTool = await initRetrieverTool();
  const searchTool = new TavilySearchResults();
  const tools = [searchTool, retrieverTool];

  // llm model
  const llm = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    temperature: 0,
  });

  // promt template
  const prompt = await pull<ChatPromptTemplate>(
    'hwchase17/openai-functions-agent',
  );

  // create agent with llm, tools, and init prompts
  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  const result = await agentExecutor.invoke({
    input: 'tell me about new feature of nextjs14',
  });

  console.log('result:::::', result);
};

testAgents();
