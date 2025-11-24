import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Handle GitHub Pages 404.html redirect
// This code handles the redirect from 404.html for client-side routing
(function(l) {
  if (l.search[1] === '/' ) {
    var decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, null,
        l.pathname.slice(0, -1) + decoded + l.hash
    );
  }
}(window.location))

// Фильтрация ошибок 404 из iframe панели управления
// Эти ошибки происходят внутри iframe и не могут быть исправлены из родительского приложения
const originalError = console.error
console.error = function(...args) {
  const errorMessage = args.join(' ')
  // Фильтруем ошибки 404 от API запросов панели управления
  if (errorMessage.includes('content.constrtodo.ru:3444/api') && 
      errorMessage.includes('404')) {
    // Не выводим эти ошибки в консоль
    return
  }
  // Выводим все остальные ошибки
  originalError.apply(console, args)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter
      basename="/AM_training_project"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
)