import Navbar from '../components/Navbar.jsx';
import './Blog.css';
import { useState } from 'react';

export default function Blog(){
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const blogs = [
    {
      id:1, 
      tag:'HR INTERVIEW', 
      color:'#2563EB', 
      letter:'HR', 
      title:'Top 50 HR Interview Questions With Answers', 
      desc:'Real HR questions asked at TCS, Infosys, Wipro with perfect sample answers.',
      time:'12 min read', 
      date:'Jan 12, 2026',
      fullContent: `TOP 50 HR QUESTIONS - TCS, INFOSYS, WIPRO PATTERN

1. Tell me about yourself?
I am a Python Full Stack Developer from [Your College]. I am skilled in Python, Django, DRF, FastAPI, React and MySQL. I have built 2 full stack projects - an Interview Platform with 400+ coding questions and an E-commerce API. I love solving DSA problems in Python.

2. Why should we hire you?
Because I have hands-on Python backend skills + frontend basics. I can build REST APIs, optimize SQL queries, and deploy with Docker. I am a fast learner and have already solved 400+ problems similar to your work.

3. Why do you want to join TCS/Infosys/Wipro?
Your company provides great learning, job stability and exposure to real client projects. I want to start my career where I can learn clean coding and scale my Python skills.

4. What are your strengths?
Problem solving, Django ORM optimization, and ability to learn new tech quickly. Example: I learned FastAPI in 2 days and migrated my project.

5. What is your weakness?
I used to spend too much time perfecting one feature. Now I use time-blocking and prioritize delivery.

6. Where do you see yourself in 5 years?
As a Senior Python Developer/Tech Lead in your organization, leading backend modules.

7. Are you willing to relocate?
Yes, I am open to relocation as per project requirements.

8. What is your salary expectation?
As a fresher, learning and growth is my priority. I am okay as per company norms.

9. Tell me about your final year project?
Built Python Interview Platform - Django + React + Judge0 API. Features: auto-graded coding Qs, test cases, mock interviews. Reduced manual checking time by 90%.

10. What is your greatest achievement?
Building this platform with 400+ questions and deploying it independently.

11. Why did you choose CSE/IT?
Because I love logic building and creating products that solve real problems.

12. What do you know about our company?
TCS is India's largest IT service company, part of Tata Group. Works in BFSI, Healthcare, Retail. Known for job security and learning.

13. Are you comfortable with night shifts?
Yes, if project requires, I am comfortable.

14. What if you get a better offer?
I am looking for long term growth and stability, not just salary. If I join TCS/Infosys, I will stay and grow here.

15. Do you have any questions for us?
Yes, What tech stack will I work on initially and what does the learning path look like?

16. What motivates you?
Solving real problems and seeing my code in production.

17. How do you handle pressure?
I break tasks into small parts, prioritize and focus on one at a time.

18. Tell me about a challenge you faced?
My Django API was slow (8 sec). I found N+1 query problem, used select_related and caching, reduced to 300ms.

19. Are you a team player?
Yes, in my final year project I handled backend while my friend did frontend. We used Git properly.

20. What are your hobbies?
Coding, solving DSA, watching Python podcasts.

21-50: [All real questions included below]

21. Gap year explanation? - I used gap to learn Python Full Stack and build projects.
22. Why low CGPA? - Initially focused on theory less, but improved in last 2 sems and built strong practical skills.
23. Will you pursue higher studies? - No, I want to focus on job and industry experience now.
24. What if you are rejected? - I will analyze feedback, improve and try again.
25. Are you willing to sign bond? - Yes, I am okay with service agreement.
26. Explain your internship? - 2 months Python backend intern, built REST APIs for admin panel.
27. What is your family background? - Brief, father occupation, mother, siblings.
28. How do you handle conflict in team? - Discuss openly, focus on data not ego.
29. Leadership example? - Led 3 member team for college hackathon, divided tasks.
30. Quick learner example? - Learned Docker in 1 day and deployed my project.
31. What is your biggest failure? - Failed in first hackathon due to poor time mgmt, learned to plan better.
32. Why Python? - Simple syntax, huge community, great for backend, AI, automation.
33. Are you comfortable with any technology? - Yes, I am flexible, my base is Python.
34. What do you do in free time? - Leetcode, build side projects.
35. How do you stay updated? - Follow Python Weekly, Real Python blog, YouTube.
36. Tell me about yourself outside resume? - I teach Python basics to juniors.
37. What makes you angry? - Unfinished work makes me restless, so I complete it.
38. How do you prioritize work? - Urgent vs Important matrix.
39. Have you ever cheated? - No, I believe in learning.
40. What will you do if not placed? - Continue building skills and apply again.
41. Why should I not hire you? - If you need someone who wants only salary not learning, I am not fit.
42. What is your dream company? - Yours, because it aligns with my Python skills and long term goal.
43. How long will you stay? - Long term, I want to grow with company.
44. Tell me about a time you helped someone? - Helped juniors debug their Python projects.
45. What is your expected CTC? - As per company standards for freshers.
46. Are you willing to work in support project? - Yes, every project teaches something, I will learn.
47. What is your role model? - My father for discipline and hard work.
48. Do you have girlfriend/boyfriend? - I am focused on career right now.
49. Will you work overtime? - Yes, if deadline requires.
50. Any questions? - What will be my day to day responsibilities in first 3 months?
`
    },
    {
      id:4, 
      tag:'RESUME', 
      color:'#16A34A', 
      letter:'CV', 
      title:'Resume Tips for Freshers - ATS Template', 
      desc:'Exact resume that got shortlisted in TCS Digital - No fake points.',
      time:'7 min read', 
      date:'Jan 5, 2026',
      fullContent: `ATS RESUME THAT ACTUALLY SHORTLISTS - FOR PYTHON FRESHER

FORMAT:
- 1 Page only
- No photo, no tables, no graphics, no columns
- Font: Arial / Calibri 11pt
- File: FirstName_LastName_Python.pdf
- Size: Under 800KB

EXACT TEMPLATE:

[Name]
Phone | Email | LinkedIn.com/in/xxx | GitHub.com/xxx | Portfolio

SUMMARY:
Python Full Stack Developer with hands-on experience in Django, DRF, FastAPI, React, MySQL, Docker. Built Interview Platform with 400+ auto-graded questions. Solved 400+ DSA problems in Python.

SKILLS:
Languages: Python, JavaScript, SQL
Backend: Django, Django REST Framework, FastAPI, JWT, REST APIs
Frontend: React.js, HTML, CSS, Tailwind
Database: MySQL, PostgreSQL, MongoDB (Basics)
Tools: Git, GitHub, Docker, Postman, VS Code, AWS (Basics)

PROJECTS:
1. Python Interview Platform - Django, React, Judge0, MySQL - GitHub Link
- Built 400+ auto-verified coding questions with test cases
- Implemented JWT Auth, role based access
- Optimized N+1 queries using select_related, reduced response from 8s to 300ms
- Deployed using Docker on Render

2. E-commerce REST API - Django REST Framework - GitHub Link
- Built 25+ REST APIs for products, cart, orders
- Integrated Razorpay payment
- Wrote 30+ unit test cases

EXPERIENCE / INTERNSHIP:
Python Backend Intern - XYZ Company - 2 Months
- Developed 10 REST APIs for internal dashboard
- Fixed 15+ bugs in existing codebase

EDUCATION:
B.E CSE - College Name - CGPA 7.8 - 2025

CERTIFICATIONS:
- Python For Everybody - Coursera
- Django - Udemy

CHECKLIST BEFORE APPLY:
1. Each bullet starts with Built/Developed/Optimized/Designed
2. Add numbers: Reduced 90%, Built 25 APIs, Solved 400+
3. No typo - run Grammarly
4. Add GitHub links, make repo public with README
5. Mirror keywords from Job Description (if JD says REST API, write REST API not API)
`
    },
    {
      id:6, 
      tag:'BEHAVIOURAL', 
      color:'#E11D48', 
      letter:'B', 
      title:'Behavioural Interview - STAR Method With Python Examples', 
      desc:'10 real behavioural Qs answered with STAR using Python project examples.',
      time:'8 min read', 
      date:'Dec 28, 2025',
      fullContent: `STAR METHOD = Situation, Task, Action, Result

Q1: Tell me about a time you faced a challenging bug?
S: In Interview Platform, judge API was failing for 20% submissions.
T: I had to fix within 1 day before demo.
A: I checked logs, found input format mismatch - extra newline. I stripped inputs and added validation.
R: Failure rate became 0%, demo went success.

Q2: Tell me about a team conflict?
S: My teammate wanted to use Firebase, I wanted Django + MySQL.
T: We had to finalize stack in 1 day.
A: I built small POC for both, compared cost, scalability, learning curve in sheet.
R: Team agreed for Django + MySQL, project completed faster.

Q3: When you had to learn something quickly?
S: Needed Docker for deployment, never used before.
T: Deploy in 2 days.
A: Watched Docker docs, built Dockerfile, tested locally, checked YouTube.
R: Deployed successfully on Render with Docker.

Q4: When you missed a deadline?
S: Could not complete frontend in 1 week.
T: I had to inform mentor.
A: I informed early, asked for help, worked extra 2 hours daily.
R: Completed with 1 day delay, learned to estimate better.

Q5: Leadership example?
S: Led 3 members for hackathon.
T: Build MVP in 24 hours.
A: Divided tasks - I took backend, others frontend/design. Set 4 hour check-ins.
R: Built MVP and got top 10.

Q6: When you helped a teammate?
S: Junior stuck in Python recursion.
T: He had submission next day.
A: I explained with diagram, gave 2 simple examples.
R: He understood and submitted on time.

Q7: Biggest failure?
S: First hackathon project crashed on stage.
T: Present project.
A: Root cause was not testing with real data. After that I always test with edge cases.
R: Next hackathon, project worked perfectly.

Q8: How do you handle pressure?
S: During final exams + project deadline same week.
T: Manage both.
A: Made timetable, studied morning, coded evening, avoided phone.
R: Managed both, got B+ grade and project submitted.

Q9: Tell me about a time you took initiative?
S: College had no coding club.
T: I wanted to start one.
A: Took permission from HOD, created WhatsApp group, conducted weekly Python sessions.
R: Now 40+ juniors learning.

Q10: Why should we trust you?
S: In my internship, I was given production DB access.
T: Handle carefully.
A: I always took backup, tested queries on local first, never ran delete without where.
R: Manager appreciated my responsibility.
`
    },
  ];

  const filtered = blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

  return(
    <>
      <Navbar />
      <div className="blog-editorial">
        <div className="ed-header">
          <div className="ed-left">
            <span className="ed-kicker">INTERVIEW PRO • RESOURCES</span>
            <h1>Interview <i>Resources</i></h1>
            <p>Real answers only - No filler, no "remaining" text.</p>
          </div>
          <div className="ed-search">
            <span>🔍</span>
            <input placeholder="Search articles..." value={search} onChange={e=> setSearch(e.target.value)} />
          </div>
        </div>

        <div className="ed-list">
          {filtered.map(blog=>(
            <article key={blog.id} className="ed-article" onClick={()=> setSelected(blog)} style={{cursor:'pointer'}}>
              <div className="ed-letter" style={{background: blog.color}}>{blog.letter}</div>
              <div className="ed-content">
                <div className="ed-meta">
                  <span className="ed-tag" style={{color: blog.color, background: blog.color+'18'}}>{blog.tag}</span>
                  <span>•</span>
                  <span>{blog.date}</span>
                  <span>•</span>
                  <span>{blog.time}</span>
                </div>
                <h2>{blog.title}</h2>
                <p className="ed-desc">{blog.desc}</p>
                <span className="ed-read">Read full article →</span>
              </div>
            </article>
          ))}
        </div>

        {selected && (
          <div className="blog-modal-overlay" onClick={()=> setSelected(null)}>
            <div className="blog-modal" onClick={e=> e.stopPropagation()}>
              <button className="close-modal" onClick={()=> setSelected(null)}>✕</button>
              <div className="ed-letter big" style={{background: selected.color}}>{selected.letter}</div>
              <h1 style={{fontSize:'22px', margin:'12px 0'}}>{selected.title}</h1>
              <pre className="blog-full-text">{selected.fullContent}</pre>
            </div>
          </div>
        )}
      </div>
    </>
  )
}