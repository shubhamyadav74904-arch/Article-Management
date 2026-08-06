
import './App.css';
import HomePage from './pages/HomePage';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import React, { Component } from 'react';
import AboutPage from './pages/AboutPage';
import ArticlePage from './pages/ArticlePage';
import NavBar from './NavBar';
// import ArticleList from './components/ArticleList';
import Article from './pages/article';





class App extends Component{
  render(){
    return (
      <Router>
        <header className="project-header">
           <img src="/reading.png" alt="Project Logo" className="brand-logo" />
           <h1 className="project-title">TechBlog</h1>
        </header>
       <div id="page-body">
       <div className='App'>
        <NavBar/>
        
          <Routes>
            <Route path="/" Component={HomePage}exact/>
            <Route path="/about" Component={AboutPage}/>
            <Route path="/article-list" Component={Article}/>
            <Route path="/articles/:name" Component={ArticlePage}/>
          </Routes>
        </div>
        </div>
     </Router>

    )

  }

}
export default App;


// here we have to call HomePage component
