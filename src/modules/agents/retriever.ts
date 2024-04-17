import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { createRetrieverTool } from 'langchain/tools/retriever';

export const initRetrieverTool = async () => {
  const loader = new CheerioWebBaseLoader(
    'https://docs.smith.langchain.com/user_guide',
  );
  const rawDocs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.splitDocuments(rawDocs);

  const vectorstore = await MemoryVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings(),
  );
  const retriever = vectorstore.asRetriever();

  // const retrieverResult = await retriever.getRelevantDocuments(
  //   'how to upload a dataset',
  // );

  const retrieverTool = createRetrieverTool(retriever, {
    name: 'langsmith_search',
    description:
      'Search for information about LangSmith. For any questions about LangSmith, you must use this tool!',
  });

  return retrieverTool;
};
