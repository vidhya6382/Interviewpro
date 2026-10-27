import genai from './genai_frontend_100.json';
import aws from './aws_frontend_100.json';
import dsa from './dsa_frontend_100.json';
import ml from './ml_frontend_100.json';
import devops from './devops_frontend_100.json';
import azure from './azure_frontend_100.json';
import core from './core_frontend_100.json';
import api from './api_frontend_100.json';
import ai_fullstack from './ai-fullstack_frontend_100.json';
import automation from './automation_frontend_100.json';
import data_analyst from './data-analyst_frontend_100.json';
import data_science from './data-science_frontend_100.json';
import full_cloud from './full-cloud_frontend_100.json';
import full_qa from './full-qa_frontend_100.json';
import full_swe from './full-swe_frontend_100.json';
import fullstack_java from './fullstack_java_frontend_100.json';
import fullstack_mern from './fullstack_mern_frontend_100.json';
import fullstack_python from './fullstack_python_frontend_100.json';
import manual from './manual_frontend_100.json';
import mbppAll from './mbpp_questions.json';

// 972 questions romba perusu na, number kammi pannunga (e.g. 200). Ellam venum na mbppAll.length
const MBPP_LIMIT = 200;
const mbpp = mbppAll.slice(0, MBPP_LIMIT);

const rawData = {
  genai, aws, dsa, ml, devops, azure, core, api,
  ai_fullstack, automation, data_analyst, data_science,
  full_cloud, full_qa, full_swe, fullstack_java, fullstack_mern, fullstack_python, manual,
  mbpp,
  python: fullstack_python,
  java: fullstack_java,
  mern: fullstack_mern
};

const isMbpp = (q) => String(q.id || '').startsWith('mbpp-');

function enrich(q, idx) {
  const mb = isMbpp(q);
  return {
    id: mb ? q.id : idx + 1,
    title: q.title,
    slug: mb ? q.id : q.title,
    difficulty: q.difficulty || q.diff || 'Medium',
    diff: q.diff || q.difficulty || 'Medium',
    topic: q.topic || 'DSA',
    company: q.company || 'General',
    company_tags: q.company_tags || q.company || 'General',
    category: q.category || q.topic || 'DSA',
    description: q.description || `${q.title} - This is a ${q.topic || 'coding'} problem from ${q.company || 'top companies'}. Implement an efficient solution.`,
    sample_input: q.sample_input || 'Sample input for ' + q.title,
    sample_output: q.sample_output || 'Sample output for ' + q.title,
    constraints: q.constraints || '1 <= N <= 10^5\nTime: 1 sec',
    hints: q.hints || `Think about ${q.topic} concepts to solve ${q.title}`,
    starter_code: q.starter_code || `def solve():\n    # ${q.title}\n    # Write your code here\n    pass`
  };
}

let all = [];
let count = 0;
Object.entries(rawData).forEach(([key, arr]) => {
  if (key === 'python' || key === 'java' || key === 'mern') return; // alias, double count aagaama
  if (Array.isArray(arr)) {
    arr.forEach(q => {
      count++;
      all.push(enrich(q, count));
    });
  }
});

// Duplicate remove: "Build Intent Classifier 17" maari number serththa fake copies um remove
const uniqueMap = new Map();
all.forEach(q => {
  const key = isMbpp(q) ? q.id : q.title.replace(/\s\d+$/, '');
  if (!uniqueMap.has(key)) uniqueMap.set(key, q);
});

export const allQuestions = Array.from(uniqueMap.values());

const mbppList = allQuestions.filter(isMbpp);
const pythonList = allQuestions.filter(
  q => isMbpp(q) || (q.topic || '').toLowerCase().includes('python') || q.title.toLowerCase().includes('python') || q.title.toLowerCase().includes('pandas')
);

export const roleData = {
  ...rawData,
  all: allQuestions,
  mbpp: mbppList,
  python: pythonList.length ? pythonList : allQuestions,
  dsa: allQuestions
};