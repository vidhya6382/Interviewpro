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
import fullstack from './full-swe_frontend_100.json';

export const roleData = {
  genai, aws, dsa, ml, devops, azure, core, api,
  python: fullstack_python,
  java: fullstack_java,
  mern: fullstack_mern,
  ai_fullstack, automation, data_analyst, data_science,
  full_cloud, full_qa, full_swe, fullstack, manual,
  fullstack_python, fullstack_java, fullstack_mern
};

// Ella questions ah orey list la
export const allQuestions = Object.values(roleData).flat();