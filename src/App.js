
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <header className="text-center">
        <img src={logo} className="h-20 w-20 mx-auto animate-spin" alt="logo" />
        <h1 className="text-4xl font-bold text-gray-900 mt-4">
          Resume Enhancer
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Edit <code className="bg-gray-200 px-2 py-1 rounded">src/App.js</code> and save to reload.
        </p>
        <a
          className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
