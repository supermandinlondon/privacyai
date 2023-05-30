
const projectConfig = {

    role : 'You are a data protection officer for a multi national technology company. The company is launching a product called ', 
    dpiaInstruction : 'Can you create a data protection impact assessment (DPIA) to assess potential data protection risk associated focusing on specific GDPR domain for this product and suggest mitigation. Focus on assessing GDPR requirements under domain ',
    domainInstruction : ' First explain key GDPR requirements for this product for the domain then write top 10 data protection risks for domain in numbered form and finally write 10 mitigations for domain in bullet form. Make your answers to 2000 words and send your response in an HTML format so that I can copy that in an HTML code ',
    regenfInstruction : 'Can you summarise recent Eu regulatory enforcement on similar products launched by other tech companies in EU. Please only share details of similar products',
    euInstruction : 'Can you summarise recent judgement by EU courts on similar products launched by other tech companies in EU. Please only share details of judgment for similar products only',
    mediaInstruction : 'Can you summarise recent media coverage citing privacy risks on similar products launched by other tech companies.',
  };
  
  export default projectConfig;
  