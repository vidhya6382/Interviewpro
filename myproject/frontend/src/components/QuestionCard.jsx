import './QuestionCard.css';
export default function QuestionCard(){
  const qs = ['What is Python? Explain features.','Difference between list and tuple?','What is decorator?','Explain GIL?','What is __init__?'];
  return(
    <div className="q-card">
      <h3>💬 Interview Questions</h3>
      {qs.map((q,i)=>(
        <div key={i} className="q-item">
          <b>Q{i+1}. {q}</b>
          <button>Show Answer</button>
        </div>
      ))}
    </div>
  )
}