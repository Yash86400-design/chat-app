import './chatFetchingSpinner.css';

function ChatFetchingSpinner() {
  return (
    <div className='fetchSpinnerContainer'>
      <div className="fetchSpinner"></div>
      <div className="fetchSpinnerText">Loading...</div> {/* Added the "Loading..." text */}
    </div>
  );
}

export default ChatFetchingSpinner;