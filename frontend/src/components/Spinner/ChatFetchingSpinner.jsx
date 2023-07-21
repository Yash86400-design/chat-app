import './chatFetchingSpinner.css';

function ChatFetchingSpinner({ text }) {
  // Added text prop so I can use it as a reference in any component...
  return (
    <div className='fetchSpinnerContainer'>
      <div className="fetchSpinner"></div>
      <div className="fetchSpinnerText">{text}</div> {/* Added the "Loading..." text */}
    </div>
  );
}

export default ChatFetchingSpinner;