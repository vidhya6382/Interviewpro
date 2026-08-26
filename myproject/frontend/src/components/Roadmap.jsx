import './Roadmap.css';
export default function Roadmap({title}){
  const steps = ['Basics & Syntax','OOPs','Data Structures','Libraries','Projects','Interview Prep'];
  return(
    <div className="roadmap">
      <h3>🗺️ {title} Roadmap</h3>
      <div className="roadmap-steps">
        {steps.map((s,i)=>(
          <div key={i} className="r-step"><span className="r-num">{i+1}</span><p>{s}</p></div>
        ))}
      </div>
    </div>
  )
}